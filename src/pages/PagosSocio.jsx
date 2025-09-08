import { useEffect, useState } from 'react';
import axios from 'axios';

const PagosSocio = () => {
  const [data, setData] = useState({ pendientes: [], pagados: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const normalize = (d) => {
    // si el backend devuelve array viejo -> lo pongo como "pendientes"
    if (Array.isArray(d)) return { pendientes: d, pagados: [] };
    // si devuelve objeto nuevo -> tomo claves
    if (d && typeof d === 'object') {
      return {
        pendientes: Array.isArray(d.pendientes) ? d.pendientes : [],
        pagados: Array.isArray(d.pagados) ? d.pagados : [],
      };
    }
    return { pendientes: [], pagados: [] };
  };

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/sellers/pagos/mios/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(normalize(res.data));
      } catch (err) {
        console.error('PagosSocio error:', err?.response?.status, err?.response?.data || err?.message);
        setError('No se pudieron cargar los pagos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPagos();
  }, [token]);

  if (loading) return <p>Cargando pagos…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const { pendientes, pagados } = data;

  const Item = (p) => (
    <div
      key={p.id}
      style={{
        background: '#f3f3f3', borderRadius: 10, padding: 12,
        marginBottom: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <p><strong>Producto:</strong> {p.producto ?? '—'}</p>
      <p><strong>Venta:</strong> {p.fecha_venta ?? '—'}</p>
      <p><strong>Pago:</strong> {p.fecha_pago ?? '—'}</p>
      <p><strong>Monto:</strong> ${p.monto}</p>
      <p><strong>Estado:</strong> {p.estado === 'pagado' ? '✅ Pagado' : '🕒 Pendiente'}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Pagos pendientes</h2>
      {pendientes.length ? pendientes.map(Item) : <p>No hay pagos pendientes.</p>}

      <h2 style={{ marginTop: 24 }}>Pagos realizados</h2>
      {pagados.length ? pagados.map(Item) : <p>No hay pagos realizados.</p>}
    </div>
  );
};

export default PagosSocio;
