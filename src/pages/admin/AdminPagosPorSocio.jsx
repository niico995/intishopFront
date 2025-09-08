// src/pages/admin/pagos/AdminPagosPorSocio.jsx
import { useEffect, useMemo, useState } from "react";
import { getPagosPorSocio, marcarPagoPagado, marcarTodosPagados } from "../../api/adminService"
import { useParams } from "react-router-dom";

export default function AdminPagosPorSocio() {
  const { id } = useParams();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await getPagosPorSocio(id);
      setPagos(data);
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar pagos del socio");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { cargar(); }, [id]);

  const totalPend = useMemo(
    () => pagos.filter(p => p.estado === "pendiente")
               .reduce((acc, p) => acc + Number(p.monto || 0), 0),
    [pagos]
  );

  const payOne = async (pagoId) => {
    try { await marcarPagoPagado(pagoId); await cargar(); }
    catch (e) { console.error(e); alert("No se pudo marcar como pagado"); }
  };

  const payAll = async () => {
    if (!confirm("¿Marcar TODOS los pagos pendientes de este socio como pagados?")) return;
    try { await marcarTodosPagados(id); await cargar(); }
    catch (e) { console.error(e); alert("No se pudo marcar todos"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Pagos del socio #{id}</h1>
        <div className="space-x-2">
          <span className="text-sm text-gray-600">Total pendiente: <b>${totalPend.toFixed(2)}</b></span>
          <button onClick={payAll} className="px-3 py-2 bg-slate-900 text-white rounded">
            Marcar todos pagados
          </button>
        </div>
      </div>

      {loading ? <div>Cargando…</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">ID</th>
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
                  <td className="p-2">${Number(p.monto || 0).toFixed(2)}</td>
                  <td className="p-2">{p.estado}</td>
                  <td className="p-2">{p.fecha_venta || "-"}</td>
                  <td className="p-2">
                    {p.estado !== "pagado" && (
                      <button onClick={() => payOne(p.id)} className="px-2 py-1 border rounded">
                        Marcar pagado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr><td className="p-3" colSpan={5}>Sin pagos para este socio.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
