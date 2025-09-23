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
import axios from "axios";

// Usa VITE_API_URL y asegura barra final; fallback local en dev
const baseURL =
  (import.meta.env.VITE_API_URL?.replace(/\/?$/, "/")) ||
  "http://localhost:8000/api/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 15000,
});

// Adjunta Bearer si existe (cubre 'access' o 'token')
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
