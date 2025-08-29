// src/pages/MisCompras.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState({}); // { [ventaId]: true }

  const cargarCompras = async () => {
    setLoading(true);
    try {
      // Listado real: GET /api/ventas/
      const { data } = await axiosInstance.get("ventas/");
      setCompras(Array.isArray(data) ? data : data?.results || []);
    } catch (e) {
      console.error("Error al listar compras:", e);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.detail ||
        "No se pudieron cargar tus compras";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  const marcarRecibida = async (ventaId) => {
    setMarking((s) => ({ ...s, [ventaId]: true }));
    try {
      // Acción correcta: POST /api/ventas/<id>/marcar_recibido/
      await axiosInstance.post(`ventas/${ventaId}/marcar_recibido/`);
      toast("Compra marcada como recibida", "success");
      await cargarCompras();
    } catch (e) {
      console.error("Error al marcar recibida:", e);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.detail ||
        "No se pudo marcar como recibida";
      toast(msg, "error");
    } finally {
      setMarking((s) => ({ ...s, [ventaId]: false }));
    }
  };

  if (loading) return <div className="p-4">Cargando compras…</div>;
  if (!compras.length)
    return <div className="p-4">No tenés compras registradas.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Mis compras</h2>

      <div className="grid gap-3">
        {compras.map((c) => {
          const precio = Number(c.precio_unitario || 0);
          const cantidad = Number(c.cantidad || 0);
          const total = precio * cantidad;
          const estado = String(c.estado || "").toLowerCase();
          const puedeMarcar =
            !c.cliente_recibio && (c.vendedor_entrego || estado === "entregado");

          return (
            <div key={c.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    #{c.id} · {c.estado || "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {c.fecha_venta || ""}
                  </div>
                  {c.seller_nombre ? (
                    <div className="text-sm text-gray-600">
                      Vendedor: {c.seller_nombre}
                    </div>
                  ) : null}
                </div>
                <div className="text-right font-semibold">
                  Total: AR{" "}
                  {Number(total || 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>{c.producto_nombre || `Producto #${c.producto}`}</span>
                  <span>
                    x{cantidad} · AR{" "}
                    {Number(precio).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {puedeMarcar && (
                  <button
                    onClick={() => marcarRecibida(c.id)}
                    disabled={!!marking[c.id]}
                    className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                  >
                    {marking[c.id] ? "Procesando…" : "Marcar como recibida"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
