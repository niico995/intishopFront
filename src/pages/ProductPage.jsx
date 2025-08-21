// // src/pages/ProductoDetalle.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../api/axiosConfig";
// import { useCart } from "../components/CartContext";

// export default function ProductoDetalle() {
//   const { id } = useParams();
//   const [p, setP] = useState(null);
//   const [qty, setQty] = useState(1);
//   const { add } = useCart();

//   useEffect(() => {
//     axios.get(`products/tienda/producto/${id}/`).then(r => setP(r.data)).catch(() => setP(null));
//   }, [id]);

//   if (!p) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

//   const precio = Number(p.precio);
//   const cuotas4 = (precio / 4).toFixed(2);
//   const primary = p.imagenes?.find(i => i.is_primary)?.url || p.imagenes?.[0]?.url;

//   const addToCart = () => {
//     const item = {
//       id: p.id,
//       nombre: p.nombre,
//       precio,
//       seller_id: p.seller_id,
//       seller_nombre: p.seller_nombre,
//       img: primary,
//     };
//     add(item, qty);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
//           {primary ? <img src={primary} alt={p.nombre} className="w-full h-full object-cover" /> : null}
//         </div>
//         {/* miniaturas */}
//         <div className="flex gap-2">
//           {p.imagenes?.map(i => (
//             <img key={i.id} src={i.url} alt="" className="w-16 h-16 object-cover rounded-md border" />
//           ))}
//         </div>
//       </div>

//       <div>
//         <h1 className="text-2xl font-semibold">{p.nombre}</h1>
//         <div className="text-sm text-gray-500 mb-2">{p.seller_nombre}</div>
//         <div className="text-3xl font-bold">AR$ {precio.toLocaleString("es-AR")}</div>
//         <div className="text-sm text-gray-500">en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}</div>
//         <div className="mt-2 text-sm">Stock: {p.stock}</div>
//         <p className="mt-4 text-gray-700 whitespace-pre-line">{p.descripcion}</p>

//         <div className="mt-6 flex items-center gap-3">
//           <input
//             type="number"
//             min={1}
//             max={p.stock || undefined}
//             value={qty}
//             onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
//             className="w-20 border rounded-md px-3 py-2"
//           />
//           <button onClick={addToCart} className="px-4 py-2 rounded-md bg-black text-white">
//             Agregar al carrito
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/ProductoDetalle.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useCart } from "../components/CartContext";

const fmtARS = (v) =>
  Number(v).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function ProductoDetalle() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [selIdx, setSelIdx] = useState(0);
  const { add } = useCart();

  useEffect(() => {
    let cancel = false;
    setError("");
    setP(null);
    setSelIdx(0);

    axios
      .get(`products/tienda/producto/${id}/`)
      .then((r) => {
        if (cancel) return;
        setP(r.data);
      })
      .catch((e) => {
        if (cancel) return;
        setError("No pudimos cargar el producto.");
      });

    return () => {
      cancel = true;
    };
  }, [id]);

  const imagenes = p?.imagenes || [];
  const primary = useMemo(() => {
    if (!imagenes.length) return null;
    // si hay marcada primaria, úsala; si no, la seleccionada; si no, la primera
    const prim = imagenes.find((i) => i.is_primary);
    if (prim) return prim.url;
    return imagenes[selIdx]?.url || imagenes[0].url;
  }, [imagenes, selIdx]);

  if (error) return <div className="max-w-6xl mx-auto p-4">{error}</div>;
  if (!p) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

  const precio = Number(p.precio);
  const cuotas4 = (precio / 4).toFixed(2);
  const sinStock = (p.stock ?? 0) <= 0;

  const onQty = (v) => {
    const max = p.stock ?? Infinity;
    const n = Math.max(1, Math.min(max, Number(v) || 1));
    setQty(n);
  };

  const addToCart = () => {
    if (sinStock) return;
    const item = {
      id: p.id,
      nombre: p.nombre,
      precio,
      seller_id: p.seller_id,
      seller_nombre: p.seller_nombre,
      img: primary || undefined,
    };
    add(item, qty);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Galería */}
      <div>
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          {primary ? (
            <img
              src={primary}
              alt={p.nombre}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : null}
        </div>

        {/* Miniaturas */}
        {imagenes.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {imagenes.map((i, idx) => (
              <button
                key={i.id || idx}
                type="button"
                onClick={() => setSelIdx(idx)}
                className={`w-16 h-16 rounded-md border overflow-hidden ${
                  idx === selIdx ? "ring-2 ring-black" : ""
                }`}
                aria-label={`Imagen ${idx + 1}`}
              >
                <img
                  src={i.url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="text-2xl font-semibold">{p.nombre}</h1>

        <div className="text-sm text-gray-500 mb-2">
          {p.seller_id ? (
            <Link to={`/vendedor/${p.seller_id}`} className="underline hover:no-underline">
              {p.seller_nombre}
            </Link>
          ) : (
            p.seller_nombre
          )}
        </div>

        <div className="text-3xl font-bold">AR$ {fmtARS(precio)}</div>
        <div className="text-sm text-gray-500">
          en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </div>

        <div className="mt-2 text-sm">
          Stock:{" "}
          {sinStock ? (
            <span className="text-red-600 font-medium">Sin stock</span>
          ) : (
            <span>{p.stock}</span>
          )}
        </div>

        <p className="mt-4 text-gray-700 whitespace-pre-line">{p.descripcion}</p>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={p.stock || undefined}
            value={qty}
            onChange={(e) => onQty(e.target.value)}
            className="w-24 border rounded-md px-3 py-2"
          />
          <button
            onClick={addToCart}
            disabled={sinStock}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
