import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://intishopback.onrender.com/api/';

const Registro = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    token: '',
    codigo: '',
  });

  const [fase, setFase] = useState('verificacion'); // 'verificacion' | 'registro'
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [reintentarEn, setReintentarEn] = useState(0);
  const [esperaActiva, setEsperaActiva] = useState(false);

  const role = (() => {
    if (pathname.includes('cliente')) return 'cliente';
    if (pathname.includes('socio')) return 'socio';
    if (pathname.includes('admin')) return 'admin';
    return null;
  })();

  // Prefill del token por querystring si /registro/admin?token=...
  useEffect(() => {
    if (role === 'admin') {
      const urlParams = new URLSearchParams(search);
      const t = urlParams.get('token');
      if (t) setForm((f) => ({ ...f, token: t }));
    }
  }, [role, search]);

  // Countdown para reenviar código
  useEffect(() => {
    let intervalo;
    if (reintentarEn > 0) {
      intervalo = setInterval(() => setReintentarEn((prev) => prev - 1), 1000);
    }
    return () => clearInterval(intervalo);
  }, [reintentarEn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviarCodigo = async () => {
    setMensaje('');
    setError('');
    if (!form.email) return setError('Email requerido');

    if (role === 'admin' && !form.token) {
      return setError('Token de Admin requerido');
    }

    setEsperaActiva(true);
    setReintentarEn(60);
    try {
      const url = `${API}users/register/${role}/`;
      const payload = { email: form.email };
      if (role === 'admin') payload.token = form.token;

      await axios.post(url, payload);
      setMensaje('Código enviado al email');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el código');
      setEsperaActiva(false);
      setReintentarEn(0);
    }
  };

  const verificarYRegistrar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!form.email || !form.password || !form.codigo) {
      return setError('Completá email, contraseña y código');
    }

    try {
      // 1) Verificar y registrar
      const verifyUrl = `${API}users/verificar-registro/`;
      const payload = {
        email: form.email,
        password: form.password,
        code: form.codigo,
        role: role,
      };
      const res = await axios.post(verifyUrl, payload);
      setMensaje(res.data.message || 'Usuario registrado correctamente');

      // 2) Login automático
      const loginUrl = `${API}login/`;
      const loginRes = await axios.post(loginUrl, {
        email: form.email,
        password: form.password,
      });

      // Guardar token en contexto
      const access = loginRes?.data?.access;
      if (!access) throw new Error('No se recibió el token');
      login(access);

      // 3) Redirigir según el JWT real
      let rol = null;
      let isStaff = false;
      try {
        const payloadJwt = JSON.parse(atob(access.split('.')[1]));
        rol = payloadJwt?.role || null;
        isStaff = !!payloadJwt?.is_staff;
      } catch {
        // si falla el decode, seguimos con fallback por ruta
      }

      if (rol === 'admin' || isStaff) navigate('/admin');
      else if (rol === 'socio') navigate('/socio/productos');
      else navigate('/dashboard-cliente');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          'Error al verificar y registrar'
      );
    }
  };

  if (!role) return <p className="text-center text-red-600 mt-10">Ruta inválida</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Registro {role.toUpperCase()}</h2>

      {fase === 'verificacion' && (
        <>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full border rounded p-2 mb-4"
            required
          />

          {role === 'admin' && (
            <input
              name="token"
              placeholder="Token de Admin"
              value={form.token}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-4"
            />
          )}

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={enviarCodigo}
            disabled={esperaActiva}
          >
            {esperaActiva ? `Reenviar en ${reintentarEn}s` : 'Enviar código al email'}
          </button>

          <button
            onClick={() => setFase('registro')}
            className="w-full mt-3 text-sm text-blue-500 hover:underline"
          >
            Ya tengo el código
          </button>
        </>
      )}

      {fase === 'registro' && (
        <form onSubmit={verificarYRegistrar}>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full border rounded p-2 mb-3"
            required
          />
          <input
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="w-full border rounded p-2 mb-3"
            required
          />
          <input
            name="codigo"
            placeholder="Código recibido por email"
            value={form.codigo}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-3"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Registrar y entrar
          </button>
        </form>
      )}

      {mensaje && <p className="text-green-600 text-sm mt-4">{mensaje}</p>}
      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default Registro;
