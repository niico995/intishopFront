import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axiosConfig';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const fetchProductos = async () => {
    try {
      const res = await axios.get('products/mis-productos/');
      // 🔧 Normalizador: soporta array directo o payloads tipo DRF {count, results:[...]} / {data: [...]}, etc.
      const d = res.data;
      const lista = Array.isArray(d) ? d : (d?.results ?? d?.items ?? d?.data ?? d?.mis_productos ?? d?.products ?? []);
      setProductos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const res = await axios.delete(`products/${id}/eliminar/`);
      setMensaje(res.data.message || 'Producto eliminado correctamente');
      setError('');
      // Actualizar la lista quitando el producto eliminado
      setProductos((prev) => (Array.isArray(prev) ? prev.filter((p) => p.id === undefined || p.id !== id) : []));
    } catch (err) {
      console.error(err);
      setMensaje('');
      setError(err?.response?.data?.error || 'No se pudo eliminar el producto');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mis Productos</h2>

      {mensaje && (
        <div style={{ backgroundColor: '#e7f5e9', color: '#0f5132', padding: 10, borderRadius: 4, marginBottom: 12 }}>
          {mensaje}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fdecea', color: '#842029', padding: 10, borderRadius: 4, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Link
          to="/socio/productos/nuevo"
          style={{
            padding: '8px 14px',
            backgroundColor: '#0d6efd',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 6,
          }}
        >
          + Nuevo producto
        </Link>
      </div>

      {(!Array.isArray(productos) || productos.length === 0) ? (
        <p>No tenés productos todavía.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {(Array.isArray(productos) ? productos : []).map((prod) => (
            <li
              key={prod.id || prod.slug || Math.random()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                border: '1px solid #eee',
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={prod?.imagen_portada || prod?.image || '/no-image.png'}
                  alt={prod?.nombre || 'Producto'}
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{prod?.nombre || 'Sin nombre'}</div>
                  <div style={{ color: '#555', fontSize: 14 }}>
                    Precio: {prod?.precio != null ? `$ ${prod.precio}` : '—'} · Stock: {prod?.stock ?? '—'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link
                  to={`/socio/productos/${prod.id || ''}/editar`}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#198754',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: 5,
                  }}
                >
                  Editar
                </Link>
                <button
                  onClick={() => eliminarProducto(prod.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 5,
                    cursor: 'pointer',
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListadoProductos;
