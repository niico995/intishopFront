// src/components/PorductCard.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { useCart } from "./CartContext";

const fmt = (v) =>
  Number(v ?? 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ------ helpers robustos para vendedor ------
function getSellerId(p) {
  return (
    p.seller_id ??
    p.sellerId ??
    p.sellerID ??
    p?.seller?.id ??
    p.tienda_id ??
    p?.tienda?.id ??
    p.vendedor_id ??
    p?.vendedor?.id ??
    null
  );
}

function getSellerName(p) {
  return (
    p.seller_nombre ??
    p.sellerName ??
    p?.seller?.nombre_fantasia ??
    p?.seller?.name ??
    p?.seller?.username ??
    p.tienda_nombre ??
    p?.tienda?.nombre_fantasia ??
    p?.tienda?.nombre ??
    p.vendedor_nombre ??
    p?.vendedor?.nombre ??
    p.proveedor ?? // a veces usan proveedor como “nombre comercial”
    ""
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  // Imagen principal robusta
  const img =
    product.imagen_principal ||
    (Array.isArray(product.imagenes)
      ? (typeof product.imagenes[0] === "string"
          ? product.imagenes[0]
          : product.imagenes[0]?.url)
      : null) ||
    null;

  // Vendedor
  const sellerId = getSellerId(product);
  const sellerName = getSellerName(product) || "-";

  // Precio final (ya x1.5) + cuotas
  const precio = product.precio ?? product.precio_base ?? 0;
  const cuota4 = precio / 4;

  // Stock y cantidad (límite por stock si está)
  const stockValue = useMemo(
    () => (typeof product?.stock === "number" ? Math.max(0, product.stock) : null),
    [product]
  );
  const maxQty = stockValue ?? 99;
  const sinStock = stockValue !== null ? stockValue <= 0 : false;

  const [qty, setQty] = useState(1);
  const clamp = (n) => Math.min(Math.max(1, Number.isFinite(n) ? n : 1), Math.max(1, maxQty));

  const onMinus = () => setQty((q) => clamp(q - 1));
  const onPlus  = () => setQty((q) => clamp(q + 1));
  const onChange = (e) => {
    const onlyDigits = String(e.target.value || "1").replace(/\D+/g, "");
    setQty(clamp(parseInt(onlyDigits || "1", 10)));
  };

  const addToCart = () => {
    if (sinStock) return;
    addItem(
      {
        id: product.id ?? product.producto_id ?? product.slug,
        nombre: product.nombre ?? product.title ?? "Producto",
        precio,
        imagen_principal: img,
        seller_id: sellerId || undefined,
      },
      qty
    );
  };

  return (
    <div className="group rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
      <Link to={`/producto/${product.id}`} className="block">
        <div className="aspect-square bg-neutral-100 overflow-hidden">
          {img && (
            <img
              src={img}
              alt={product.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-1">
        {sellerId ? (
          <Link
            to={`/vendedor/${sellerId}`}
            className="text-[11px] uppercase tracking-wide text-gray-500 hover:underline"
            title="Ver vendedor"
          >
            {sellerName}
          </Link>
        ) : (
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            {sellerName}
          </div>
        )}

        <Link
          to={`/producto/${product.id}`}
          className="text-sm font-medium truncate"
          title={product.nombre}
        >
          {product.nombre}
        </Link>

        <div className="text-lg font-semibold mt-0.5">${fmt(precio)}</div>
        <div className="text-xs text-gray-500">En 4 cuotas de ${fmt(precio / 4)}</div>

        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={onMinus}
              className="px-3 py-1.5 text-lg disabled:opacity-50"
              aria-label="Reducir cantidad"
              disabled={sinStock || qty <= 1}
            >
              -
            </button>
            <input
              className="w-12 text-center outline-none select-all"
              value={qty}
              onChange={onChange}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label="Cantidad"
            />
            <button
              onClick={onPlus}
              className="px-3 py-1.5 text-lg disabled:opacity-50"
              aria-label="Aumentar cantidad"
              disabled={sinStock || qty >= maxQty}
            >
              +
            </button>
          </div>

          <AddToCartButton onClick={addToCart} disabled={sinStock} />
        </div>

        {stockValue !== null ? (
          stockValue <= 0 ? (
            <div className="mt-1 text-xs text-red-600">Sin stock</div>
          ) : (
            <div className="mt-1 text-xs text-gray-500">Stock: {stockValue}</div>
          )
        ) : null}
      </div>
    </div>
  );
}
