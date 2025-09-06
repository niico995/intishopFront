
import { useState, useEffect } from 'react';
import axios from 'axios';

const MiPerfilSocio = () => {
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    cuit: '',
    direccion_local: '',
    telefono: '',
    celular: '',
    nombre_fantasia: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await axios.get(
          'https://intishopback.onrender.com/api/sellers/mi-perfil/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPerfil(res.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener los datos del perfil');
      }
    };

    fetchPerfil();
  }, [token]);

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await axios.put(
        'https://intishopback.onrender.com/api/sellers/mi-perfil/',
        perfil,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMensaje('Perfil actualizado correctamente');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el perfil');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

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
              value={perfil[key] || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default MiPerfilSocio;
