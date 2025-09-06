import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";

export default function Carrito() {
  const { items, updateQty, removeItem, clearCart } = useCart();

  const handleQtyInput = (id) => (e) => {
    const val = parseInt(e.target.value || "0", 10);
    const qty = isNaN(val) ? 1 : Math.max(1, val);
    updateQty(id, qty);
  };
  const inc = (id, cur=1) => updateQty(id, Math.max(1, cur + 1));
  const dec = (id, cur=1) => updateQty(id, Math.max(1, cur - 1));

  const total = items.reduce((acc, it) => acc + (Number(it.qty || 1) * Number(it.precio_final || it.precio || 0)), 0);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Carrito</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
          <Link to="/" className="inline-flex px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50">Seguir comprando</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.id || it.producto_id} className="flex gap-3 items-center p-3 border border-gray-200 rounded-lg">
                <img
                  src={it.imagen_url || it.imagen || "/img/placeholder-product.png"}
                  alt={it.nombre}
                  className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{it.nombre}</p>
                  <p className="text-sm text-gray-600">${Number(it.precio_final || it.precio || 0).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 h-12 rounded-md border border-gray-300" onClick={() => dec(it.id || it.producto_id, Number(it.qty || 1))} aria-label="Restar">−</button>
                  <input type="number" min={1} inputMode="numeric" className="w-20 h-12 text-lg text-center rounded-md border border-gray-300" value={Number(it.qty || 1)} onChange={handleQtyInput(it.id || it.producto_id)} />
                  <button className="px-3 h-12 rounded-md border border-gray-300" onClick={() => inc(it.id || it.producto_id, Number(it.qty || 1))} aria-label="Sumar">+</button>
                </div>

                <button className="ml-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={() => removeItem(it.id || it.producto_id)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-1 border border-gray-200 rounded-lg p-4 h-fit">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-medium">${total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">Los costos de envío se calculan al finalizar la compra.</div>
            <button className="w-full mb-2 px-4 py-3 rounded-md bg-black text-white">Finalizar compra</button>
            <button className="w-full px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50" onClick={clearCart}>Vaciar carrito</button>
          </aside>
        </div>
      )}
    </div>
  );
}
