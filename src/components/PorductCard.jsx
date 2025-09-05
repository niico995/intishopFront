// // // // src/components/ProductCard.jsx
// // // import { useState } from "react";
// // // import { Link } from "react-router-dom";
// // // import { useCart } from "./CartContext";

// // // export default function ProductCard({ product }) {
// // //   const [qty, setQty] = useState(1);
// // //   const { add } = useCart();

// // //   // 🔧 Tolerante a distintas formas de payload
// // //   const sellerId =
// // //     product.seller_id ??
// // //     product.seller?.id ??
// // //     product.sellerId ??
// // //     product.sellerID ??
// // //     null;

// // //   const sellerNombre =
// // //     product.seller_nombre ??
// // //     product.seller?.nombre_fantasia ??
// // //     product.seller?.name ??
// // //     product.sellerName ??
// // //     "Vendedor";

// // //   const precio = Number(product.precio || 0);
// // //   const cuotas4 = (precio / 4).toFixed(2);
// // //   const stock = product.stock ?? undefined;
// // //   const img =
// // //     product.imagenes?.find(i => i.is_primary)?.url ||
// // //     product.imagenes?.[0]?.url;

// // //   const handleAdd = () => {
// // //     if (qty < 1) return;
// // //     add(
// // //       {
// // //         id: product.id,
// // //         nombre: product.nombre,
// // //         precio,
// // //         seller_id: sellerId,
// // //         seller_nombre: sellerNombre,
// // //         img,
// // //       },
// // //       qty
// // //     );
// // //   };

// // //   return (
// // //     <div className="border rounded-xl p-3 hover:shadow-sm transition">
// // //       {/* Imagen → detalle */}
// // //       <Link
// // //         to={`/producto/${product.id}`}
// // //         className="block aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2"
// // //       >
// // //         {img ? (
// // //           <img src={img} alt={product.nombre} className="w-full h-full object-cover" />
// // //         ) : null}
// // //       </Link>

// // //       {/* Vendedor → página del vendedor (si tenemos id) */}
// // //       {sellerId ? (
// // //         <Link to={`/vendedor/${sellerId}`} className="text-sm text-gray-500 hover:underline">
// // //           {sellerNombre}
// // //         </Link>
// // //       ) : (
// // //         <span className="text-sm text-gray-500">{sellerNombre}</span>
// // //       )}

// // //       {/* Nombre → detalle */}
// // //       <Link to={`/producto/${product.id}`} className="block font-medium line-clamp-2 hover:underline">
// // //         {product.nombre}
// // //       </Link>

// // //       <div className="mt-1">
// // //         <div className="text-lg font-semibold">AR$ {precio.toLocaleString("es-AR")}</div>
// // //         <div className="text-xs text-gray-500">en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}</div>
// // //       </div>

// // //       <div className="mt-2 flex items-center gap-2">
// // //         <input
// // //           type="number"
// // //           min={1}
// // //           max={stock || undefined}
// // //           value={qty}
// // //           onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
// // //           className="w-16 border rounded-md px-2 py-1"
// // //         />
// // //         <button onClick={handleAdd} className="flex-1 px-3 py-2 rounded-md bg-black text-white">
// // //           Agregar al carrito
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // } ---------------------------------------------------------------------------------------------------

// // // ---------------------------------------------------------------------------------------------------

// // // import { useState } from "react";
// // // import { Link } from "react-router-dom";
// // // import { useCart } from "./CartContext";

// // // export default function ProductCard({ product }) {
// // //   const { add } = useCart();

// // //   // ---- Vendedor
// // //   const sellerId =
// // //     product.seller_id ?? product.seller?.id ?? product.sellerId ?? product.sellerID ?? null;

// // //   const sellerNombre =
// // //     product.seller_nombre ??
// // //     product.seller?.nombre_fantasia ??
// // //     product.seller?.name ??
// // //     product.sellerName ??
// // //     "Vendedor";

// // //   // ---- Precio / Imagen
// // //   const precio = Number(product.precio || 0);
// // //   const cuotas4 = (precio / 4).toFixed(2);
// // //   const img =
// // //     product.imagenes?.find((i) => i.is_primary)?.url ||
// // //     product.imagenes?.[0]?.url ||
// // //     null;

// // //   // ---- Stock (solo front)
// // //   // Usa product.stock si es número (o string numérico). Si no lo es, NO muestra "Sin stock".
// // //   const parseNum = (v) => {
// // //     if (typeof v === "number" && Number.isFinite(v)) return v;
// // //     if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
// // //     return null;
// // //   };

// // //   const stockValue = parseNum(product.stock);        // número o null (desconocido)
// // //   const hasStockNumber = stockValue !== null;
// // //   const sinStock = hasStockNumber ? stockValue <= 0 : false;
// // //   const maxStock = hasStockNumber ? stockValue : Infinity;

// // //   // ---- Cantidad (string para que en mobile puedas borrar/tipear)
// // //   const [qtyStr, setQtyStr] = useState("1");

// // //   const clamp = (n) => {
// // //     const min = 1;
// // //     const max = maxStock; // Infinity si no tenemos número; no mostramos "Sin stock"
// // //     const nn = Math.max(min, n);
// // //     return Math.min(nn, max);
// // //   };

// // //   const parseClamp = (v) => {
// // //     const n = parseInt(v, 10);
// // //     if (!Number.isFinite(n)) return 1;
// // //     return clamp(n);
// // //   };

// // //   const onChangeQty = (e) => {
// // //     const v = e.target.value;
// // //     if (v === "" || /^[0-9]+$/.test(v)) {
// // //       // permitimos vacío mientras escribe; al salir se corrige
// // //       setQtyStr(v);
// // //     }
// // //   };

// // //   const onBlurQty = () => {
// // //     if (qtyStr === "") setQtyStr("1");
// // //     else setQtyStr(String(parseClamp(qtyStr)));
// // //   };

// // //   const step = (delta) => {
// // //     const base = qtyStr === "" ? 1 : parseInt(qtyStr, 10);
// // //     const next = Number.isFinite(base) ? base + delta : 1;
// // //     setQtyStr(String(clamp(next)));
// // //   };

// // //   const handleAdd = () => {
// // //     const qty = parseClamp(qtyStr);
// // //     if (qty < 1 || sinStock) return;
// // //     add(
// // //       {
// // //         id: product.id,
// // //         nombre: product.nombre,
// // //         precio,
// // //         seller_id: sellerId,
// // //         seller_nombre: sellerNombre,
// // //         img: img || undefined,
// // //       },
// // //       qty
// // //     );
// // //   };

// // //   return (
// // //     <div className="border rounded-xl p-3 hover:shadow-sm transition">
// // //       {/* Imagen → detalle */}
// // //       <Link
// // //         to={`/producto/${product.id}`}
// // //         className="block aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2"
// // //       >
// // //         {img ? <img src={img} alt={product.nombre} className="w-full h-full object-cover" /> : null}
// // //       </Link>

// // //       {/* Vendedor */}
// // //       {sellerId ? (
// // //         <Link to={`/vendedor/${sellerId}`} className="text-sm text-gray-500 hover:underline">
// // //           {sellerNombre}
// // //         </Link>
// // //       ) : (
// // //         <span className="text-sm text-gray-500">{sellerNombre}</span>
// // //       )}

// // //       {/* Nombre → detalle */}
// // //       <Link to={`/producto/${product.id}`} className="block font-medium line-clamp-2 hover:underline">
// // //         {product.nombre}
// // //       </Link>

// // //       <div className="mt-1">
// // //         <div className="text-lg font-semibold">AR$ {precio.toLocaleString("es-AR")}</div>
// // //         <div className="text-xs text-gray-500">
// // //           en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}
// // //         </div>
// // //       </div>

// // //       {/* Controles */}
// // //       <div className="mt-2 flex items-stretch gap-2">
// // //         <div className="flex items-stretch border rounded-md overflow-hidden">
// // //           <button
// // //             type="button"
// // //             onClick={() => step(-1)}
// // //             className="px-2 text-sm disabled:opacity-50"
// // //             disabled={sinStock || parseClamp(qtyStr || "1") <= 1}
// // //             aria-label="Disminuir cantidad"
// // //           >
// // //             −
// // //           </button>

// // //           <input
// // //             type="text"
// // //             inputMode="numeric"
// // //             pattern="[0-9]*"
// // //             min={1}
// // //             max={hasStockNumber ? stockValue : undefined}
// // //             value={qtyStr}
// // //             onChange={onChangeQty}
// // //             onBlur={onBlurQty}
// // //             className="w-14 text-center outline-none"
// // //             disabled={sinStock}
// // //             aria-label="Cantidad"
// // //           />

// // //           <button
// // //             type="button"
// // //             onClick={() => step(1)}
// // //             className="px-2 text-sm disabled:opacity-50"
// // //             disabled={
// // //               sinStock ||
// // //               (hasStockNumber && parseClamp(qtyStr || "1") >= stockValue)
// // //             }
// // //             aria-label="Aumentar cantidad"
// // //           >
// // //             +
// // //           </button>
// // //         </div>

// // //         <button
// // //           onClick={handleAdd}
// // //           disabled={sinStock}
// // //           className="flex-1 px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
// // //         >
// // //           Agregar
// // //         </button>
// // //       </div>

// // //       {/* Mensajes de stock */}
// // //       {hasStockNumber ? (
// // //         stockValue <= 0 ? (
// // //           <div className="mt-1 text-xs text-red-600">Sin stock</div>
// // //         ) : (
// // //           <div className="mt-1 text-xs text-gray-500">Stock: {stockValue}</div>
// // //         )
// // //       ) : null}
// // //     </div>
// // //   );
// // // }
// // import { Link } from "react-router-dom";

// // const PLACEHOLDER = "/img/placeholder-product.png"; // ajustá a tu asset

// // const precioFmt = (v) => {
// //   const n = Number(v ?? 0);
// //   return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
// // };

// // export default function ProductCard({ product, to = null }) {
// //   // Fallbacks de imagen (destacados traen primary_image)
// //   const img =
// //     product?.imagenes?.find?.((i) => i.is_primary)?.url ||
// //     product?.imagenes?.[0]?.url ||
// //     product?.primary_image ||
// //     null;

// //   const linkTo = to || `/producto/${product?.id}`; // si tu ruta es /tienda/producto/:id, cambialo acá

// //   return (
// //     <Link
// //       to={linkTo}
// //       className="rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors block"
// //     >
// //       <div className="aspect-[4/3] bg-black/20">
// //         <img
// //           src={img || PLACEHOLDER}
// //           alt={product?.nombre || "Producto"}
// //           className="w-full h-full object-cover"
// //           loading="lazy"
// //         />
// //       </div>
// //       <div className="p-3">
// //         <div className="text-sm text-gray-300 line-clamp-2">{product?.nombre}</div>
// //         <div className="mt-1 text-base font-semibold">{precioFmt(product?.precio)}</div>
// //         {product?.seller_nombre && (
// //           <div className="mt-0.5 text-[11px] text-gray-400">por {product.seller_nombre}</div>
// //         )}
// //       </div>
// //     </Link>
// //   );
// // }
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "./CartContext";

// export default function ProductCard({ product }) {
//   const { add } = useCart();

//   // ---- Vendedor
//   const sellerId =
//     product.seller_id ?? product.seller?.id ?? product.sellerId ?? product.sellerID ?? null;

//   const sellerNombre =
//     product.seller_nombre ??
//     product.seller?.nombre_fantasia ??
//     product.seller?.name ??
//     product.sellerName ??
//     "Vendedor";

//   // ---- Precio / Imagen
//   const precio = Number(product.precio || 0);
//   const cuotas4 = (precio / 4).toFixed(2);
//   const img =
//     product.imagenes?.find((i) => i.is_primary)?.url ||
//     product.imagenes?.[0]?.url ||
//     null;

//   // ---- Stock (solo front)
//   // Usa product.stock si es número (o string numérico). Si no lo es, NO muestra "Sin stock".
//   const parseNum = (v) => {
//     if (typeof v === "number" && Number.isFinite(v)) return v;
//     if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
//     return null;
//   };

//   const stockValue = parseNum(product.stock);        // número o null (desconocido)
//   const hasStockNumber = stockValue !== null;
//   const sinStock = hasStockNumber ? stockValue <= 0 : false;
//   const maxStock = hasStockNumber ? stockValue : Infinity;

//   // ---- Cantidad (string para que en mobile puedas borrar/tipear)
//   const [qtyStr, setQtyStr] = useState("1");

//   const clamp = (n) => {
//     const min = 1;
//     const max = maxStock; // Infinity si no tenemos número; no mostramos "Sin stock"
//     const nn = Math.max(min, n);
//     return Math.min(nn, max);
//   };

//   const parseClamp = (v) => {
//     const n = parseInt(v, 10);
//     if (!Number.isFinite(n)) return 1;
//     return clamp(n);
//   };

//   const onChangeQty = (e) => {
//     const v = e.target.value;
//     if (v === "" || /^[0-9]+$/.test(v)) {
//       // permitimos vacío mientras escribe; al salir se corrige
//       setQtyStr(v);
//     }
//   };

//   const onBlurQty = () => {
//     if (qtyStr === "") setQtyStr("1");
//     else setQtyStr(String(parseClamp(qtyStr)));
//   };

//   const step = (delta) => {
//     const base = qtyStr === "" ? 1 : parseInt(qtyStr, 10);
//     const next = Number.isFinite(base) ? base + delta : 1;
//     setQtyStr(String(clamp(next)));
//   };

//   const handleAdd = () => {
//     const qty = parseClamp(qtyStr);
//     if (qty < 1 || sinStock) return;
//     add(
//       {
//         id: product.id,
//         nombre: product.nombre,
//         precio,
//         seller_id: sellerId,
//         seller_nombre: sellerNombre,
//         img: img || undefined,
//       },
//       qty
//     );
//   };

//   return (
//     <div className="border rounded-xl p-3 hover:shadow-sm transition">
//       {/* Imagen → detalle */}
//       <Link
//         to={`/producto/${product.id}`}
//         className="block aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2"
//       >
//         {img ? <img src={img} alt={product.nombre} className="w-full h-full object-cover" /> : null}
//       </Link>

//       {/* Vendedor */}
//       {sellerId ? (
//         <Link to={`/vendedor/${sellerId}`} className="text-sm text-gray-500 hover:underline">
//           {sellerNombre}
//         </Link>
//       ) : (
//         <span className="text-sm text-gray-500">{sellerNombre}</span>
//       )}

//       {/* Nombre → detalle */}
//       <Link to={`/producto/${product.id}`} className="block font-medium line-clamp-2 hover:underline">
//         {product.nombre}
//       </Link>

//       <div className="mt-1">
//         <div className="text-lg font-semibold">AR$ {precio.toLocaleString("es-AR")}</div>
//         <div className="text-xs text-gray-500">
//           en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}
//         </div>
//       </div>

//       {/* Controles */}
//       <div className="mt-2 flex items-stretch gap-2">
//         <div className="flex items-stretch border rounded-md overflow-hidden">
//           <button
//             type="button"
//             onClick={() => step(-1)}
//             className="px-2 text-sm disabled:opacity-50"
//             disabled={sinStock || parseClamp(qtyStr || "1") <= 1}
//             aria-label="Disminuir cantidad"
//           >
//             −
//           </button>

//           <input
//             type="text"
//             inputMode="numeric"
//             pattern="[0-9]*"
//             min={1}
//             max={hasStockNumber ? stockValue : undefined}
//             value={qtyStr}
//             onChange={onChangeQty}
//             onBlur={onBlurQty}
//             className="w-14 text-center outline-none"
//             disabled={sinStock}
//             aria-label="Cantidad"
//           />

//           <button
//             type="button"
//             onClick={() => step(1)}
//             className="px-2 text-sm disabled:opacity-50"
//             disabled={
//               sinStock ||
//               (hasStockNumber && parseClamp(qtyStr || "1") >= stockValue)
//             }
//             aria-label="Aumentar cantidad"
//           >
//             +
//           </button>
//         </div>

//         <button
//           onClick={handleAdd}
//           disabled={sinStock}
//           className="flex-1 px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Agregar
//         </button>
//       </div>

//       {/* Mensajes de stock */}
//       {hasStockNumber ? (
//         stockValue <= 0 ? (
//           <div className="mt-1 text-xs text-red-600">Sin stock</div>
//         ) : (
//           <div className="mt-1 text-xs text-gray-500">Stock: {stockValue}</div>
//         )
//       ) : null}
//     </div>
//   );
// }
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  // IDs y nombres de vendedor tolerantes a distintas props
  const sellerId =
    product.seller_id ??
    product.seller?.id ??
    product.sellerId ??
    product.sellerID ??
    null;

  const sellerNombre =
    product.seller_nombre ??
    product.sellerNombre ??
    product.seller?.nombre ??
    "Vendedor";

  // imagen: usa lista de imágenes o primary_image
  const img =
    (Array.isArray(product.imagenes) && product.imagenes[0]?.url) ||
    product.primary_image ||
    null;

  const hasStockNumber = typeof product.stock !== "undefined";
  const stockValue = Number(product.stock ?? 0);
  const hasStock = !hasStockNumber || stockValue > 0;

  const addToCart = () => {
    const price = Number(product.precio ?? product.price ?? 0);
    const id = product.id;
    const name = product.nombre ?? product.name ?? "Producto";
    const qtyInt = Math.max(1, parseInt(qty, 10) || 1);

    add(
      {
        id,
        name,
        price,
        image: img,
        seller_id: sellerId,
        seller_nombre: sellerNombre,
      },
      qtyInt
    );
  };

  return (
    <div className="border rounded-xl p-3 hover:shadow-sm transition">
      {/* Imagen → detalle */}
      <Link
        to={`/producto/${product.id}`}
        className="block aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2"
      >
        {img ? (
          <img
            src={img}
            alt={product.nombre}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : null}
      </Link>

      {/* Vendedor */}
      {sellerId ? (
        <Link to={`/vendedor/${sellerId}`} className="text-sm text-gray-500 hover:underline">
          {sellerNombre}
        </Link>
      ) : (
        <span className="text-sm text-gray-500">{sellerNombre}</span>
      )}

      {/* Nombre */}
      <Link to={`/producto/${product.id}`} className="block font-semibold mt-1 line-clamp-2">
        {product.nombre}
      </Link>

      {/* Precio */}
      <div className="mt-1 text-lg">${Number(product.precio ?? 0).toFixed(2)}</div>

      {/* Comprar / Stock */}
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-16 px-2 py-1 border rounded"
        />
        <button
          onClick={addToCart}
          disabled={!hasStock}
          className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          Añadir
        </button>
      </div>

      {/* Mensajes de stock */}
      {hasStockNumber ? (
        stockValue <= 0 ? (
          <div className="mt-1 text-xs text-red-600">Sin stock</div>
        ) : (
          <div className="mt-1 text-xs text-gray-500">Stock: {stockValue}</div>
        )
      ) : null}
    </div>
  );
}
