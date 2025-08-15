import axios from 'axios';

export const crearRecarga = async (monto) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    'http://localhost:8000/api/gocuotas/crear-recarga/',
    { monto },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
