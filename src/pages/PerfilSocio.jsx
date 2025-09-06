
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const PerfilSocio = () => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('sellers/mi-perfil/');
        setPerfil(res.data);
      } catch (err) {
        setError('No se pudo cargar el perfil');
        console.error(err);
      }
    };
    fetchPerfil();
  }, []);

  if (error) return <p>{error}</p>;
  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {perfil.nombre} {perfil.apellido}</p>
      <p><strong>CUIT:</strong> {perfil.cuit}</p>
      <p><strong>Dirección:</strong> {perfil.direccion_local}</p>
      <p><strong>Teléfono:</strong> {perfil.telefono}</p>
      <p><strong>Celular:</strong> {perfil.celular}</p>
      <p><strong>Nombre de Fantasía:</strong> {perfil.nombre_fantasia}</p>
      <p><strong>Estado:</strong> {perfil.estado}</p>
    </div>
  );
};

export default PerfilSocio;
