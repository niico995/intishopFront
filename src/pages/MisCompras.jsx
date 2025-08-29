import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function MisCompras() {
  const api = axiosInstance;
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState({}); // { [ventaId]: true }

  const cargarCompras = async () => {
    setLoading(true);
    try {
      // El backend devuelve ventas del usuario (cliente) por email/user
      const { data } = await api.get("ventas/");
      setCompras(Array.isArray(data) ? data : data?.results || []);
    } catch (e) {
      console.error(e);
      toast("No pude cargar tus compras", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCompras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marcarRecibido = async (ventaId) => {
    setMarking((s) => ({ ...s, [ventaId]: true }));
    try {
      await api.post(`ventas/${ventaId}/marcar_recibido/`);
      toast("Marcada como recibida", "success");
      await cargarCompras();
    } catch (e) {
      console.error(e);
      toast(
        e?.response?.data?.error || "No se pudo marcar como recibida",
        "error"
      );
    } finally {
      setMarking((s) => ({ ...s, [ventaId]: false }));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Mis compras</h2>

      <p className="text-xs text-gray-500 mb-4">
        Recordá: tenés <b>24 horas</b> para retirar en el comercio indicado en
        el ticket. Luego el pedido puede cancelarse automáticamente.
      </p>

      {loading ? (
        <div className="text-sm text-gray-500">Cargando…</div>
      ) : compras.length === 0 ? (
        <div className="text-sm text-gray-600">No tenés compras todavía.</div>
      ) : (
        <div className="grid gap-2">
          {compras.map((v) => {
            const deshabilitar =
              v.cliente_recibio ||
              v.estado === "aprobado" ||
              v.estado === "cancelada" ||
              !!marking[v.id];

            return (
              <div
                key={v.id}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {v.producto_nombre || `Producto #${v.producto}`} ×{" "}
                    {v.cantidad}
                  </div>
                  <div className="text-sm text-gray-600">
                    Estado: <b>{v.estado}</b> — $
                    {Number(v.precio_unitario).toFixed(2)} c/u
                  </div>
                  <div className="text-xs text-gray-500">
                    Vendedor: {v.seller_nombre || `#${v.seller}`}
                  </div>
                </div>
                <button
                  disabled={deshabilitar}
                  onClick={() => marcarRecibido(v.id)}
                  className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {v.cliente_recibio
                    ? "Recibida"
                    : marking[v.id]
                    ? "Marcando…"
                    : "Marcar recibida"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
