// src/pages/login/login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function decodeJWT(rawToken) {
  try {
    if (!rawToken) return null;
    let token = String(rawToken).trim().replace(/^Bearer\s+/i, "");
    token = token.replace(/^"|"$/g, "");
    const [, payloadPart] = token.split(".");
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // 1) Login
      const res = await api.post("login/", { email, password });
      const token = res.data?.access;
      if (!token) throw new Error("Token no recibido");

      // 2) Guardar token (tu AuthContext lo persiste en localStorage)
      await login(token);

      // Asegurar que el próximo request lleve el header ya mismo
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // 3) Roles desde el JWT (si vienen)
      const payload = decodeJWT(token) || {};
      const isAdmin = !!(payload.is_staff || payload.is_superuser || payload.role === "admin");

      // 4) Detectar si es socio consultando el backend
      let isSeller = false;
      try {
        await api.get("sellers/mi-perfil/"); // 200 si tiene seller_profile
        isSeller = true;
      } catch {
        isSeller = false; // 404/403/etc → no es socio
      }

      // 5) Redirects
      if (isAdmin) nav("/admin");                // tu /admin index ya muestra ResumenPagos
      else if (isSeller) nav("/socio/productos"); // o "/socio/perfil" si preferís
      else nav("/dashboard-cliente");
    } catch (e2) {
      console.error(e2);
      setErr("Email o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
          {/* Brand */}
          <div className="mb-6 text-center">
            <Link to="/" className="inline-block">
              <div className="text-3xl font-extrabold tracking-tight">Santiago<span className="text-slate-900">Shop</span></div>
            </Link>
            <p className="text-sm text-gray-500 mt-1">Ingresá a tu cuenta para continuar</p>
          </div>

          {/* Error */}
          {err && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="password">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full border rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="rounded" disabled={loading} />
                Recordarme
              </label>
              <Link to="/recuperar" className="text-slate-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg py-2.5 hover:opacity-95 disabled:opacity-60"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"></path>
                </svg>
              )}
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-100" />

          <p className="text-center text-sm text-gray-600">
            ¿No tenés cuenta?{" "}
            <Link to="/registro/cliente" className="text-slate-900 font-medium hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>

        {/* Footer mini */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Acceso para socios:{" "}
          <Link to="/registro/socio" className="hover:underline">Registrarse como socio</Link>
        </p>
      </div>
    </div>
  );
}
