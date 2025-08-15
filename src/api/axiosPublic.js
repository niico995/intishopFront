import axios from 'axios';

const baseURL =
  (import.meta.env.VITE_API_URL?.replace(/\/?$/, '/')) // debe terminar con /
  || 'http://localhost:8000/api/'; // 👈 en local: HTTP

const axiosPublic = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: false,
});

axiosPublic.interceptors.request.use((config) => {
  if (config.headers) delete config.headers.Authorization;
  return config;
});

export default axiosPublic;
