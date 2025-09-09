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
//     axios.get(`products/public/${id}/`).then(r => setP(r.data)).catch(() => setP(null));
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
// import { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// // ⬇️ opcional: si querés evitar mandar Authorization a un endpoint público
// // import axios from "../api/axiosPublic";
// import axios from "../api/axiosPublic";
// import { useCart } from "../components/CartContext";

// const fmtARS = (v) =>
//   Number(v).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// export default function ProductoDetalle() {
//   const { id } = useParams();
//   const [p, setP] = useState(null);
//   const [error, setError] = useState("");
//   const [qty, setQty] = useState(1);
//   const [selIdx, setSelIdx] = useState(null); // 👈 arranca sin selección
//   const { add } = useCart();

//   useEffect(() => {
//     let cancel = false;
//     setError("");
//     setP(null);
//     setSelIdx(null); // 👈 resetea selección al cambiar de producto

//     axios
//       .get(`products/public/${id}/`)
//       .then((r) => {
//         if (cancel) return;
//         setP(r.data);
//       })
//       .catch(() => {
//         if (cancel) return;
//         setError("No pudimos cargar el producto.");
//       });

//     return () => {
//       cancel = true;
//     };
//   }, [id]);

//   const imagenes = p?.imagenes || [];

//   // 👇 lógica corregida: si el usuario eligió miniatura, manda esa; si no, primaria; si no, la primera
//   const activeUrl = useMemo(() => {
//     if (!imagenes.length) return null;
//     if (selIdx !== null && imagenes[selIdx]) return imagenes[selIdx].url;
//     const prim = imagenes.find((i) => i.is_primary);
//     return prim?.url || imagenes[0].url;
//   }, [imagenes, selIdx]);

//   if (error) return <div className="max-w-6xl mx-auto p-4">{error}</div>;
//   if (!p) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

//   const precio = Number(p.precio);
//   const cuotas4 = (precio / 4).toFixed(2);
//   const sinStock = (p.stock ?? 0) <= 0;

//   const onQty = (v) => {
//     const max = p.stock ?? Infinity;
//     const n = Math.max(1, Math.min(max, Number(v) || 1));
//     setQty(n);
//   };

//   const addToCart = () => {
//     if (sinStock) return;
//     const item = {
//       id: p.id,
//       nombre: p.nombre,
//       precio,
//       seller_id: p.seller_id,
//       seller_nombre: p.seller_nombre,
//       img: activeUrl || undefined,
//     };
//     add(item, qty);
//   };

//   // helper para resaltar miniatura activa
//   const isThumbActive = (idx, img) =>
//     selIdx !== null ? idx === selIdx : !!img.is_primary || idx === 0;

//   return (
//     <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Galería */}
//       <div>
//         <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
//           {activeUrl ? (
//             <img
//               src={activeUrl}
//               alt={p.nombre}
//               className="w-full h-full object-cover"
//               loading="eager"
//               decoding="async"
//             />
//           ) : null}
//         </div>

//         {/* Miniaturas */}
//         {imagenes.length > 1 && (
//           <div className="flex gap-2 flex-wrap">
//             {imagenes.map((img, idx) => (
//               <button
//                 key={img.id || idx}
//                 type="button"
//                 onClick={() => setSelIdx(idx)}
//                 className={`w-16 h-16 rounded-md border overflow-hidden ${
//                   isThumbActive(idx, img) ? "ring-2 ring-black" : ""
//                 }`}
//                 aria-label={`Imagen ${idx + 1}`}
//                 aria-selected={isThumbActive(idx, img)}
//               >
//                 <img
//                   src={img.url}
//                   alt=""
//                   className="w-full h-full object-cover"
//                   loading="lazy"
//                   decoding="async"
//                 />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div>
//         <h1 className="text-2xl font-semibold">{p.nombre}</h1>

//         <div className="text-sm text-gray-500 mb-2">
//           {p.seller_id ? (
//             <Link to={`/vendedor/${p.seller_id}`} className="underline hover:no-underline">
//               {p.seller_nombre}
//             </Link>
//           ) : (
//             p.seller_nombre
//           )}
//         </div>

//         <div className="text-3xl font-bold">AR$ {fmtARS(precio)}</div>
//         <div className="text-sm text-gray-500">
//           en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
//         </div>

//         <div className="mt-2 text-sm">
//           Stock:{" "}
//           {sinStock ? (
//             <span className="text-red-600 font-medium">Sin stock</span>
//           ) : (
//             <span>{p.stock}</span>
//           )}
//         </div>

//         <p className="mt-4 text-gray-700 whitespace-pre-line">{p.descripcion}</p>

//         <div className="mt-6 flex items-center gap-3">
//           <input
//             type="number"
//             min={1}
//             max={p.stock || undefined}
//             value={qty}
//             onChange={(e) => onQty(e.target.value)}
//             className="w-24 border rounded-md px-3 py-2"
//           />
//           <button
//             onClick={addToCart}
//             disabled={sinStock}
//             className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Agregar al carrito
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosPublic"; // público para detalle
import { useCart } from "../components/CartContext";

const fmtARS = (v) =>
  Number(v).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function ProductoDetalle() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [error, setError] = useState("");
  const [qtyStr, setQtyStr] = useState("1"); // 👈 string-friendly para mobile
  const [selIdx, setSelIdx] = useState(null); // arranca sin selección
  const { add } = useCart();

  useEffect(() => {
    let cancel = false;
    setError("");
    setP(null);
    setSelIdx(null);
    setQtyStr("1");

    axios
      .get(`products/public/${id}/`)
      .then((r) => {
        if (cancel) return;
        setP(r.data);
      })
      .catch(() => {
        if (cancel) return;
        setError("No pudimos cargar el producto.");
      });

    return () => {
      cancel = true;
    };
  }, [id]);

  const imagenes = p?.imagenes || [];

  const activeUrl = useMemo(() => {
    if (!imagenes.length) return null;
    if (selIdx !== null && imagenes[selIdx]) return imagenes[selIdx].url;
    const prim = imagenes.find((i) => i.is_primary);
    return prim?.url || imagenes[0].url;
  }, [imagenes, selIdx]);

  if (error) return <div className="max-w-6xl mx-auto p-4">{error}</div>;
  if (!p) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

  const precio = Number(p.precio);
  const cuotas4 = (precio / 4).toFixed(2);
  const sinStock = (p.stock ?? 0) <= 0;
  const maxStock = typeof p.stock === "number" ? p.stock : Infinity;

  const parseClamp = (v) => {
    const n = parseInt(v, 10);
    if (!n || n < 1) return 1;
    return Math.min(n, maxStock);
  };

  const onQtyChange = (e) => {
    const v = e.target.value;
    if (v === "" || /^[0-9]+$/.test(v)) setQtyStr(v);
  };

  const onQtyBlur = () => {
    setQtyStr(String(parseClamp(qtyStr)));
  };

  const step = (delta) => {
    const next = parseClamp(qtyStr === "" ? "1" : qtyStr);
    const res = Math.min(Math.max(next + delta, 1), maxStock);
    setQtyStr(String(res));
  };

  const addToCart = () => {
    if (sinStock) return;
    const qty = parseClamp(qtyStr);
    const item = {
      id: p.id,
      nombre: p.nombre,
      precio,
      seller_id: p.seller_id,
      seller_nombre: p.seller_nombre,
      img: activeUrl || undefined,
    };
    add(item, qty);
  };

  const isThumbActive = (idx, img) =>
    selIdx !== null ? idx === selIdx : !!img.is_primary || idx === 0;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Galería */}
      <div>
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          {activeUrl ? (
            <img
              src={activeUrl}
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
            {imagenes.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelIdx(idx)}
                className={`w-16 h-16 rounded-md border overflow-hidden ${
                  isThumbActive(idx, img) ? "ring-2 ring-black" : ""
                }`}
                aria-label={`Imagen ${idx + 1}`}
                aria-selected={isThumbActive(idx, img)}
              >
                <img
                  src={img.url}
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

        <div className="mt-6 flex items-stretch gap-3">
          <div className="flex items-stretch border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => step(-1)}
              className="px-3 text-base disabled:opacity-50"
              disabled={sinStock}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={p.stock || undefined}
              value={qtyStr}
              onChange={onQtyChange}
              onBlur={onQtyBlur}
              className="w-20 text-center outline-none"
              disabled={sinStock}
              aria-label="Cantidad"
            />
            <button
              type="button"
              onClick={() => step(1)}
              className="px-3 text-base disabled:opacity-50"
              disabled={sinStock || (typeof p.stock === "number" && parseClamp(qtyStr) >= p.stock)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

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