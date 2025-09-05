// src/api/axiosPublic.js
import axios from "axios";

const base = (import.meta.env.VITE_API_URL || "https://intishopback.onrender.com").replace(/\/+$/, "");

const axiosPublic = axios.create({
  baseURL: base,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export default axiosPublic;
