import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function VentasVendedor() {
  const api = axiosInstance; // instancia, no función
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState({}); // { [id]: true }
  const [filtros, setFiltros] = useState({
    estado: "",
    desde: "",
    hasta: "",
    ordering: "-fecha_venta",
  });

  const cargar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.estado) params.set("estado", filtros.estado);
      if (filtros.desde) params.set("desde", filtros.desde);
      if (filtros.hasta) params.set("hasta", filtros.hasta);
      if (filtros.ordering) params.set("ordering", filtros.ordering);

      const url = `ventas/${params.toString() ? "?" + params.toString() : ""}`;
      const { data } = await api.get(url);
      setVentas(Array.isArray(data) ? data : data?.results || []);
    } catch (e) {
      console.error(e);
      toast("No pude cargar tus ventas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.estado, filtros.desde, filtros.hasta, filtros.ordering]);

  const entregar = async (id) => {
    setMarking((s) => ({ ...s, [id]: true }));
    try {
      await api.post(`ventas/${id}/marcar_entregado/`);
      toast("Venta marcada como entregada", "success");
      cargar();
    } catch (e) {
      console.error(e);
      toast(
        e?.response?.data?.error || "No se pudo marcar como entregada",
        "error"
      );
    } finally {
      setMarking((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Mis ventas</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <select
          value={filtros.estado}
          onChange={(e) => setFiltros((f) => ({ ...f, estado: e.target.value }))}
          className="border rounded px-2 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado por vendedor</option>
          <option value="recibido">Recibido por cliente</option>
          <option value="aprobado">Aprobado</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <input
          type="date"
          value={filtros.desde}
          onChange={(e) => setFiltros((f) => ({ ...f, desde: e.target.value }))}
          className="border rounded px-2 py-2"
        />
        <input
          type="date"
          value={filtros.hasta}
          onChange={(e) => setFiltros((f) => ({ ...f, hasta: e.target.value }))}
          className="border rounded px-2 py-2"
        />

        <select
          value={filtros.ordering}
          onChange={(e) =>
            setFiltros((f) => ({ ...f, ordering: e.target.value }))
          }
          className="border rounded px-2 py-2"
        >
          <option value="-fecha_venta">Más recientes</option>
          <option value="fecha_venta">Más antiguas</option>
          <option value="-precio_unitario">Precio ↓</option>
          <option value="precio_unitario">Precio ↑</option>
          <option value="-cantidad">Cantidad ↓</option>
          <option value="cantidad">Cantidad ↑</option>
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Cargando…</div>
      ) : ventas.length === 0 ? (
        <div className="text-sm text-gray-600">No tenés ventas aún.</div>
      ) : (
        <div className="grid gap-2">
          {ventas.map((v) => {
            const deshabilitar =
              v.vendedor_entrego ||
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
                    Cliente: {v.cliente_email}
                  </div>
                </div>
                <button
                  disabled={deshabilitar}
                  onClick={() => entregar(v.id)}
                  className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {v.vendedor_entrego
                    ? "Entregada"
                    : marking[v.id]
                    ? "Marcando…"
                    : "Marcar entregada"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
