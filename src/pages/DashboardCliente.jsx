import { useNavigate } from 'react-router-dom';
import RecargaCredito from './RecargarCredito';
import CreditosDisponibles from './CreditosDisponibles';

const DashboardCliente = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Panel del Cliente</h2>

      <div style={styles.button} onClick={() => navigate('/cliente/perfil')}>
        Cargar/Ver mi perfil
      </div>

      {/* <div style={styles.button} onClick={() => navigate('/cliente/creditos')}>
        Cargar créditos
      </div> */}

      {/* <div style={styles.button} onClick={() => navigate('/productos')}>
        Ver productos disponibles
      </div> */}

      <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Mi Perfil</h1>
      <RecargaCredito />
    </div>
    <CreditosDisponibles />
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
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: 8,
    marginBottom: 15,
    cursor: 'pointer',
    fontSize: 16,
    transition: 'background-color 0.2s ease',
  },
};

export default DashboardCliente;
