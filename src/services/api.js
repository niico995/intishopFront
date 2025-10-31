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
// import axios from "axios";

// const API_ROOT = (import.meta.env.VITE_API_ROOT || "https://intishopback.onrender.com").replace(/\/+$/, "");

// const api = axios.create({
//   baseURL: `${API_ROOT}/api`,
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// // 👉 interceptor que mete el access token en cada request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token") || localStorage.getItem("access");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 👉 interceptor de respuesta que renueva el access si expiró
// let refreshing = null;

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config;

//     // si recibimos 401 y aún no reintentamos
//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;

//       if (!refreshing) {
//         const refresh = localStorage.getItem("refresh");
//         if (!refresh) {
//           // si no hay refresh → limpiar y redirigir a login
//           localStorage.removeItem("token");
//           localStorage.removeItem("refresh");
//           window.location.href = "/login";
//           return Promise.reject(error);
//         }

//         refreshing = api.post("/token/refresh/", { refresh })
//           .then((r) => {
//             const newAccess = r.data.access;
//             localStorage.setItem("token", newAccess);
//             api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
//             return newAccess;
//           })
//           .finally(() => (refreshing = null));
//       }

//       const newAccess = await refreshing;
//       original.headers.Authorization = `Bearer ${newAccess}`;
//       return api(original);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
// src/services/api.js
// src/services/api.js

//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
import axios from "axios";

// const API_ROOT = (
//   import.meta.env.VITE_API_URL || "http://localhost:8000/api/"
// ).replace(/\/+$/, "");

// // Si VITE_API_URL ya incluye /api, aseguramos una sola barra al final
// const baseURL = API_ROOT.endsWith("/api") ? API_ROOT + "/" : API_ROOT + "/";

// const api = axios.create({
//   baseURL,
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// // token en cada request (access o token)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access") || localStorage.getItem("token");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // refresh token (si existe)
// let refreshing = null;
// api.interceptors.response.use(
//   (r) => r,
//   async (error) => {
//     const { response, config: original } = error || {};
//     if (response?.status === 401 && !original?._retry) {
//       original._retry = true;

//       if (!refreshing) {
//         const refresh = localStorage.getItem("refresh");
//         if (!refresh) return Promise.reject(error);

//         // deduce root (quita /api al final)
//         const root = baseURL.replace(/\/api\/?$/, "");
//         refreshing = fetch(`${root}/api/token/refresh/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refresh }),
//         })
//           .then((r) => (r.ok ? r.json() : null))
//           .then((d) => {
//             const newAccess = d?.access;
//             if (newAccess) {
//               localStorage.setItem("token", newAccess);
//               api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
//             }
//             return newAccess || null;
//           })
//           .finally(() => (refreshing = null));
//       }

//       const newAccess = await refreshing;
//       if (!newAccess) return Promise.reject(error);
//       original.headers.Authorization = `Bearer ${newAccess}`;
//       return api(original);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

// ────────────── BASE URL ──────────────
// Siempre termina en .../api/
function normalizeApi(url) {
  const u = String(url || "").trim().replace(/\/+$/, ""); // quita slashes finales
  return /\/api$/i.test(u) ? u + "/" : u + "/api/";
}

const raw = import.meta.env.VITE_API_URL || "http://localhost:8000";
const baseURL = normalizeApi(raw);

const api = axios.create({
  baseURL,
  // withCredentials solo si usás cookies/CSRF; si no, podés quitarlo.
  withCredentials: true,
  timeout: 15000,
  // ⚠️ No seteamos Content-Type global: para multipart debe quedar libre
});

// token en cada request (access o token)
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization; // evita Bearer viejo
  }
  return config;
});

// refresh token (si existe)
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

        // deduce root (quita /api al final) y pega al endpoint estándar
        const root = baseURL.replace(/\/api\/?$/, "");
        refreshing = fetch(`${root}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            const newAccess = d?.access;
            if (newAccess) {
              // Guardamos en ambas claves por compatibilidad
              localStorage.setItem("access", newAccess);
              localStorage.setItem("token", newAccess);
              api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            }
            return newAccess || null;
          })
          .finally(() => (refreshing = null));
      }

      const newAccess = await refreshing;
      if (!newAccess) return Promise.reject(error);
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
