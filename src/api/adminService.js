// Servicio Admin: Pagos (liquidaciones) + Socios
import api from "./axiosConfig";

/* =========================
   PAGOS / LIQUIDACIONES
   ========================= */

const flattenPayouts = (payouts = []) => {
  const out = [];
  payouts.forEach((p) => {
    const seller_id = p.seller_id ?? p.seller ?? null;
    const seller_nombre = p.seller_nombre || `Seller ${seller_id || ""}`;
    const status = p.status || "pendiente";
    const fecha_pago = p.paid_at || null;
    const items = Array.isArray(p.items) ? p.items : [];
    items.forEach((it) => {
      out.push({
        id: it.id,
        seller_id,
        seller_nombre,
        monto: Number(it.neto ?? it.bruto ?? 0),
        estado: status,
        fecha_venta: null,
        fecha_pago,
        venta_id: it.venta_id,
        producto: it.producto || "",
        payout_id: p.id,
      });
    });
  });
  return out;
};

export async function listPayouts(params = {}) {
  const { seller, status } = params;
  const q = {};
  if (seller) q.seller = seller;
  if (status) q.status = status;
  const { data } = await api.get("/api/ventas/admin/liquidaciones/", { params: q });
  return Array.isArray(data?.results) ? data.results : [];
}

export async function getPagosTodos() {
  const [pend, pagadas] = await Promise.all([
    listPayouts({ status: "pendiente" }),
    listPayouts({ status: "pagado" }),
  ]);
  return flattenPayouts([...pend, ...pagadas]);
}

export async function getPagosPorSocio(sellerId) {
  const [pend, pagadas] = await Promise.all([
    listPayouts({ status: "pendiente", seller: sellerId }),
    listPayouts({ status: "pagado", seller: sellerId }),
  ]);
  return flattenPayouts([...pend, ...pagadas]);
}

export async function marcarPagoPagado(pagoItem) {
  const itemId = typeof pagoItem === "object" ? (pagoItem.id ?? pagoItem.item_id) : pagoItem;
  const pending = await listPayouts({ status: "pendiente" });
  const found = pending.find(
    (p) => Array.isArray(p.items) && p.items.some((it) => String(it.id) === String(itemId))
  );
  if (!found) return { ok: false, detail: "No se encontró la liquidación pendiente para ese item" };
  await api.post(`/api/ventas/admin/liquidaciones/${found.id}/marcar-pagado/`);
  return { ok: true };
}

export async function marcarTodosPagados(sellerId) {
  const pending = await listPayouts({ status: "pendiente", seller: sellerId });
  for (const p of pending) {
    await api.post(`/api/ventas/admin/liquidaciones/${p.id}/marcar-pagado/`);
  }
  return { ok: true, count: pending.length };
}

/* =========================
   SOCIOS (ADMIN)
   ========================= */

export async function getSocios({
  q,
  tipo,            // "basico" | "medio" | "pro"
  activo,          // true | false
  ordering,        // ej: "-created_at" | "nombre"
  page = 1,
  page_size = 20,
} = {}) {
  const params = { page, page_size };
  if (q) params.search = q;
  if (tipo) params.tipo = tipo;
  if (typeof activo !== "undefined" && activo !== "") params.activo = activo;
  if (ordering) params.ordering = ordering;

  try {
    const { data } = await api.get("/api/sellers/admin/socios/", { params });
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    return {
      results,
      count: data?.count ?? results.length,
      page,
      page_size,
      pages: data?.count && page_size ? Math.max(1, Math.ceil(data.count / page_size)) : 1,
    };
  } catch {
    // Fallback legacy
    try {
      const { data } = await api.get("/api/sellers/", { params });
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      return {
        results,
        count: data?.count ?? results.length,
        page,
        page_size,
        pages: data?.count && page_size ? Math.max(1, Math.ceil(data.count / page_size)) : 1,
      };
    } catch {
      return { results: [], count: 0, page, page_size, pages: 1 };
    }
  }
}

export async function getSocio(id) {
  try {
    const { data } = await api.get(`/api/sellers/admin/socios/${id}/`);
    return data;
  } catch {
    const { data } = await api.get(`/api/sellers/${id}/`);
    return data;
  }
}

export async function createSocio(payload) {
  try {
    const { data } = await api.post("/api/sellers/admin/socios/crear/", payload);
    return data;
  } catch {
    const { data } = await api.post("/api/sellers/", payload);
    return data;
  }
}

export async function patchSocio(id, payload) {
  try {
    const { data } = await api.patch(`/api/sellers/admin/socios/${id}/`, payload);
    return data;
  } catch {
    const { data } = await api.patch(`/api/sellers/${id}/`, payload);
    return data;
  }
}

export async function toggleSocio(id) {
  try {
    const { data } = await api.post(`/api/sellers/admin/socios/${id}/toggle-activo/`);
    return data;
  } catch {
    try {
      const socio = await getSocio(id);
      const next = !(socio?.activo ?? true);
      return await patchSocio(id, { activo: next });
    } catch {
      return { ok: false };
    }
  }
}

export default {
  // pagos
  listPayouts,
  getPagosTodos,
  getPagosPorSocio,
  marcarPagoPagado,
  marcarTodosPagados,
  // socios
  getSocios,
  getSocio,
  createSocio,
  patchSocio,
  toggleSocio,
};
