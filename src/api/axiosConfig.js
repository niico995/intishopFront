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
import axios from "axios";

// Dejá la base apuntando a la RAÍZ (sin /api). Aseguro barra final.
const base = (import.meta.env.VITE_API_URL || "").replace(/\/?$/, "/");

const instance = axios.create({
  baseURL: base,           // <- NO agregamos /api acá
  timeout: 15000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
