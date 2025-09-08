// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";

// export default function AdminSociosList() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         // ✅ endpoint real del backend
//         const { data } = await api.get("sellers/pagos/todos/");
//         // agrupamos por seller
//         const bySeller = new Map();
//         for (const p of data || []) {
//           const id = p.seller_id ?? p.seller?.id ?? p.seller ?? null;
//           const name =
//             p.seller_nombre ??
//             p.seller?.nombre_fantasia ??
//             p.seller?.nombre ??
//             "—";
//           if (!id) continue;

//           const r =
//             bySeller.get(id) || {
//               id,
//               name,
//               pendientes: 0,
//               totalPendiente: 0,
//               pagados: 0,
//               totalPagado: 0,
//             };

//           const monto = Number(p.monto || 0);
//           if (p.estado === "pendiente") {
//             r.pendientes += 1;
//             r.totalPendiente += monto;
//           } else if (p.estado === "pagado") {
//             r.pagados += 1;
//             r.totalPagado += monto;
//           }
//           bySeller.set(id, r);
//         }
//         setRows([...bySeller.values()].sort((a, b) => a.id - b.id));
//       } catch (e) {
//         console.error(e);
//         alert("No se pudo cargar la lista de socios");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) return <div>Cargando...</div>;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-bold">Socios</h1>
//         <Link
//           to="/admin/socios/nuevo"
//           className="px-3 py-2 bg-slate-900 text-white rounded"
//         >
//           Nuevo socio
//         </Link>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border">
//           <thead className="bg-slate-100">
//             <tr>
//               <th className="p-2 text-left">ID</th>
//               <th className="p-2 text-left">Nombre</th>
//               <th className="p-2 text-left">Pendientes</th>
//               <th className="p-2 text-left">Total pendiente</th>
//               <th className="p-2 text-left">Pagados</th>
//               <th className="p-2 text-left">Total pagado</th>
//               <th className="p-2 text-left">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r) => (
//               <tr key={r.id} className="border-t">
//                 <td className="p-2">{r.id}</td>
//                 <td className="p-2">{r.name}</td>
//                 <td className="p-2">{r.pendientes}</td>
//                 <td className="p-2">${r.totalPendiente.toFixed(2)}</td>
//                 <td className="p-2">{r.pagados}</td>
//                 <td className="p-2">${r.totalPagado.toFixed(2)}</td>
//                 <td className="p-2 space-x-3">
//                   <Link
//                     to={`/admin/pagos/socio/${r.id}`}
//                     className="text-blue-600 underline"
//                   >
//                     Pagos
//                   </Link>
//                   <Link
//                     to={`/admin/socios/${r.id}`}
//                     className="text-green-700 underline"
//                   >
//                     Ver
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//             {rows.length === 0 && (
//               <tr>
//                 <td className="p-3" colSpan={7}>
//                   Sin socios con pagos aún.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
// src/pages/admin/AdminSociosList.jsx
// src/pages/admin/AdminSociosList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
// Alias para tu adminService actual
import { getSocios as getSellersAdmin, patchSocio as patchSellerAdmin } from "../../api/adminService";

const TIPO_OPTS = [
  { value: "", label: "Todos" },
  { value: "basico", label: "Básico" },
  { value: "medio", label: "Medio" },
  { value: "pro", label: "Pro" },
];
const ESTADO_OPTS = [
  { value: "", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
];

// % por tier (frontend)
const DEFAULT_COMMISSION = { basico: 10.0, medio: 7.5, pro: 5.0 };

export default function AdminSociosList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [activo, setActivo] = useState(""); // "", "true", "false"
  const [ordering, setOrdering] = useState("id");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 25;

  // edición por fila
  const [dirty, setDirty] = useState({}); // {id: {campo: valor,...}}

  const params = useMemo(
    () => ({
      q: q || undefined,
      tipo_socio: tipo || undefined,
      estado: estado || undefined,
      activo: activo || undefined,
      ordering,
      page,
    }),
    [q, tipo, estado, activo, ordering, page]
  );

  const fetchRows = async () => {
    setLoading(true);
    try {
      const data = await getSellersAdmin(params);
      const list = Array.isArray(data?.results) ? data.results : data || [];
      setRows(list);
      setCount(data?.count ?? list.length);
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar la lista de socios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onCell = (id, field, value) => {
    // Actualiza la fila visible
    setRows((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, [field]: value };
        // Si cambió el tier y aún no tocamos comisión en esta edición, aplicamos default
        if (field === "tipo_socio" && !(dirty[id]?.hasOwnProperty("comision"))) {
          const def = DEFAULT_COMMISSION[value];
          if (def != null) next.comision = def;
        }
        return next;
      })
    );

    // Marca los cambios pendientes (dirty)
    setDirty((d) => {
      const nextDirty = { ...(d[id] || {}), [field]: value };
      if (field === "tipo_socio" && !(d[id]?.hasOwnProperty("comision"))) {
        const def = DEFAULT_COMMISSION[value];
        if (def != null) nextDirty.comision = def;
      }
      return { ...d, [id]: nextDirty };
    });
  };

  const onSave = async (id) => {
    if (!dirty[id]) return;
    const patch = { ...dirty[id] };

    // normalizar tipos
    if (patch.comision != null) {
      const n = Number(patch.comision);
      if (Number.isNaN(n)) {
        delete patch.comision;
      } else {
        patch.comision = n;
      }
    }
    if (patch.activo != null) patch.activo = !!patch.activo;

    try {
      await patchSellerAdmin(id, patch);
      setDirty((d) => {
        const { [id]: _, ...rest } = d;
        return rest;
      });
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar los cambios");
      fetchRows();
    }
  };

  const onCancel = (id) => {
    setDirty((d) => {
      const { [id]: _, ...rest } = d;
      return rest;
    });
    fetchRows();
  };

  const isDirty = (id) => !!dirty[id];

  const pages = Math.max(1, Math.ceil(count / pageSize));

  const header = (label, key) => (
    <button
      onClick={() => setOrdering((o) => (o === key ? `-${key}` : key))}
      className="font-semibold inline-flex items-center gap-1"
      title="Ordenar"
    >
      {label}
      <span className="text-xs opacity-50">
        {ordering === key ? "▲" : ordering === `-${key}` ? "▼" : ""}
      </span>
    </button>
  );

  return (
    <div>
      {/* Título + crear socio */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Socios</h1>
        <Link to="/admin/socios/nuevo" className="px-3 py-2 bg-slate-900 text-white rounded">
          Nuevo socio
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Buscar (nombre / cuit / email)</label>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="p.ej. juan, 20-xxxx, tienda..."
            className="border rounded px-3 py-2 w-72"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tipo de socio</label>
          <select
            value={tipo}
            onChange={(e) => {
              setPage(1);
              setTipo(e.target.value);
            }}
            className="border rounded px-3 py-2"
          >
            {TIPO_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => {
              setPage(1);
              setEstado(e.target.value);
            }}
            className="border rounded px-3 py-2"
          >
            {ESTADO_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Activo</label>
          <select
            value={activo}
            onChange={(e) => {
              setPage(1);
              setActivo(e.target.value);
            }}
            className="border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
        <button
          onClick={() => {
            setQ("");
            setTipo("");
            setEstado("");
            setActivo("");
            setOrdering("id");
            setPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">{header("ID", "id")}</th>
              <th className="p-2">{header("Nombre fantasía", "nombre_fantasia")}</th>
              <th className="p-2">{header("Email", "email")}</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">{header("CUIT", "cuit")}</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Celular</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">{header("Tier", "tipo_socio")}</th>
              <th className="p-2">{header("Estado", "estado")}</th>
              <th className="p-2">{header("Comisión %", "comision")}</th>
              <th className="p-2">{header("Activo", "activo")}</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={14}>
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={14}>
                  Sin resultados.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t align-top">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-56"
                      value={r.nombre_fantasia || ""}
                      onChange={(e) => onCell(r.id, "nombre_fantasia", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-56"
                      value={r.email || ""}
                      onChange={(e) => onCell(r.id, "email", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-36"
                      value={r.nombre || ""}
                      onChange={(e) => onCell(r.id, "nombre", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-36"
                      value={r.apellido || ""}
                      onChange={(e) => onCell(r.id, "apellido", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-40"
                      value={r.cuit || ""}
                      onChange={(e) => onCell(r.id, "cuit", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-36"
                      value={r.telefono || ""}
                      onChange={(e) => onCell(r.id, "telefono", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-36"
                      value={r.celular || ""}
                      onChange={(e) => onCell(r.id, "celular", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded px-2 py-1 w-56"
                      value={r.direccion_local || ""}
                      onChange={(e) => onCell(r.id, "direccion_local", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={r.tipo_socio || "basico"}
                      onChange={(e) => onCell(r.id, "tipo_socio", e.target.value)}
                    >
                      <option value="basico">Básico</option>
                      <option value="medio">Medio</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={r.estado || "pendiente"}
                      onChange={(e) => onCell(r.id, "estado", e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="border rounded px-2 py-1 w-24"
                      value={r.comision ?? 0}
                      onChange={(e) => onCell(r.id, "comision", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!r.activo}
                      onChange={(e) => onCell(r.id, "activo", e.target.checked)}
                    />
                  </td>
                  <td className="p-2">
                    {isDirty(r.id) ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSave(r.id)}
                          className="px-2 py-1 bg-slate-900 text-white rounded"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => onCancel(r.id)}
                          className="px-2 py-1 border rounded"
                        >
                          Deshacer
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      <div className="flex items-center gap-2 mt-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 border rounded"
        >
          Prev
        </button>
        <div>
          Página {page} de {pages}
        </div>
        <button
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
