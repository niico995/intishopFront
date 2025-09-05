// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://intishopback.onrender.com/api/',
  withCredentials: false,
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access') || localStorage.getItem('token'); // 👈 cubre ambos
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;


// --- Public endpoints where we must NOT send Authorization (to avoid 401 on expired tokens)
const PUBLIC_URLS = [
  "/api/products/home/destacados",
  "/api/products/listarPublicos",
  "/api/products/listarPublicosCompat",
  "/api/products/public/",
  "/api/products/categorias",
  "/api/products/banners",
  "/api/products/detail",
];

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const isPublic = PUBLIC_URLS.some((p) => url.includes(p));
  if (isPublic) {
    if (config.headers) {
      delete config.headers.Authorization;
    }
    return config;
  }
  // Attach token for private routes
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // Token inválido/expirado: limpiamos y seguimos como público
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);
