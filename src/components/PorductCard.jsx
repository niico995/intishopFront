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

function resolveStock(p = {}) {
  // 1) Prioridades directas (número)
  const direct =
    p.stock ??
    p.stock_total ??
    p.total_stock ??
    p.stockDisponible ??
    p.stock_disponible ??
    p.disponible ??
    p.quantity ??
    p.qty ??
    null;

  const toNum = (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const directNum = toNum(direct);
  if (directNum !== null) return directNum;

  // 2) Suma por depósito (array de objetos con cantidad/qty)
  if (Array.isArray(p.stock_por_deposito)) {
    const sum = p.stock_por_deposito.reduce((acc, it) => {
      const n = toNum(it?.cantidad ?? it?.qty ?? it?.stock);
      return acc + (n ?? 0);
      // si querés por depósito específico, filtrá acá
    }, 0);
    return sum;
  }

  // 3) Otros nombres posibles
  const fallbackNum = toNum(p.stock_global ?? p.available ?? p.availability);
  if (fallbackNum !== null) return fallbackNum;

  // 4) Indeterminado: devolvemos null (no afirmar sin stock)
  return null;
}

export default function ProductCard({ product }) {
  const { add } = useCart();

  // IDs / nombres tolerantes
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

  // Stock robusto
  const stockResuelto = resolveStock(product);          // número o null
  const stockEsNumero = typeof stockResuelto === "number" && Number.isFinite(stockResuelto);
  const maxStock = stockEsNumero ? stockResuelto : Infinity;

  // Si no podemos determinar stock, NO marcamos sin stock
  const sinStock = stockEsNumero ? stockResuelto <= 0 : false;

  // Cantidad
  const [qtyStr, setQtyStr] = useState("1");

  const parseClamp = (v) => {
    const n = parseInt(v, 10);
    if (!n || n < 1) return 1;
    return Math.min(n, maxStock);
  };

  const onChangeQty = (e) => {
    const v = e.target.value;
    if (v === "" || /^[0-9]+$/.test(v)) setQtyStr(v);
  };

  const onBlurQty = () => {
    setQtyStr(String(parseClamp(qtyStr)));
  };

  const step = (delta) => {
    const next = parseClamp(qtyStr === "" ? "1" : qtyStr);
    const res = Math.min(Math.max(next + delta, 1), maxStock);
    setQtyStr(String(res));
  };

  const handleAdd = () => {
    const qty = parseClamp(qtyStr);
    if (qty < 1) return;
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

      {/* Controles compactos */}
      <div className="mt-2 flex items-stretch gap-2">
        <div className="flex items-stretch border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => step(-1)}
            className="px-2 text-sm disabled:opacity-50"
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
            max={stockEsNumero ? stockResuelto : undefined}
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
            disabled={sinStock || (stockEsNumero && parseInt(qtyStr || "1", 10) >= stockResuelto)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={sinStock}
          className="flex-1 px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {/* Mensajes de stock */}
      {stockEsNumero ? (
        stockResuelto <= 0 ? (
          <div className="mt-1 text-xs text-red-600">Sin stock</div>
        ) : (
          <div className="mt-1 text-xs text-gray-500">Stock: {stockResuelto}</div>
        )
      ) : (
        <div className="mt-1 text-xs text-gray-500">Stock a confirmar</div>
      )}
    </div>
  );
}