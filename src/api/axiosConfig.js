import axios from "axios";

// Base del backend (sin barra final). Ej: https://intishopback.onrender.com/api
const base = (import.meta?.env?.VITE_API_URL || "").replace(/\/$/, "");

const axiosInstance = axios.create({
  baseURL: base || "/",
  withCredentials: false,
});

// Normaliza rutas mal formadas (evita /api/api/...)
axiosInstance.interceptors.request.use((config) => {
  if (config?.url?.startsWith?.("/api/api")) {
    config.url = config.url.replace("/api/api", "/api");
  }
  return config;
});

// Compatibilidad con código viejo
if (typeof window !== "undefined") {
  window.axiosInstance = axiosInstance;
  window.api = axiosInstance;
}

export default axiosInstance;
