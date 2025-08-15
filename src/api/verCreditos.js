import axios from 'axios';

export const obtenerCreditos = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(
      'http://localhost:8000/api/gocuotas/ver-creditos/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.creditos_disponibles;
  } catch (error) {
    console.error('Error al obtener créditos:', error.response?.data || error.message);
    throw error;
  }
};
