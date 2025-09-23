// import axios from "axios";

// const BASE = import.meta.env.VITE_API_URL || "https://intishopback.onrender.com/api/";

// // Endpoints backend recomendados (DRF):
// // - GET/POST   /api/sellers/admin/socios/
// // - GET/PATCH  /api/sellers/admin/socios/:id/
// // - POST       /api/sellers/admin/socios/:id/toggle-estado/
// export const URLS = {
//   // SOCIOS (admin)
//   socios_list: `${BASE}sellers/admin/socios/`,                  // GET (admite ?q, ?tipo_socio, ?estado, ?activo, ?ordering, ?page)
//   socios_create: `${BASE}sellers/admin/socios/`,                // POST
//   socio_detail: (id) => `${BASE}sellers/admin/socios/${id}/`,   // GET/PATCH
//   socio_toggle: (id) => `${BASE}sellers/admin/socios/${id}/toggle-estado/`, // POST

//   // PAGOS (seguís usando los que ya tenés)
//   pagos_todos: `${BASE}sellers/pagos/todos/`,                   // GET
//   pagos_por_socio: (id) => `${BASE}admin/pagos/?seller=${id}`,  // GET (si no existe, hacemos fallback abajo)
//   pago_marcar_pagado: (id) => `${BASE}admin/pagos/${id}/marcar-pagado/`, // POST
//   pagos_marcar_todos: (id) => `${BASE}admin/pagos/marcar-todos/?seller=${id}`, // POST
// };

// const api = axios.create({ timeout: 20000 });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access") || localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ---------- SOCIOS ----------
// export const getSocios = async (params = {}) =>
//   (await api.get(URLS.socios_list, { params })).data;

// export const createSocio = async (payload) =>
//   (await api.post(URLS.socios_create, payload)).data;

// export const getSocio = async (id) =>
//   (await api.get(URLS.socio_detail(id))).data;

// export const patchSocio = async (id, payload) =>
//   (await api.patch(URLS.socio_detail(id), payload)).data;

// export const toggleSocio = async (id) =>
//   (await api.post(URLS.socio_toggle(id))).data;

// // ---------- PAGOS ----------
// export const getPagosTodos = async () =>
//   (await api.get(URLS.pagos_todos)).data;

// // Si todavía no tenés /api/admin/pagos, filtramos client-side:
// export const getPagosPorSocio = async (sellerId) => {
//   try {
//     return (await api.get(URLS.pagos_por_socio(sellerId))).data;
//   } catch {
//     const all = await getPagosTodos();
//     return all.filter((p) => (p.seller_id ?? p.seller) === Number(sellerId));
//   }
// };

// export const marcarPagoPagado = async (pagoId) =>
//   (await api.post(URLS.pago_marcar_pagado(pagoId))).data;

// export const marcarTodosPagados = async (sellerId) =>
//   (await api.post(URLS.pagos_marcar_todos(sellerId))).data;
// src/api/adminService.js
// src/api/adminService.js
import axios from "axios";

// Base desde VITE_API_URL (asegurando barra final). Fallback local útil en dev.
const BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/?$/, "/")) ||
  "http://localhost:8000/api/";

export const adminApi = axios.create({
  baseURL: BASE,
  timeout: 20000,
});

// Adjunta Bearer si existe
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =======================
 *   SOCIOS (ADMIN)
 * =======================
 * Endpoints esperados en el backend:
 *  - GET/POST   /api/sellers/admin/socios/
 *  - GET/PATCH  /api/sellers/admin/socios/:id/
 *  - POST       /api/sellers/admin/socios/:id/toggle-estado/
 */

export const getSocios = async (params = {}) => {
  const { data } = await adminApi.get("sellers/admin/socios/", { params });
  return data;
};

export const createSocio = async (payload) => {
  const { data } = await adminApi.post("sellers/admin/socios/", payload);
  return data;
};

export const getSocio = async (id) => {
  const { data } = await adminApi.get(`sellers/admin/socios/${id}/`);
  return data;
};

export const patchSocio = async (id, payload) => {
  const { data } = await adminApi.patch(`sellers/admin/socios/${id}/`, payload);
  return data;
};

export const toggleSocio = async (id) => {
  const { data } = await adminApi.post(`sellers/admin/socios/${id}/toggle-estado/`);
  return data;
};

/* =======================
 *   PAGOS (ADMIN)
 * =======================
 * Endpoints disponibles/esperados:
 *  - GET        /api/sellers/pagos/todos/
 *  - GET        /api/admin/pagos/?seller=<id>            (si no existe, hacemos fallback)
 *  - POST       /api/admin/pagos/:id/marcar-pagado/
 *  - POST       /api/admin/pagos/marcar-todos/?seller=<id>
 */

export const getPagosTodos = async () => {
  const { data } = await adminApi.get("sellers/pagos/todos/");
  return data;
};

export const getPagosPorSocio = async (sellerId) => {
  // Intentamos endpoint filtrado; si no existe, filtramos client-side
  try {
    const { data } = await adminApi.get("admin/pagos/", { params: { seller: sellerId } });
    return data;
  } catch (e) {
    const all = await getPagosTodos();
    return (all || []).filter((p) => (p.seller_id ?? p.seller) === Number(sellerId));
  }
};

// Nombre usado por las páginas: marcarPagoPagado
export const marcarPagoPagado = async (pagoId) => {
  const { data } = await adminApi.post(`admin/pagos/${pagoId}/marcar-pagado/`);
  return data;
};

export const marcarTodosPagados = async (sellerId) => {
  // Intentamos bulk. Si no existe, marcamos uno por uno los pendientes.
  try {
    const { data } = await adminApi.post("admin/pagos/marcar-todos/", null, {
      params: { seller: sellerId },
    });
    return data;
  } catch (e) {
    const pagos = await getPagosPorSocio(sellerId);
    const pendientes = (pagos || []).filter((p) => p.estado === "pendiente");
    for (const p of pendientes) {
      try { await marcarPagoPagado(p.id); } catch {}
    }
    return { ok: true, total: pendientes.length };
  }
};

/* =======================
 *   COMPATIBILIDAD (alias)
 * ======================= */
export const getPagoDetallePorSocio = async (id) => {
  // En algunos lugares se usa este nombre. Devolvemos lista de pagos de ese socio.
  return await getPagosPorSocio(id);
};

// Alias antiguo que algunos archivos podrían importar:
export const marcarPagoComoPagado = marcarPagoPagado;
