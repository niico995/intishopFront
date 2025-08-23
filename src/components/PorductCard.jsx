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

/** Convierte a número seguro o null */
function toNum(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Stock ESTRICTO:
 * - Usa campos numéricos si existen
 * - Suma por depósito si viene array
 * - Si no hay nada numérico → 0 (sin stock)
 */
function resolveStockStrict(p = {}) {
  // Números directos (ajustá estos alias si tu API usa otros)
  const direct =
    p.stock ??
    p.stock_total ??
    p.total_stock ??
    p.stockDisponible ??
    p.stock_disponible ??
    p.available_quantity ??
    p.quantity ??
    p.qty ??
    null;

  const directNum = toNum(direct);
  if (directNum !== null) return Math.max(0, directNum);

  // Suma por depósito
  if (Array.isArray(p.stock_por_deposito)) {
    const sum = p.stock_por_deposito.reduce((acc, it) => {
      const n = toNum(it?.cantidad ?? it?.qty ?? it?.stock);
      return acc + (n ?? 0);
    }, 0);
    return Math.max(0, sum);
  }

  // Nada confiable → 0
  return 0;
}

export default function ProductCard({ product }) {
  const { add } = useCart();

  // Vendedor / nombres tolerantes
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

  const img =
    product.imagenes?.find((i) => i.is_primary)?.url ||
    product.imagenes?.[0]?.url ||
    null;

  // === STOCK (estricto) ===
  const stock = resolveStockStrict(product); // número >= 0
  const sinStock = stock <= 0;
  const maxStock = stock; // límite superior real

  // Cantidad (como string para UX de mobile)
  const [qtyStr, setQtyStr] = useState(stock > 0 ? "1" : "0");

  const clamp = (n) => {
    // si hay stock, mínimo 1; si no hay, mínimo 0
    const min = stock > 0 ? 1 : 0;
    return Math.min(Math.max(n, min), maxStock);
  };

  const parseClamp = (v) => {
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return stock > 0 ? 1 : 0;
    return clamp(n);
  };

  const onChangeQty = (e) => {
    const v = e.target.value;
    // permitir vacío mientras escribe y sólo dígitos
    if (v === "" || /^[0-9]+$/.test(v)) {
      if (v === "") {
        setQtyStr(v);
      } else {
        setQtyStr(String(parseClamp(v)));
      }
    }
  };

  const onBlurQty = () => {
    if (qtyStr === "") {
      setQtyStr(stock > 0 ? "1" : "0");
    } else {
      setQtyStr(String(parseClamp(qtyStr)));
    }
  };

  const step = (delta) => {
    const base = qtyStr === "" ? (stock > 0 ? 1 : 0) : parseInt(qtyStr, 10);
    const next = Number.isFinite(base) ? base + delta : (stock > 0 ? 1 : 0);
    setQtyStr(String(clamp(next)));
  };

  const handleAdd = () => {
    const qty = parseClamp(qtyStr);
    if (qty < 1) return; // nunca deja agregar si no hay stock
    add(
      {
        id: product.id,
        nombre: product.nombre,
        precio,
        seller_id: sellerId,
        seller_nombre: sellerNombre,
        img: img || undefined,
      },
      qty
    );
    // opcional: resetear a 1
    // setQtyStr("1");
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

      {/* Vendedor */}
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
        <div className="text-lg font-semibold">AR$ {precio.toLocaleString("es-AR")}</div>
        <div className="text-xs text-gray-500">
          en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-2 flex items-stretch gap-2">
        <div className="flex items-stretch border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => step(-1)}
            className="px-2 text-sm disabled:opacity-50"
            disabled={sinStock || parseInt(qtyStr || "0", 10) <= 1}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min={stock > 0 ? 1 : 0}
            max={maxStock}
            value={qtyStr}
            onChange={onChangeQty}
            onBlur={onBlurQty}
            className="w-14 text-center outline-none"
            disabled={sinStock}
            aria-label="Cantidad"
          />
          <button
            type="button"
            onClick={() => step(1)}
            className="px-2 text-sm disabled:opacity-50"
            disabled={sinStock || parseInt(qtyStr || "0", 10) >= maxStock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={sinStock || parseInt(qtyStr || "0", 10) < 1}
          className="flex-1 px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {/* Mensajes de stock */}
      {sinStock ? (
        <div className="mt-1 text-xs text-red-600">Sin stock</div>
      ) : (
        <div className="mt-1 text-xs text-gray-500">Stock: {maxStock}</div>
      )}
    </div>
  );
}