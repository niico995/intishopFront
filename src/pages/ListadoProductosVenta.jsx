import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

const currency = (v) => Number(v ?? 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

export default function ListadoProductosVenta({ onAgregar }) {
  const [productos, setProductos] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => { getProductos(); }, []);

  const getProductos = async () => {
    try {
      setErr('');
      const res = await axios.get('/products/tienda/productos/');
      const d = res?.data;
      const arr = Array.isArray(d) ? d : (d?.results ?? d?.items ?? []);
      setProductos(arr);
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || 'No se pudieron cargar los productos');
      setProductos([]);
    }
  };

  if (err) return <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded">{err}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {productos.map((prod) => {
        const img = prod.imagen_principal || prod.imagenes?.[0]?.url || null;

        return (
          <div key={prod.id} className="flex flex-col rounded-2xl border shadow-sm overflow-hidden">
            <div className="aspect-square bg-neutral-100">
              {img && <img src={img} alt={prod.nombre} className="w-full h-full object-cover" />}
            </div>
            <div className="p-3 flex flex-col gap-1">
              <div className="text-sm font-medium truncate">{prod.nombre}</div>
              <div className="text-xs opacity-60 truncate">{prod.seller_nombre || prod.seller?.nombre_fantasia || '-'}</div>
              <div className="mt-1 text-lg font-semibold">{currency(prod.precio)}</div>
              <button
                onClick={() => onAgregar?.(prod)}
                className="mt-2 bg-black text-white py-2 px-3 rounded-lg hover:opacity-90"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
