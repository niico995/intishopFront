
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axiosConfig';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Normaliza cualquier forma común de payload (array directo o envueltos tipo DRF)
  const normalizeList = (d) => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    return (
      d.results ?? d.items ?? d.data ?? d.mis_productos ?? d.products ?? []
    );
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get('products/mis-productos/');
      setProductos(normalizeList(res.data));
      setError('');
    } catch (err) {
      console.error(err);
      setProductos([]); // evita mapa sobre algo no-array
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
      setMensaje(res.data?.message || 'Producto eliminado correctamente');
      setError('');
      // Actualizar la lista quitando el producto eliminado (forma segura)
      setProductos((prev) => (Array.isArray(prev) ? prev.filter((p) => p?.id !== id) : []));
    } catch (err) {
      console.error(err);
      setMensaje('');
      setError(err?.response?.data?.error || 'Error al eliminar el producto');
    }
  };

  const lista = Array.isArray(productos) ? productos : [];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: '32px' }}>Mis Productos</h2>

      {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {lista.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '32px' }}>No hay productos aún.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lista.map((prod) => (
            <li
              key={prod.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 15,
                marginBottom: 15,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 10px' }}>{prod?.nombre ?? 'Sin nombre'}</h3>
              <p style={{ margin: '5px 0' }}>{prod?.descripcion ?? ''}</p>
              <p style={{ margin: '5px 0' }}>
                <strong>Precio:</strong> ${prod?.precio ?? '—'}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Stock:</strong> {prod?.stock ?? '—'}
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link
                  to={`/socio/productos/editar/${prod.id}`}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
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
