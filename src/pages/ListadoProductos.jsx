// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from '../api/axiosConfig';

// const ListadoProductos = () => {
//   const [productos, setProductos] = useState([]);
//   const [error, setError] = useState('');
//   const [mensaje, setMensaje] = useState('');

//   // Normaliza cualquier forma común de payload (array directo o envueltos tipo DRF)
//   const normalizeList = (d) => {
//     if (!d) return [];
//     if (Array.isArray(d)) return d;
//     return (
//       d.results ?? d.items ?? d.data ?? d.mis_productos ?? d.products ?? []
//     );
//   };

//   const fetchProductos = async () => {
//     try {
//       const res = await axios.get('products/mis-productos/');
//       setProductos(normalizeList(res.data));
//       setError('');
//     } catch (err) {
//       console.error(err);
//       setProductos([]); // evita mapa sobre algo no-array
//       setError('Error al cargar los productos');
//     }
//   };

//   useEffect(() => {
//     fetchProductos();
//   }, []);

//   const eliminarProducto = async (id) => {
//     if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

//     try {
//       const res = await axios.delete(`products/${id}/eliminar/`);
//       setMensaje(res.data?.message || 'Producto eliminado correctamente');
//       setError('');
//       // Actualizar la lista quitando el producto eliminado (forma segura)
//       setProductos((prev) => (Array.isArray(prev) ? prev.filter((p) => p?.id !== id) : []));
//     } catch (err) {
//       console.error(err);
//       setMensaje('');
//       setError(err?.response?.data?.error || 'Error al eliminar el producto');
//     }
//   };

//   const lista = Array.isArray(productos) ? productos : [];

//   return (
//     <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
//       <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: '32px' }}>Mis Productos</h2>

//       {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

//       {lista.length === 0 ? (
//         <p style={{ textAlign: 'center', fontSize: '32px' }}>No hay productos aún.</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {lista.map((prod) => (
//             <li
//               key={prod.id}
//               style={{
//                 border: '1px solid #ddd',
//                 borderRadius: 8,
//                 padding: 15,
//                 marginBottom: 15,
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//               }}
//             >
//               <h3 style={{ margin: '0 0 10px' }}>{prod?.nombre ?? 'Sin nombre'}</h3>
//               <p style={{ margin: '5px 0' }}>{prod?.descripcion ?? ''}</p>
//               <p style={{ margin: '5px 0' }}>
//                 <strong>Precio:</strong> ${prod?.precio ?? '—'}
//               </p>
//               <p style={{ margin: '5px 0' }}>
//                 <strong>Stock:</strong> {prod?.stock ?? '—'}
//               </p>

//               <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                 <Link
//                   to={`/socio/productos/editar/${prod.id}`}
//                   style={{
//                     padding: '6px 12px',
//                     backgroundColor: '#007bff',
//                     color: '#fff',
//                     textDecoration: 'none',
//                     borderRadius: 5,
//                   }}
//                 >
//                   Editar
//                 </Link>
//                 <button
//                   onClick={() => eliminarProducto(prod.id)}
//                   style={{
//                     padding: '6px 12px',
//                     backgroundColor: '#dc3545',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: 5,
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Eliminar
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ListadoProductos;
import { useEffect, useState } from "react";
import { misProductos, eliminarProducto } from "../api/products";
import { Link } from "react-router-dom";

export default function ListadoProductos() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    misProductos({ page })
      .then((res) => {
        const data = res.data;
        const results = Array.isArray(data) ? data : (data?.results || []);
        setItems(results);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Mis productos</h1>
        <Link to="/cargar" className="px-3 py-2 rounded-lg bg-green-600">+ Nuevo</Link>
      </div>

      {loading ? (
        <div>Cargando…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-400">No tenés productos aún.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400">
            <tr>
              <th className="py-2">ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="py-2">{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.precio}</td>
                <td>{p.stock}</td>
                <td className="text-right">
                  <Link to={`/editar/${p.id}`} className="px-2 py-1 bg-white/10 rounded mr-2">Editar</Link>
                  <button
                    className="px-2 py-1 bg-red-600 rounded"
                    onClick={async () => {
                      if (!confirm("¿Eliminar producto?")) return;
                      await eliminarProducto(p.id);
                      setItems((prev) => prev.filter((x) => x.id !== p.id));
                    }}
                  >Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center gap-2 mt-6">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-2 rounded bg-white/5 disabled:opacity-40">Anterior</button>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-2 rounded bg-white/5">Siguiente</button>
      </div>
    </div>
  );
}
