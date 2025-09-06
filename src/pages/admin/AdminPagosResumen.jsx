
import { useEffect, useMemo, useState } from "react";
import { getPagosTodos, marcarPagoPagado } from "../../api/adminService";
import { Link } from "react-router-dom";

export default function AdminPagosResumen() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await getPagosTodos();
      setPagos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const total = useMemo(() => pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0), [pagos]);

  const payOne = async (p) => {
    try {
      await marcarPagoPagado(p);
      await cargar();
    } catch (e) {
      console.error(e);
      alert("No se pudo marcar");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card title="Pagos" value={pagos.length} />
        <Card title="Total" value={`$${Number(total).toFixed(2)}`} />
      </div>

      {loading ? (
        <div>Cargando…</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Socio</th>
                <th className="p-2 text-left">Monto</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Fecha venta</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">
                    {p.seller_nombre || "-"}{" "}
                    {p.seller_id && (
                      <Link to={`/admin/pagos/socio/${p.seller_id}`} className="text-blue-600 underline">[ver]</Link>
                    )}
                  </td>
                  <td className="p-2">${Number(p.monto || 0).toFixed(2)}</td>
                  <td className="p-2">{p.estado}</td>
                  <td className="p-2">{p.fecha_venta || "-"}</td>
                  <td className="p-2 space-x-2">
                    {p.estado !== "pagado" && (
                      <button onClick={() => payOne(p)} className="px-2 py-1 border rounded">
                        Marcar pagado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr><td className="p-3" colSpan={6}>Sin pagos.</td></tr>
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
