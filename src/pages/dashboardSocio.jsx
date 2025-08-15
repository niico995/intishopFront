import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const DashboardSocio = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarPerfil = async () => {
      try {
        await api.get('sellers/mis-datos/');
        setCargando(false); // Tiene perfil
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate('/socio/perfil'); // No tiene perfil, redirigir
        } else {
          console.error('Error al verificar perfil:', err);
        }
      }
    };

    verificarPerfil();
  }, [navigate]);

  if (cargando) {
    return <p style={{ textAlign: 'center' }}>Cargando...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Panel del Socio</h2>

      <div style={styles.button} onClick={() => navigate('/productos')}>
        Ver mis productos
      </div>

      <div style={styles.button} onClick={() => navigate('/productos/cargar')}>
        Cargar producto
      </div>

      <div style={styles.button} onClick={() => navigate('/pagos')}>
        Ver mis pagos
      </div>

      <div style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={() => navigate('/socio/perfil')}>
        Ver/Editar mi perfil
      </div>
      <div style={styles.button} onClick={() => navigate('/perfil-socio')}>
  Ver mi perfil
</div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '0 auto',
    padding: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: 8,
    marginBottom: 15,
    cursor: 'pointer',
    fontSize: 16,
    transition: 'background-color 0.2s ease',
  }
};

export default DashboardSocio;
