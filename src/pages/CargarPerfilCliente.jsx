import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const CargarPerfilCliente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dni: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    addressStreet: '',
    addressHouseNumber: '',
    addressCity: '',
    addressNeighborhood: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await api.post('gocuotas/crear-perfil/', formData);
      setMensaje('Perfil creado correctamente');
      setTimeout(() => navigate('/dashboard-cliente'), 1500);
    } catch (err) {
      console.error(err);
      setError('Error al crear el perfil. Verificá si ya fue creado o si hay datos inválidos.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Cargar Perfil de Cliente</h2>

      {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input type="number" name="dni" placeholder="DNI" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Apellido" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Teléfono" onChange={handleChange} required />
        <input type="text" name="addressStreet" placeholder="Calle" onChange={handleChange} required />
        <input type="number" name="addressHouseNumber" placeholder="Número" onChange={handleChange} required />
        <input type="text" name="addressCity" placeholder="Ciudad" onChange={handleChange} required />
        <input type="text" name="addressNeighborhood" placeholder="Barrio" onChange={handleChange} required />

        <button type="submit" style={{ padding: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 5 }}>
          Guardar Perfil
        </button>
      </form>
    </div>
  );
};

export default CargarPerfilCliente;
