// src/pages/admin/AdminPagos.jsx
import { useEffect, useState } from "react";
import { getPendientesResumen, marcarSeleccionPagada, marcarHastaFechaPagada } from "../../api/adminPagosService";
import { toast } from "../../utils/notify";

export default function AdminPagos() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState({ seller_id: "", desde: "", hasta: "" });
  const [refPago, setRefPago] = useState("");
  const [acting, setActing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPendientesResumen({
        seller_id: filtro.seller_id || undefined,
        desde: filtro.desde || undefined,
        hasta: filtro.hasta || undefined,
      });
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast("No pude cargar el resumen", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const pagarHasta = async (seller_id) => {
    try {
      setActing(true);
      const hasta = filtro.hasta ? new Date(filtro.hasta).toISOString() : new Date().toISOString();
      await marcarHastaFechaPagada({ seller_id, hasta_fecha: hasta, referencia: refPago.trim() });
      toast("Pagos marcados como pagados");
      load();
    } catch {
      toast("No pude marcar pagos", "error");
    } finally {
      setActing(false);
    }
  };

  const pagarSeleccion = async (seller_id, ids) => {
    try {
      setActing(true);
      if (!ids?.length) return;
      await marcarSeleccionPagada({ seller_id, ids, referencia: refPago.trim() });
      toast("Selección marcada como pagada");
      load();
    } catch {
      toast("No pude marcar la selección", "error");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Pagos a Socios (pendientes)</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input className="border p-2 rounded" placeholder="Seller ID"
          value={filtro.seller_id} onChange={(e)=>setFiltro(v=>({...v, seller_id:e.target.value}))}/>
        <input type="date" className="border p-2 rounded"
          value={filtro.desde} onChange={(e)=>setFiltro(v=>({...v, desde:e.target.value}))}/>
        <input type="date" className="border p-2 rounded"
          value={filtro.hasta} onChange={(e)=>setFiltro(v=>({...v, hasta:e.target.value}))}/>
        <button onClick={load} className="bg-black text-white rounded px-4">Filtrar</button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input className="border p-2 rounded flex-1" placeholder="Referencia de pago (opcional)"
          value={refPago} onChange={(e)=>setRefPago(e.target.value)} />
      </div>

      {loading ? <p>Cargando…</p> : (
        <div className="space-y-6">
          {rows.map((r) => (
            <SellerCard key={r.seller_id} r={r}
              disabled={acting}
              onPagarHasta={()=>pagarHasta(r.seller_id)}
              onPagarSeleccion={(ids)=>pagarSeleccion(r.seller_id, ids)}
            />
          ))}
          {rows.length === 0 && <p>No hay pagos pendientes.</p>}
        </div>
      )}
    </div>
  );
}

function SellerCard({ r, onPagarHasta, onPagarSeleccion, disabled }) {
  const [sel, setSel] = useState({});
  const idsSel = Object.entries(sel).filter(([,v])=>v).map(([k])=>Number(k));
  const toggle = (id) => setSel(s => ({...s, [id]: !s[id]}));

  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">{r.nombre_fantasia || `Seller ${r.seller_id}`}</div>
          <div className="text-sm text-gray-600">ID: {r.seller_id}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">${Number(r.total_pendiente).toFixed(2)}</div>
          <div className="text-sm text-gray-600">{r.pendientes_count} ventas</div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-2">Sel</th>
              <th className="py-2 pr-2">Venta</th>
              <th className="py-2 pr-2">Fecha</th>
              <th className="py-2 pr-2">Producto</th>
              <th className="py-2 pr-2">Cant.</th>
              <th className="py-2 pr-2">Total venta</th>
              <th className="py-2 pr-2">% Com.</th>
              <th className="py-2 pr-2">A pagar</th>
            </tr>
          </thead>
          <tbody>
            {r.items.map(it => (
              <tr key={it.id} className="border-b last:border-0">
                <td className="py-2 pr-2">
                  <input type="checkbox" checked={!!sel[it.id]} onChange={()=>toggle(it.id)} disabled={disabled}/>
                </td>
                <td className="py-2 pr-2">#{it.venta_id}</td>
                <td className="py-2 pr-2">{it.fecha_venta ? new Date(it.fecha_venta).toLocaleString() : "-"}</td>
                <td className="py-2 pr-2">{it.producto}</td>
                <td className="py-2 pr-2">{it.cantidad ?? "-"}</td>
                <td className="py-2 pr-2">{it.monto_bruto ? `$${Number(it.monto_bruto).toFixed(2)}` : "-"}</td>
                <td className="py-2 pr-2">{Number(it.comision_pct ?? 0).toFixed(2)}%</td>
                <td className="py-2 pr-2 font-semibold">${Number(it.monto).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="bg-emerald-600 text-white rounded px-4 py-2 disabled:opacity-50"
          onClick={onPagarHasta} disabled={disabled}>
          Marcar TODO (hasta filtro)
        </button>
        <button className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          disabled={disabled || idsSel.length===0}
          onClick={()=>onPagarSeleccion(idsSel)}>
          Marcar selección ({idsSel.length})
        </button>
      </div>
    </div>
  );
}
