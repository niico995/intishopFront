
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

/**
 * Guard de rutas de SOCIO.
 * - Si NO hay token → login
 * - Si mi-perfil devuelve 200 → deja pasar
 * - Si mi-perfil devuelve 404/403 → redirige a /socio/crear-perfil
 * - Early-exit: si ya estoy en /socio/crear-perfil, NO verifico nada
 */
export default function VerificarPerfilSocio() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    // ⛳️ Si ya estoy en /socio/crear-perfil, NO verificar (evita loops)
    if (location.pathname.startsWith("/socio/crear-perfil")) {
      setCargando(false);
      return;
    }

    const verificar = async () => {
      const token = localStorage.getItem("access") || localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // axiosInstance ya agrega el Authorization
        const res = await axiosInstance.get("sellers/mi-perfil/");
        if (!cancelado && res.status === 200) {
          setCargando(false); // tiene perfil → renderiza children
        }
      } catch (err) {
        if (cancelado) return;
        const status = err?.response?.status;

        if (status === 401) {
          // token inválido / vencido
          localStorage.removeItem("token");
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/login", { replace: true });
        } else if (status === 403 || status === 404) {
          // autenticado pero sin perfil → a crear perfil
          navigate("/socio/crear-perfil", { replace: true });
        } else {
          console.error("Error verificando perfil:", status, err?.response?.data);
          // fallback prudente: mandamos al login
          navigate("/login", { replace: true });
        }
      }
    };

    verificar();
    return () => {
      cancelado = true;
    };
  }, [navigate, location.pathname]);

  if (cargando) {
    return (
      <div className="w-full flex justify-center mt-10">
        <p className="text-center">Verificando tu perfil...</p>
      </div>
    );
  }

  return <Outlet />;
}
