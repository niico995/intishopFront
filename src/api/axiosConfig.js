import axios from 'axios';

/** Intenta leer el access token con varios nombres comunes */
function getAccessToken() {
  const direct =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token');

  if (direct) return direct;

  try {
    const parsed = JSON.parse(localStorage.getItem('authTokens') || '{}');
    return parsed.access || parsed.token || '';
  } catch {
    return '';
  }
}

/** Normaliza la URL para evitar api/api o quedarnos sin /api */
function normalizeBaseUrl(raw) {
  let u = (raw || '').trim();
  if (!u) return 'https://intishopback.onrender.com/api'; // fallback seguro
  u = u.replace(/\/+$/, ''); // quita barras al final

  // Si es absoluta, asegurá que termine en /api
  if (/^https?:\/\//i.test(u)) {
    if (!/\/api$/i.test(u)) u += '/api';
  }
  // Si alguien puso "/api" relativo, lo dejamos tal cual.
  return u;
}

const baseURL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || 'https://intishopback.onrender.com'
);

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

/** Interceptor: agrega Authorization si hay token */
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
