// src/pages/ProductoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useCart } from "../components/CartContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    axios.get(`products/tienda/producto/${id}/`).then(r => setP(r.data)).catch(() => setP(null));
  }, [id]);

  if (!p) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

  const precio = Number(p.precio);
  const cuotas4 = (precio / 4).toFixed(2);
  const primary = p.imagenes?.find(i => i.is_primary)?.url || p.imagenes?.[0]?.url;

  const addToCart = () => {
    const item = {
      id: p.id,
      nombre: p.nombre,
      precio,
      seller_id: p.seller_id,
      seller_nombre: p.seller_nombre,
      img: primary,
    };
    add(item, qty);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          {primary ? <img src={primary} alt={p.nombre} className="w-full h-full object-cover" /> : null}
        </div>
        {/* miniaturas */}
        <div className="flex gap-2">
          {p.imagenes?.map(i => (
            <img key={i.id} src={i.url} alt="" className="w-16 h-16 object-cover rounded-md border" />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{p.nombre}</h1>
        <div className="text-sm text-gray-500 mb-2">{p.seller_nombre}</div>
        <div className="text-3xl font-bold">AR$ {precio.toLocaleString("es-AR")}</div>
        <div className="text-sm text-gray-500">en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}</div>
        <div className="mt-2 text-sm">Stock: {p.stock}</div>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{p.descripcion}</p>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={p.stock || undefined}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-20 border rounded-md px-3 py-2"
          />
          <button onClick={addToCart} className="px-4 py-2 rounded-md bg-black text-white">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
