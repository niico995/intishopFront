// src/routes/RutasProtegidas.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutasProtegidas = ({ rol }) => {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" />;
  if (rol && usuario.role !== rol) return <Navigate to="/" />;

  return <Outlet />;
};

export default RutasProtegidas;
