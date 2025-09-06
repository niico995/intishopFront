
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api"; // usa el axios con interceptor y baseURL correcta

export default function ResumenPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      // 👇 Endpoint REAL del backend
      const { data } = await api.get("sellers/pagos/todos/");
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al obtener pagos:", err?.response?.data || err);
      alert("No se pudo cargar el resumen de pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // totales
  const resumen = useMemo(() => {
    const r = { pendientes: 0, pagados: 0, totalPendiente: 0, totalPagado: 0 };
    for (const p of pagos) {
      const monto = Number(p.monto || 0);
      if (p.estado === "pendiente") {
        r.pendientes += 1;
        r.totalPendiente += monto;
      } else if (p.estado === "pagado") {
        r.pagados += 1;
        r.totalPagado += monto;
      }
    }
    return r;
  }, [pagos]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Resumen de Pagos</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card title="Pendientes" value={resumen.pendientes} />
        <Card title="Pagados" value={resumen.pagados} />
        <Card title="Total pendiente" value={`$${resumen.totalPendiente.toFixed(2)}`} />
        <Card title="Total pagado" value={`$${resumen.totalPagado.toFixed(2)}`} />
      </div>

      {loading ? (
        <div>Cargando…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Socio</th>
                <th className="p-2 text-left">Monto</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Fecha venta</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.seller_nombre || "-"}</td>
                  <td className="p-2">${Number(p.monto || 0).toFixed(2)}</td>
                  <td className="p-2">{p.estado}</td>
                  <td className="p-2">{p.fecha_venta || "-"}</td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr><td className="p-3" colSpan={5}>Sin pagos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-4 border rounded">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
