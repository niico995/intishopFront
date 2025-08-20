import { useEffect, useState } from 'react';
import axios from 'axios';

const PagosAdmin = () => {
  const [pagos, setPagos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await axios.get('https://intishopback.onrender.com/api/sellers/pagos/todos/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPagos(res.data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los pagos');
      }
    };
    fetchPagos();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Historial de Pagos a Socios</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pagos.map((pago) => (
        <div
          key={pago.id}
          style={{
            background: '#e7f0ff',
            borderLeft: '5px solid #3399ff',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <p><strong>Socio:</strong> {pago.seller_nombre}</p>
          <p><strong>Producto:</strong> {pago.producto || '—'}</p>
          <p><strong>Venta:</strong> {pago.fecha_venta}</p>
          <p><strong>Pago:</strong> {pago.fecha_pago}</p>
          <p><strong>Monto:</strong> ${pago.monto}</p>
          <p><strong>Estado:</strong> {pago.estado === 'pagado' ? '✅ Pagado' : '🕒 Pendiente'}</p>
        </div>
      ))}
    </div>
  );
};

export default PagosAdmin;
