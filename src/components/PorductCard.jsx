// // src/components/ProductCard.jsx
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "./CartContext";

// export default function ProductCard({ product }) {
//   const [qty, setQty] = useState(1);
//   const { add } = useCart();

//   // 🔧 Tolerante a distintas formas de payload
//   const sellerId =
//     product.seller_id ??
//     product.seller?.id ??
//     product.sellerId ??
//     product.sellerID ??
//     null;

//   const sellerNombre =
//     product.seller_nombre ??
//     product.seller?.nombre_fantasia ??
//     product.seller?.name ??
//     product.sellerName ??
//     "Vendedor";

//   const precio = Number(product.precio || 0);
//   const cuotas4 = (precio / 4).toFixed(2);
//   const stock = product.stock ?? undefined;
//   const img =
//     product.imagenes?.find(i => i.is_primary)?.url ||
//     product.imagenes?.[0]?.url;

//   const handleAdd = () => {
//     if (qty < 1) return;
//     add(
//       {
//         id: product.id,
//         nombre: product.nombre,
//         precio,
//         seller_id: sellerId,
//         seller_nombre: sellerNombre,
//         img,
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
//         {img ? (
//           <img src={img} alt={product.nombre} className="w-full h-full object-cover" />
//         ) : null}
//       </Link>

//       {/* Vendedor → página del vendedor (si tenemos id) */}
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
//         <div className="text-xs text-gray-500">en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}</div>
//       </div>

//       <div className="mt-2 flex items-center gap-2">
//         <input
//           type="number"
//           min={1}
//           max={stock || undefined}
//           value={qty}
//           onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
//           className="w-16 border rounded-md px-2 py-1"
//         />
//         <button onClick={handleAdd} className="flex-1 px-3 py-2 rounded-md bg-black text-white">
//           Agregar al carrito
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  // Tolerante a distintas formas de payload
  const sellerId =
    product.seller_id ??
    product.seller?.id ??
    product.sellerId ??
    product.sellerID ??
    null;

  const sellerNombre =
    product.seller_nombre ??
    product.seller?.nombre_fantasia ??
    product.seller?.name ??
    product.sellerName ??
    "Vendedor";

  const precio = Number(product.precio || 0);
  const cuotas4 = (precio / 4).toFixed(2);
  const stock = product.stock ?? undefined;
  const img =
    product.imagenes?.find((i) => i.is_primary)?.url ||
    product.imagenes?.[0]?.url;

  const clampQty = (n) => {
    const max = stock ?? Infinity;
    const num = Math.max(1, Math.min(max, Number(n) || 1));
    setQty(num);
  };

  const dec = () => clampQty((qty || 1) - 1);
  const inc = () => clampQty((qty || 1) + 1);

  const handleAdd = () => {
    if (qty < 1) return;
    add(
      {
        id: product.id,
        nombre: product.nombre,
        precio,
        seller_id: sellerId,
        seller_nombre: sellerNombre,
        img,
      },
      qty
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
          <img src={img} alt={product.nombre} className="w-full h-full object-cover" />
        ) : null}
      </Link>

      {/* Vendedor → página del vendedor (si tenemos id) */}
      {sellerId ? (
        <Link to={`/vendedor/${sellerId}`} className="text-sm text-gray-500 hover:underline">
          {sellerNombre}
        </Link>
      ) : (
        <span className="text-sm text-gray-500">{sellerNombre}</span>
      )}

      {/* Nombre → detalle */}
      <Link
        to={`/producto/${product.id}`}
        className="block font-medium line-clamp-2 hover:underline"
      >
        {product.nombre}
      </Link>

      <div className="mt-1">
        <div className="text-lg font-semibold">
          AR$ {precio.toLocaleString("es-AR")}
        </div>
        <div className="text-xs text-gray-500">
          en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}
        </div>
      </div>

      {/* Controles compactos (mejor en mobile) */}
      <div className="mt-2 flex items-stretch gap-2">
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={dec}
            className="px-2 py-1 text-sm hover:bg-gray-50"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            min={1}
            max={stock || undefined}
            value={qty}
            onChange={(e) => clampQty(e.target.value)}
            onBlur={(e) => clampQty(e.target.value)}
            className="w-12 md:w-16 text-center outline-none py-1 text-sm"
            aria-label="Cantidad"
          />
          <button
            type="button"
            onClick={inc}
            className="px-2 py-1 text-sm hover:bg-gray-50"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 px-3 py-2 md:py-2.5 rounded-md bg-black text-white text-sm md:text-base"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}