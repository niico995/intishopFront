import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, RefreshCw, Store, UserCog } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";

// ==== helpers ====
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from || "/";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Endpoint correcto: /api/users/login/
      const { data } = await axiosInstance.post("/users/login/", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      const { access, refresh, token } = data || {};
      const accessToken = access || token;
      if (!accessToken) throw new Error("No se recibió el token de acceso.");

      // Guardar tokens con claves compatibles
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("access", accessToken);
      if (refresh) localStorage.setItem("refresh", refresh);
      localStorage.setItem("authTokens", JSON.stringify({ access: accessToken, refresh: refresh || "" }));

      // Intentá obtener datos de usuario para decidir destino
      let role, isAdmin, hasSellerProfile;
      try {
        const me = await axiosInstance.get("/users/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const u = me?.data || {};
        role = u.role || u.tipo || (u.is_staff ? "admin" : "cliente");
        isAdmin = !!(u.is_staff || u.is_superuser || u.is_admin);
        hasSellerProfile = !!u.has_seller_profile;
      } catch {
        const payload = decodeJwt(accessToken);
        role = payload.role || "cliente";
        isAdmin = !!(payload.is_admin || payload.is_staff || payload.is_superuser);
        hasSellerProfile = !!payload.has_seller_profile;
      }

      // 🎯 Redirecciones
      if (isAdmin || role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
      if (role === "socio" || role === "seller" || role === "vendedor") {
        navigate(hasSellerProfile ? "/socio/productos" : "/socio/crear-perfil", { replace: true });
        return;
      }
      navigate("/dashboard-cliente", { replace: true });
    } catch (err) {
      console.error("Error de login:", err);
      const apiMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Email o contraseña incorrectos.";
      setErrorMsg(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-black/10"
            placeholder="tu@email.com"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-black/10"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-2 font-semibold border hover:bg-black hover:text-white transition disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <div className="text-center text-sm">
          <Link to="/registro/cliente" className="underline">Crear cuenta</Link>
          <span className="mx-2">·</span>
          <Link to="/recuperar-password" className="underline">¿Olvidaste tu contraseña?</Link>
        </div>
      </form>
    </div>
  );
}
