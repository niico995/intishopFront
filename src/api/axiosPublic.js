// src/api/axiosPublic.js
import axios from "axios";

/**
 * Normaliza la base para que SIEMPRE apunte a .../api
 * - Si VITE_API_URL = "https://intishopback.onrender.com" -> ".../api"
 * - Si ya trae "/api", se respeta.
 */
function normalizeBase(raw) {
  let u = String(raw || "").trim().replace(/\/+$/, "");
  if (!u) u = "https://intishopback.onrender.com";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  if (!/\/api$/i.test(u)) u += "/api";
  return u;
}

const baseURL = normalizeBase(import.meta.env.VITE_API_URL);

const axiosPublic = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export default axiosPublic;
