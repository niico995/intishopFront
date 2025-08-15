// src/api/adminService.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

// Si cambiás algo del backend, ajustá estas rutas:
const URLS = {
  // SOCIOS (adminControl)
  socios_list: `${BASE}admin/sellers/`,          // GET
  socios_create: `${BASE}admin/sellers/`,        // POST
  socio_detail: (id) => `${BASE}admin/sellers/${id}/`,        // GET/PATCH
  socio_toggle: (id) => `${BASE}admin/sellers/${id}/toggle-estado/`, // POST/PATCH

  // PAGOS
  pagos_todos: `${BASE}sellers/pagos/todos/`,    // GET (ya existe)
  pagos_por_socio: (id) => `${BASE}admin/pagos/?seller=${id}`,        // GET (ajustar)
  pago_marcar_pagado: (id) => `${BASE}admin/pagos/${id}/marcar-pagado/`, // POST/PATCH
  pagos_marcar_todos: (id) => `${BASE}admin/pagos/marcar-todos/?seller=${id}`, // POST

  // Si ya tenés endpoints distintos, solo actualizá estas constantes.
};

const api = axios.create({ timeout: 20000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// SOCIOS
export const getSocios = async () => (await api.get(URLS.socios_list)).data;
export const createSocio = async (payload) => (await api.post(URLS.socios_create, payload)).data;
export const getSocio = async (id) => (await api.get(URLS.socio_detail(id))).data;
export const patchSocio = async (id, payload) => (await api.patch(URLS.socio_detail(id), payload)).data;
export const toggleSocio = async (id) => (await api.post(URLS.socio_toggle(id))).data;

// PAGOS
export const getPagosTodos = async () => (await api.get(URLS.pagos_todos)).data;
// Si no tenés endpoint por socio, filtramos client-side desde pagos_todos
export const getPagosPorSocio = async (sellerId) => {
  try {
    return (await api.get(URLS.pagos_por_socio(sellerId))).data;
  } catch {
    const all = await getPagosTodos();
    return all.filter(p => (p.seller_id ?? p.seller) === Number(sellerId));
  }
};
export const marcarPagoPagado = async (pagoId) => (await api.post(URLS.pago_marcar_pagado(pagoId))).data;
export const marcarTodosPagados = async (sellerId) => (await api.post(URLS.pagos_marcar_todos(sellerId))).data;
