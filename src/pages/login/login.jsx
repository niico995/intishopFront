import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function decodeJWT(rawToken) {
  try {
    if (!rawToken) return null;
    let token = String(rawToken).trim().replace(/^Bearer\s+/i, "");
    token = token.replace(/^"|"$/g, "");
    const [, payloadPart] = token.split('.');
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('login/', { email, password });
      const token = res.data.access;

      // guarda token (tu AuthContext lo pone en localStorage)
      login(token);

      // decodifica de forma segura
      const payload = decodeJWT(token) || {};
      const rol = payload.role;
      const isStaff = !!payload.is_staff;

      // redirecciones
      if (rol === 'admin' || isStaff) navigate('/admin/resumen-pagos');
      else if (rol === 'socio') navigate('/socio/productos');
      else navigate('/dashboard-cliente');

    } catch (err) {
      console.error(err);
      alert('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default Login;
