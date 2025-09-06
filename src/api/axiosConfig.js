import axios from "axios";

// Base del backend (sin barra final). Ej: https://intishopback.onrender.com/api
const base = (import.meta?.env?.VITE_API_URL || "").replace(/\/$/, "");

// Cliente
const axiosInstance = axios.create({
  baseURL: base || "/",
  withCredentials: false,
});

// --- Normalizador de rutas ---
// Evita /api/api/... y también corrige si mandan la URL sin slash inicial.
axiosInstance.interceptors.request.use((config) => {
  let u = config.url || "";
  if (typeof u === "string") {
    // asegurar leading slash
    if (!u.startsWith("/")) u = "/" + u;
    // si viene /api/... lo pasamos a /...
    u = u.replace(/^\/+api\/+/i, "/");
    // compactar múltiples slashes (excepto el de https://)
    u = u.replace(/([^:])\/{2,}/g, "$1/");
    config.url = u;
  }
  return config;
});

if (typeof window !== "undefined") {
  window.axiosInstance = axiosInstance;
  window.api = axiosInstance; // compat legacy
}

export default axiosInstance;
