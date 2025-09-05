// src/api/axiosConfig.js
import axios from "axios";

const base = (import.meta.env.VITE_API_URL || "https://intishopback.onrender.com").replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL: base, // en las llamadas usamos rutas que arrancan con /api/...
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
