
import axios from "axios";

const API_ROOT =
  (import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "https://intishopback.onrender.com/api/".replace(/\/+$/, ""));

// Si VITE_API_URL ya incluye /api/, dejamos así; si no, agregálo.
const baseURL = API_ROOT.endsWith("/api") ? API_ROOT + "/" : (API_ROOT + "/");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Meté access/token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh automático si 401 y hay refresh en localStorage
let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config: original } = error || {};
    if (response?.status === 401 && !original?._retry) {
      original._retry = true;

      if (!refreshing) {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return Promise.reject(error);

        // deducimos root del backend (quita el /api final si está)
        const root = baseURL.replace(/\/api\/?$/, "");

        refreshing = fetch(`${root}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        })
          .then((r) => (r.ok ? r.json() : Promise.reject(r)))
          .then((d) => {
            const newAccess = d?.access;
            if (newAccess) localStorage.setItem("access", newAccess);
            return newAccess;
          })
          .finally(() => (refreshing = null));
      }

      const newAccess = await refreshing;
      if (!newAccess) return Promise.reject(error);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
