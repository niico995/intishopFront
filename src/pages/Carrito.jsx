// src/pages/Carrito.jsx
import { useCart } from "../components/CartContext";

export default function Carrito() {
  const { items, updateQty, remove, clear, total } = useCart();
  const cuotas4 = (total / 4).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No hay productos en el carrito.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map(it => (
              <div key={it.id} className="border rounded-lg p-3 flex items-center gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {it.img ? <img src={it.img} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.nombre}</div>
                  <div className="text-xs text-gray-500">{it.seller_nombre}</div>
                  <div className="text-sm">AR$ {Number(it.precio).toLocaleString("es-AR")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => updateQty(it.id, Number(e.target.value))}
                    className="w-20 border rounded-md px-2 py-1"
                  />
                  <button onClick={() => remove(it.id)} className="px-3 py-1.5 rounded-md border hover:bg-gray-50">
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-red-600 underline">Vaciar carrito</button>
          </div>

          <aside className="border rounded-lg p-4 h-max">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">AR$ {total.toLocaleString("es-AR")}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              en 4 cuotas de AR$ {Number(cuotas4).toLocaleString("es-AR")}
            </div>
            <button className="mt-4 w-full px-4 py-2 rounded-md bg-black text-white">
              Continuar al checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
