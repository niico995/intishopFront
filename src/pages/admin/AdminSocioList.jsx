import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminSociosList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // ✅ endpoint real del backend
        const { data } = await api.get("sellers/pagos/todos/");
        // agrupamos por seller
        const bySeller = new Map();
        for (const p of data || []) {
          const id = p.seller_id ?? p.seller?.id ?? p.seller ?? null;
          const name =
            p.seller_nombre ??
            p.seller?.nombre_fantasia ??
            p.seller?.nombre ??
            "—";
          if (!id) continue;

          const r =
            bySeller.get(id) || {
              id,
              name,
              pendientes: 0,
              totalPendiente: 0,
              pagados: 0,
              totalPagado: 0,
            };

          const monto = Number(p.monto || 0);
          if (p.estado === "pendiente") {
            r.pendientes += 1;
            r.totalPendiente += monto;
          } else if (p.estado === "pagado") {
            r.pagados += 1;
            r.totalPagado += monto;
          }
          bySeller.set(id, r);
        }
        setRows([...bySeller.values()].sort((a, b) => a.id - b.id));
      } catch (e) {
        console.error(e);
        alert("No se pudo cargar la lista de socios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Socios</h1>
        <Link
          to="/admin/socios/nuevo"
          className="px-3 py-2 bg-slate-900 text-white rounded"
        >
          Nuevo socio
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Pendientes</th>
              <th className="p-2 text-left">Total pendiente</th>
              <th className="p-2 text-left">Pagados</th>
              <th className="p-2 text-left">Total pagado</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.pendientes}</td>
                <td className="p-2">${r.totalPendiente.toFixed(2)}</td>
                <td className="p-2">{r.pagados}</td>
                <td className="p-2">${r.totalPagado.toFixed(2)}</td>
                <td className="p-2 space-x-3">
                  <Link
                    to={`/admin/pagos/socio/${r.id}`}
                    className="text-blue-600 underline"
                  >
                    Pagos
                  </Link>
                  <Link
                    to={`/admin/socios/${r.id}`}
                    className="text-green-700 underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-3" colSpan={7}>
                  Sin socios con pagos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
