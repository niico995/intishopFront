// src/pages/MisCompras.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast, alert } from "../utils/notify";

// 🔧 Ajustá estas rutas si tu backend usa otros prefijos
const RUTA_LISTAR = "gocuotas/mis-compras/";           // GET  -> lista de compras del cliente
const RUTA_CONFIRMAR = "gocuotas/compras/confirmar/";  // POST -> confirmar (usa producto_id, cantidad)
const RUTA_TICKET = "gocuotas/ticket/";                // GET opcional: /gocuotas/ticket/<id>/ (si existe)

export default function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState({}); // { [compraId]: boolean }

  const cargarCompras = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(RUTA_LISTAR);
      // Se espera un array de compras; normalizamos por las dudas
      const arr = Array.isArray(data) ? data : data?.results || [];
      setCompras(arr);
    } catch (e) {
      console.error("Error al listar compras:", e);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.detail ||
        "No se pudieron cargar tus compras.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  const confirmarCompra = async (compra) => {
    // Por si tu API permite “reintentar” una compra pendiente/observada
    const items = (compra?.items || compra?.detalle || []).map((it) => ({
      // 👇 MUY IMPORTANTE: usar la key que espera tu backend
      producto_id: it.producto_id || it.producto || it.id,
      cantidad: Number(it.cantidad || 1),
    }));

    if (!items.length) {
      return toast("No hay items para confirmar en esta compra.", "warning");
    }

    setLoadingIds((s) => ({ ...s, [compra.id]: true }));
    try {
      const payload = { items, usar_creditos: true };
      const { data } = await axiosInstance.post(RUTA_CONFIRMAR, payload);

      toast("Compra confirmada.", "success");
      if (data?.tickets?.length) {
        alert(
          "Códigos de retiro:\n" +
            data.tickets.map((t) => `${t.seller}: ${t.codigo_retiro}`).join("\n")
        );
      }
      // refrescar listado
      cargarCompras();
    } catch (e) {
      const status = e?.response?.status;
      const respData = e?.response?.data || {};
      console.error("Error al confirmar compra:", e);

      const esSaldoInsuficiente =
        status === 402 ||
        respData?.code === "SALDO_INSUFICIENTE" ||
        respData?.error_code === "saldo_insuficiente" ||
        respData?.error === "saldo_insuficiente";

      if (esSaldoInsuficiente) {
        toast("Saldo insuficiente. Completá la recarga desde el carrito.", "info");
      } else if (status === 401) {
        toast("Iniciá sesión para confirmar la compra.", "error");
      } else {
        const msg = respData?.error || respData?.detail || "No se pudo confirmar.";
        toast(msg, "error");
      }
    } finally {
      setLoadingIds((s) => ({ ...s, [compra.id]: false }));
    }
  };

  const verTicket = async (compra) => {
    // Si tenés endpoint para obtener/descargar ticket por compra
    if (!compra?.id) return;
    try {
      const url = `${RUTA_TICKET}${compra.id}/`;
      const { data } = await axiosInstance.get(url);
      const codigo =
        data?.codigo || data?.codigo_retiro || data?.ticket || "(sin código)";
      alert(`Ticket de retiro: ${codigo}`);
    } catch (e) {
      console.error("Error al obtener ticket:", e);
      toast("No se pudo obtener el ticket.", "error");
    }
  };

  if (loading) return <div className="p-4">Cargando compras…</div>;

  if (!compras.length)
    return <div className="p-4">No tenés compras registradas.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Mis compras</h2>

      <div className="grid gap-3">
        {compras.map((c) => (
          <div
            key={c.id || `${c.fecha}_${Math.random()}`}
            className="border rounded p-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  #{c.id ?? "—"} · {c.estado ?? "—"}
                </div>
                <div className="text-sm text-gray-600">
                  {c.fecha || c.created_at || ""}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  Total: AR{" "}
                  {Number(c.total || 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* Detalle de ítems */}
            {(c.items || c.detalle || []).length ? (
              <div className="mt-2 text-sm">
                {(c.items || c.detalle).map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.nombre || it.producto_nombre || `Prod ${it.producto_id || it.id}`}
                    </span>
                    <span>
                      x{it.cantidad} · AR{" "}
                      {Number(it.precio || 0).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-3 flex gap-2">
              {/* Mostrar “Confirmar” si el estado lo amerita (pendiente/observado) */}
              {["pendiente", "observada", "observado"].includes(
                String(c.estado || "").toLowerCase()
              ) && (
                <button
                  onClick={() => confirmarCompra(c)}
                  disabled={!!loadingIds[c.id]}
                  className="px-3 py-1 rounded bg-black text-white disabled:opacity-60"
                >
                  {loadingIds[c.id] ? "Procesando…" : "Confirmar ahora"}
                </button>
              )}

              {/* Ver ticket si ya está confirmada/aprobada */}
              {["aprobada", "aprobado", "confirmada", "entregada"].includes(
                String(c.estado || "").toLowerCase()
              ) && (
                <button
                  onClick={() => verTicket(c)}
                  className="px-3 py-1 border rounded"
                >
                  Ver ticket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
