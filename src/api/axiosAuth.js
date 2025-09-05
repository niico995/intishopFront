// Axios autenticado para endpoints protegidos
import axios from "axios";
import axiosInstance from "./axiosConfig";

// Creamos una instancia nueva tomando como base la config del axiosInstance público
const axiosAuth = axios.create({
  baseURL: axiosInstance?.defaults?.baseURL || "",
  withCredentials: axiosInstance?.defaults?.withCredentials || false,
  headers: { ...(axiosInstance?.defaults?.headers || {}) },
});

// Interceptor: agrega Authorization si hay token
axiosAuth.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      null;

    if (token) {
      config.headers = config.headers || {};
      // Si ya viene un Authorization explícito, lo respetamos
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAuth;
