// src/api/axiosConfig.js
import axios from "axios";

const raw = import.meta.env.VITE_API_URL || "https://intishopback.onrender.com";
const base = raw.replace(/\/+$/, "").replace(/\/api$/i, "");

const axiosInstance = axios.create({
  baseURL: base,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});


axiosInstance.interceptors.request.use((cfg) => {
  let b = (cfg.baseURL || "").replace(/\/+$/, "");
  let u = (cfg.url || "").replace(/^\/*/, "/");
  if (/\/api$/i.test(b) && /^\/api(\/|$)/i.test(u)) {
    b = b.replace(/\/api$/i, "");
    cfg.baseURL = b;
  }
  cfg.url = u;
  return cfg;
});


try {
  if (typeof window !== "undefined") {
    // Exponer por compatibilidad con código legado
    window.axiosInstance = axiosInstance;
    // api(...) se comporta como axiosInstance(...)
    if (!window.api) window.api = axiosInstance;
  }
} catch {}

export default axiosInstance;
