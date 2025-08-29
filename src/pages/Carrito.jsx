// src/pages/Carrito.jsx
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useCart } from "../components/CartContext";
import { alert, toast } from "../utils/notify";

export default function Carrito() {
  const { items, updateQty, remove, clear } = useCart();
  const [removeCount, setRemoveCount] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleCheckout = async () => {
    if (!items.length || loading) return;
    setLoading(true);

    try {
      // ✅ Enviar con producto_id y a la ruta correcta
      const payload = {
        items: items.map((it) => ({
          producto_id: it.id,
          cantidad: it.qty,
        })),
        usar_creditos: true,
      };

      const { data } = await axiosInstance.post(
  "ventas/confirmar/",
  payload
);

      toast("Compra confirmada. Te enviamos los tickets por email.", "success");

      if (data?.tickets?.length) {
        alert(
          "Códigos de retiro:\n" +
            data.tickets.map((t) => `${t.seller}: ${t.codigo_retiro}`).join("\n")
        );
      }
      clear();
    } catch (e) {
      const status = e?.response?.status;
      const respData = e?.response?.data || {};

      const esSaldoInsuficiente =
        status === 402 ||
        respData?.code === "SALDO_INSUFICIENTE" ||
        respData?.error_code === "saldo_insuficiente" ||
        respData?.error === "saldo_insuficiente";

      if (esSaldoInsuficiente) {
        const totalCarrito = items.reduce(
          (acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 1),
          0
        );
        const diferencia =
          Number(respData?.faltante ?? respData?.diferencia ?? respData?.monto ?? 0) ||
          totalCarrito;

        try {
          const rec = await axiosInstance.post("gocuotas/crear-recarga/", {
            monto: diferencia,
            metadata: {
              origen: "checkout",
              items: items.map((it) => ({
                producto_id: it.id,
                cantidad: it.qty,
                precio: Number(it.precio || 0),
              })),
              total: totalCarrito,
            },
          });

          const paymentUrl =
            rec?.data?.payment_url || rec?.data?.link || rec?.data?.url;

          if (paymentUrl) {
            toast("Te redirigimos al pago…", "info");
            window.location.href = paymentUrl;
            return;
          }

          toast("El backend no devolvió el link de pago.", "error");
        } catch (e2) {
          console.error("Error al crear recarga:", e2);
          const msg2 =
            e2?.response?.data?.error ||
            e2?.message ||
            "No se pudo crear la recarga";
          toast(msg2, "error");
        }
      } else {
        if (status === 401) {
          toast("Tenés que iniciar sesión para confirmar la compra.", "error");
        } else {
          const msg =
            respData?.error ||
            respData?.detail ||
            "No se pudo confirmar la compra";
          toast(msg, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return <div className="p-4">Tu carrito está vacío.</div>;

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
              {p.imagen || p.img ? (
                <img
                  src={p.imagen || p.img}
                  alt={p.nombre || ""}
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
          Total: AR{" "}
          {total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Ir a pagar"}
        </button>
        <div className="text-sm text-gray-600 mt-2">
          Te enviaremos los tickets por email (un ticket por comercio).
        </div>
      </div>
    </div>
  );
}
