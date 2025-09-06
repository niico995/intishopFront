
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearPerfilSocio = () => {
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    cuit: '',
    direccion_local: '',
    telefono: '',
    celular: '',
    nombre_fantasia: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await axios.post(
        'https://intishopback.onrender.com/api/sellers/crear-perfil/',
        perfil,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje('Perfil creado correctamente');
      setTimeout(() => navigate('/mi-perfil'), 1500); // lo lleva al edit
    } catch (err) {
      console.error(err);
      setError('Error al crear el perfil');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Perfil de Socio</h2>

      {mensaje && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{mensaje}</div>}
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['nombre', 'Nombre'],
          ['apellido', 'Apellido'],
          ['cuit', 'CUIT'],
          ['direccion_local', 'Dirección del local'],
          ['telefono', 'Teléfono'],
          ['celular', 'Celular'],
          ['nombre_fantasia', 'Nombre de fantasía']
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={key}
              value={perfil[key]}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Crear Perfil
        </button>
      </form>
    </div>
  );
};

export default CrearPerfilSocio;
