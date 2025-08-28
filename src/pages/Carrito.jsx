// src/pages/Carrito.jsx
import { useState } from "react";
import { useCart } from "../components/CartContext";
import { alert, toast } from "../utils/notify";

export default function Carrito() {
  const { items, updateQty, remove, clear } = useCart();
  const [removeCount, setRemoveCount] = useState({}); // { [id]: n }

  const total = items.reduce(
    (acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 1),
    0
  );

  const removeQty = (id, qty) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const n = Math.max(1, Number(qty || 1));
    const next = (item.qty || 1) - n;
    if (next <= 0) {
      remove(id);
      toast("Producto eliminado", "info");
    } else {
      updateQty(id, next);
      toast(`Quitaste ${n} unidad(es)`, "info");
    }
  };

  if (!items.length)
    return <div className="p-4">Tu carrito está vacío.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Carrito</h2>

      <div className="grid gap-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <div className="flex items-center gap-3">
              {p.img ? (
                <img
                  src={p.img}
                  alt=""
                  className="w-12 h-12 object-cover rounded"
                />
              ) : null}
              <div>
                <div className="font-medium">{p.nombre}</div>
                <div className="text-gray-600 text-sm">
                  AR$ {Number(p.precio).toLocaleString("es-AR")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={p.qty || 1}
                onChange={(e) =>
                  updateQty(p.id, Math.max(1, Number(e.target.value)))
                }
                className="w-20 border rounded px-2 py-1 text-center"
              />
              <input
                type="number"
                min={1}
                placeholder="Quitar…"
                value={removeCount[p.id] || ""}
                onChange={(e) =>
                  setRemoveCount((s) => ({
                    ...s,
                    [p.id]: e.target.value,
                  }))
                }
                className="w-24 border rounded px-2 py-1 text-center"
              />
              <button
                onClick={() =>
                  removeQty(p.id, Math.max(1, Number(removeCount[p.id] || 1)))
                }
                className="px-3 py-1 border rounded"
              >
                Quitar esa cantidad
              </button>
              <button
                onClick={() => {
                  remove(p.id);
                  toast("Producto eliminado", "warning");
                }}
                className="px-3 py-1 border rounded"
              >
                Eliminar línea
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={clear} className="px-3 py-2 border rounded">
          Vaciar carrito
        </button>
        <div className="text-lg font-semibold">
          Total: AR$ {total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => alert("Checkout", "Continuar con el pago", "info")}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Ir a pagar
        </button>
      </div>
    </div>
  );
}
