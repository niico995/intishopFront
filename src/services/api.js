// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://intishopback.onrender.com/api/', // cambiar por el de producción
// });

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
// src/services/api.js
import axios from "axios";

const API_ROOT = (import.meta.env.VITE_API_ROOT || "https://intishopback.onrender.com").replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// 👉 interceptor que mete el access token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 interceptor de respuesta que renueva el access si expiró
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // si recibimos 401 y aún no reintentamos
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
          // si no hay refresh → limpiar y redirigir a login
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        refreshing = api.post("/token/refresh/", { refresh })
          .then((r) => {
            const newAccess = r.data.access;
            localStorage.setItem("token", newAccess);
            api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            return newAccess;
          })
          .finally(() => (refreshing = null));
      }

      const newAccess = await refreshing;
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
