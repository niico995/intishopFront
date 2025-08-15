import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const VerificarPerfilSocio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    const verificarPerfil = async () => {
      const token = localStorage.getItem('access') || localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // esta instancia ya manda Authorization
        const res = await axiosInstance.get('sellers/mi-perfil/');
        if (!cancelado && res.status === 200) {
          setCargando(false);
        }
      } catch (err) {
        if (cancelado) return;
        const code = err.response?.status;
        const data = err.response?.data;

        // Diferenciá 401 vs 403 vs 404
        if (code === 401) {
          // token inválido/vencido o no se mandó → login
          navigate('/login', { replace: true });
        } else if (code === 403) {
          // autenticado pero NO socio → llevá a “crear perfil”
          navigate('/socio/crear-perfil', { replace: true });
        } else if (code === 404) {
          // dice que no hay perfil → crear perfil
          navigate('/socio/crear-perfil', { replace: true });
        } else {
          console.error('Error al verificar perfil:', code, data);
          navigate('/login', { replace: true });
        }
      }
    };

    verificarPerfil();
    return () => { cancelado = true; };
  }, [navigate, location.pathname]);

  if (cargando) return <p className="text-center mt-10">Verificando tu perfil...</p>;
  return <Outlet />;
};

export default VerificarPerfilSocio;