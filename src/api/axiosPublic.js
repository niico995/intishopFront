// import axios from 'axios';

// const baseURL =
//   (import.meta.env.VITE_API_URL?.replace(/\/?$/, '/')) // debe terminar con /
//   || 'https://intishopback.onrender.com/api/'; // 👈 en local: HTTP

// const axiosPublic = axios.create({
//   baseURL,
//   timeout: 15000,
//   withCredentials: false,
// });

// axiosPublic.interceptors.request.use((config) => {
//   if (config.headers) delete config.headers.Authorization;
//   return config;
// });

// export default axiosPublic;
// src/api/axiosPublic.js
import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL?.replace(/\/?$/, "/")) ||
  "http://localhost:8000/api/";

const axiosPublic = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: false,
});

// Asegurá que NO salga Authorization en públicas
axiosPublic.interceptors.request.use((config) => {
  if (config?.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

export default axiosPublic;
