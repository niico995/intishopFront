// // import axios from "axios";

// // const BASE = import.meta.env.VITE_API_URL || "https://intishopback.onrender.com/api/";

// // // Endpoints backend recomendados (DRF):
// // // - GET/POST   /api/sellers/admin/socios/
// // // - GET/PATCH  /api/sellers/admin/socios/:id/
// // // - POST       /api/sellers/admin/socios/:id/toggle-estado/
// // export const URLS = {
// //   // SOCIOS (admin)
// //   socios_list: `${BASE}sellers/admin/socios/`,                  // GET (admite ?q, ?tipo_socio, ?estado, ?activo, ?ordering, ?page)
// //   socios_create: `${BASE}sellers/admin/socios/`,                // POST
// //   socio_detail: (id) => `${BASE}sellers/admin/socios/${id}/`,   // GET/PATCH
// //   socio_toggle: (id) => `${BASE}sellers/admin/socios/${id}/toggle-estado/`, // POST

// //   // PAGOS (seguís usando los que ya tenés)
// //   pagos_todos: `${BASE}sellers/pagos/todos/`,                   // GET
// //   pagos_por_socio: (id) => `${BASE}admin/pagos/?seller=${id}`,  // GET (si no existe, hacemos fallback abajo)
// //   pago_marcar_pagado: (id) => `${BASE}admin/pagos/${id}/marcar-pagado/`, // POST
// //   pagos_marcar_todos: (id) => `${BASE}admin/pagos/marcar-todos/?seller=${id}`, // POST
// // };

// // const api = axios.create({ timeout: 20000 });

// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("access") || localStorage.getItem("token");
// //   if (token) config.headers.Authorization = `Bearer ${token}`;
// //   return config;
// // });

// // // ---------- SOCIOS ----------
// // export const getSocios = async (params = {}) =>
// //   (await api.get(URLS.socios_list, { params })).data;

// // export const createSocio = async (payload) =>
// //   (await api.post(URLS.socios_create, payload)).data;

// // export const getSocio = async (id) =>
// //   (await api.get(URLS.socio_detail(id))).data;

// // export const patchSocio = async (id, payload) =>
// //   (await api.patch(URLS.socio_detail(id), payload)).data;

// // export const toggleSocio = async (id) =>
// //   (await api.post(URLS.socio_toggle(id))).data;

// // // ---------- PAGOS ----------
// // export const getPagosTodos = async () =>
// //   (await api.get(URLS.pagos_todos)).data;

// // // Si todavía no tenés /api/admin/pagos, filtramos client-side:
// // export const getPagosPorSocio = async (sellerId) => {
// //   try {
// //     return (await api.get(URLS.pagos_por_socio(sellerId))).data;
// //   } catch {
// //     const all = await getPagosTodos();
// //     return all.filter((p) => (p.seller_id ?? p.seller) === Number(sellerId));
// //   }
// // };

// // export const marcarPagoPagado = async (pagoId) =>
// //   (await api.post(URLS.pago_marcar_pagado(pagoId))).data;

// // export const marcarTodosPagados = async (sellerId) =>
// //   (await api.post(URLS.pagos_marcar_todos(sellerId))).data;
// import api from "./axiosConfig";

// const flattenPayouts = (payouts = []) => {
//   const out = [];
//   payouts.forEach((p) => {
//     const seller_id = p.seller_id ?? p.seller ?? null;
//     const seller_nombre = p.seller_nombre || `Seller ${seller_id || ""}`;
//     const status = p.status || "pendiente";
//     const fecha_pago = p.paid_at || null;
//     const items = Array.isArray(p.items) ? p.items : [];
//     items.forEach((it) => {
//       out.push({
//         id: it.id,
//         seller_id,
//         seller_nombre,
//         monto: Number(it.neto ?? it.bruto ?? 0),
//         estado: status,
//         fecha_venta: null,
//         fecha_pago,
//         venta_id: it.venta_id,
//         producto: it.producto || "",
//         payout_id: p.id,
//       });
//     });
//   });
//   return out;
// };

// export async function listPayouts(params = {}) {
//   const { seller, status } = params;
//   const q = {};
//   if (seller) q.seller = seller;
//   if (status) q.status = status;
//   const { data } = await api.get("/api/ventas/admin/liquidaciones/", { params: q });
//   return Array.isArray(data?.results) ? data.results : [];
// }

// export async function getPagosTodos() {
//   const [pend, pagadas] = await Promise.all([
//     listPayouts({ status: "pendiente" }),
//     listPayouts({ status: "pagado" }),
//   ]);
//   return flattenPayouts([...pend, ...pagadas]);
// }

// export async function getPagosPorSocio(sellerId) {
//   const [pend, pagadas] = await Promise.all([
//     listPayouts({ status: "pendiente", seller: sellerId }),
//     listPayouts({ status: "pagado", seller: sellerId }),
//   ]);
//   return flattenPayouts([...pend, ...pagadas]);
// }

// export async function marcarPagoPagado(pagoItem) {
//   const itemId = typeof pagoItem === "object" ? (pagoItem.id ?? pagoItem.item_id) : pagoItem;
//   const pending = await listPayouts({ status: "pendiente" });
//   const found = pending.find(p => Array.isArray(p.items) && p.items.some(it => String(it.id) === String(itemId)));
//   if (!found) return { ok: false, detail: "No se encontró la liquidación pendiente para ese item" };
//   await api.post(`/api/ventas/admin/liquidaciones/${found.id}/marcar-pagado/`);
//   return { ok: true };
// }

// export async function marcarTodosPagados(sellerId) {
//   const pending = await listPayouts({ status: "pendiente", seller: sellerId });
//   for (const p of pending) {
//     await api.post(`/api/ventas/admin/liquidaciones/${p.id}/marcar-pagado/`);
//   }
//   return { ok: true, count: pending.length };
// }

// export default {
//   getPagosTodos,
//   getPagosPorSocio,
//   marcarPagoPagado,
//   marcarTodosPagados,
//   listPayouts,
// };
// Servicio Admin: Pagos (liquidaciones) + Socios
import api from "./axiosConfig";

/* =========================
   PAGOS / LIQUIDACIONES
   ========================= */

// Convierte "payouts" (liquidaciones) en filas "pagos" compatibles con tus pantallas
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
        id: it.id,                              // id del item de liquidación
        seller_id,
        seller_nombre,
        monto: Number(it.neto ?? it.bruto ?? 0),
        estado: status,
        fecha_venta: null,                      // si luego exponés created_at de Venta, lo poblamos
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
   =========================
   Estas funciones coinciden con los imports de:
   - AdminSocioList.jsx
   - AdminSocioDetail.jsx
   - AdminSocioForm.jsx
   Si tu backend expone rutas distintas, ajustá abajo los paths.
*/

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

  // Ruta "preferida" (admin)
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
    // Fallback a una posible ruta legacy
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
    // Fallback legacy
    const { data } = await api.get(`/api/sellers/${id}/`);
    return data;
  }
}

export async function createSocio(payload) {
  try {
    const { data } = await api.post("/api/sellers/admin/socios/crear/", payload);
    return data;
  } catch {
    // Fallback legacy
    const { data } = await api.post("/api/sellers/", payload);
    return data;
  }
}

export async function patchSocio(id, payload) {
  try {
    const { data } = await api.patch(`/api/sellers/admin/socios/${id}/`, payload);
    return data;
  } catch {
    // Fallback legacy
    const { data } = await api.patch(`/api/sellers/${id}/`, payload);
    return data;
  }
}

export async function toggleSocio(id) {
  try {
    // Ruta "bonita" para activar/desactivar
    const { data } = await api.post(`/api/sellers/admin/socios/${id}/toggle-activo/`);
    return data;
  } catch {
    // Fallback: leer y hacer flip del campo "activo"
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
