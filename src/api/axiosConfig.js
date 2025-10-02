// // src/api/axiosConfig.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://intishopback.onrender.com/api/',
//   withCredentials: false,
//   timeout: 15000,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access') || localStorage.getItem('token'); // 👈 cubre ambos
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default axiosInstance;
// src/api/axiosConfig.js
// src/api/axiosConfig.js
// src/api/axiosConfig.js
import axios from "axios";

// ────────────── BASE URL ──────────────
// Normaliza para que SIEMPRE termine en .../api/
function normalizeApi(url) {
  const u = String(url || "").trim().replace(/\/+$/, ""); // quita slashes finales
  return /\/api$/i.test(u) ? u + "/" : u + "/api/";
}

const rawEnv = import.meta.env.VITE_API_URL || window.location.origin;
const baseURL = normalizeApi(rawEnv);

// ────────────── HELPERS CSRF ──────────────
export function getCSRFTokenFromCookie() {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Llamá esto antes de cualquier POST/PATCH/PUT/DELETE desde tu SPA
 * para que Django establezca la cookie 'csrftoken'.
 * Seguro e idempotente.
 */
export async function ensureCsrfCookie() {
  try {
    // Con baseURL normalizado, esto pega a .../api/csrf/
    await instance.get("csrf/");
  } catch {
    // No romper el flujo si falla; se puede reintentar en la próxima acción.
  }
}

// ────────────── AXIOS INSTANCE ──────────────
const instance = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANTE: habilita cookies (sessionid, csrftoken)
});

// ────────────── INTERCEPTOR REQUEST ──────────────
// 1) Authorization: Bearer <access>
// 2) X-CSRFToken automáticamente en métodos no seguros, si existe cookie
instance.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  // JWT
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // CSRF (solo para métodos que lo requieren si estás usando CsrfViewMiddleware)
  const method = (config.method || "get").toUpperCase();
  const needsCsrf = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (needsCsrf && !config.headers["X-CSRFToken"]) {
    const csrftoken = getCSRFTokenFromCookie();
    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken;
    }
  }

  // Consejo: NO fijes 'Content-Type' manualmente en multipart; dejá que el browser lo ponga (boundary)
  return config;
});

// ────────────── INTERCEPTOR RESPONSE ──────────────
// Detecta 401 y refresca token automáticamente
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si fue 401 y nunca reintentamos, tratamos de refrescar
    if (
      error?.response?.status === 401 &&
      !originalRequest?._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        // baseURL ya termina en /api/
        const { data } = await axios.post(baseURL + "token/refresh/", { refresh });
        const newAccess = data?.access;
        if (newAccess) {
          localStorage.setItem("access", newAccess);
          localStorage.setItem("token", newAccess); // compat con código viejo
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return instance(originalRequest);
        }
      } catch (e) {
        console.error("No se pudo refrescar token:", e);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  console.log("[axios] baseURL:", baseURL);
}

export default instance;
