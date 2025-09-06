import { useState } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { useCart } from "./CartContext";

const fmt = (v) =>
  Number(v ?? 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const sellerId =
    product.seller_id ??
    product.seller?.id ??
    product.sellerId ??
    product.sellerID ??
    null;
  const sellerName =
    product.seller_nombre ??
    product.seller?.nombre_fantasia ??
    product.sellerName ??
    "-";
  const img =
    product.imagen_principal ||
    (Array.isArray(product.imagenes)
      ? typeof product.imagenes[0] === "string"
        ? product.imagenes[0]
        : product.imagenes[0]?.url
      : null) ||
    null;

  const stockValue = typeof product.stock === "number" ? product.stock : null;
  const hasStockNumber = typeof stockValue === "number";
  const sinStock = hasStockNumber ? stockValue <= 0 : false;

  const precioFinal = product.precio ?? product.precio_base ?? 0;
  const cuota = precioFinal / 4;

  const addToCart = () => {
    addItem(
      {
        id: product.id ?? product.producto_id,
        nombre: product.nombre ?? product.title ?? "Producto",
        precio: precioFinal,
        imagen_principal: img,
        seller_id: sellerId,
      },
      qty
    );
  };

  return (
    <div className="group rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
      <Link
        to={`/producto/${product.id || product.slug || ""}`}
        className="block"
      >
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
        <Link
          to={`/vendedor/${sellerId || ""}`}
          className="text-[11px] uppercase tracking-wide text-gray-500 hover:underline"
        >
          {sellerName}
        </Link>
        <Link
          to={`/producto/${product.id || product.slug || ""}`}
          className="text-sm font-medium truncate"
        >
          {product.nombre || product.title}
        </Link>
        <div className="text-lg font-semibold mt-0.5">
          ${fmt(precioFinal)}
        </div>
        <div className="text-xs text-gray-500">
          En 4 cuotas de ${fmt(cuota)}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-lg disabled:opacity-50"
              disabled={sinStock || qty <= 1}
            >
              -
            </button>
            <input
              className="w-10 text-center outline-none select-all"
              value={qty}
              onChange={(e) =>
                setQty(
                  Math.max(
                    1,
                    Math.min(99, parseInt(e.target.value || "1", 10) || 1)
                  )
                )
              }
              inputMode="numeric"
              aria-label="Cantidad"
            />
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="px-3 py-1.5 text-lg disabled:opacity-50"
              disabled={
                sinStock ||
                (typeof stockValue === "number" && qty >= stockValue)
              }
            >
              +
            </button>
          </div>

          <AddToCartButton onClick={addToCart} disabled={sinStock} />
        </div>

        {hasStockNumber ? (
          stockValue <= 0 ? (
            <div className="mt-1 text-xs text-red-600">Sin stock</div>
          ) : (
            <div className="mt-1 text-xs text-gray-500">
              Stock: {stockValue}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
