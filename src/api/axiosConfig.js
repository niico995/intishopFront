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

/**
 * Usa VITE_API_URL si existe. Si no, fallback a "<origin>/api".
 * Aseguramos "/" final.
 *
 * Ejemplos válidos de VITE_API_URL:
 *   https://zfwthkc5-8000.brs.dev.../api
 *   http://localhost:8000/api
 */
const raw = import.meta.env.VITE_API_URL?.trim() || (window.location.origin + "/api");
const baseURL = raw.replace(/\/+$/,"") + "/";

const instance = axios.create({
  baseURL,
  withCredentials: false,
});

// Adjunta token (access o token) a **todas** las requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// (Opcional) log para confirmar en consola adónde pega
if (import.meta.env.DEV) {
  console.log("[axios] baseURL:", baseURL);
}

export default instance;
