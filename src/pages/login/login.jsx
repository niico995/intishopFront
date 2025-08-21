// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../services/api";

// function decodeJWT(rawToken) {
//   try {
//     if (!rawToken) return null;
//     let token = String(rawToken).trim().replace(/^Bearer\s+/i, "");
//     token = token.replace(/^"|"$/g, "");
//     const [, payloadPart] = token.split(".");
//     if (!payloadPart) return null;
//     const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
//     return JSON.parse(atob(padded));
//   } catch {
//     return null;
//   }
// }

// export default function Login() {
//   const nav = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setLoading(true);
//     try {
//       // 1) Pedir tokens (si usás SimpleJWT sería /token/)
//       const res = await api.post("/token/", { email, password });
//       const access = res.data?.access;
//       const refresh = res.data?.refresh;
//       if (!access) throw new Error("Token no recibido");

//       await login(access);
//       if (refresh) localStorage.setItem("refresh", refresh);

//       api.defaults.headers.common.Authorization = `Bearer ${access}`;

//       // 2) Intentar traer rol
//       let role = "cliente";
//       try {
//         const me = await api.get("/users/me/");
//         role = me.data?.role || role;
//       } catch {
//         const payload = decodeJWT(access) || {};
//         if (payload.is_staff || payload.is_superuser || payload.role === "admin") {
//           role = "admin";
//         }
//       }

//       // 3) Redirecciones
//       if (role === "admin") return nav("/admin", { replace: true });

//       if (role === "socio" || role === "vendedor") {
//         try {
//           await api.get("/sellers/mi-perfil/");
//           return nav("/socio/dashboard", { replace: true });
//         } catch (e2) {
//           if (e2.response?.status === 404) return nav("/socio/crear-perfil", { replace: true });
//           return nav("/login", { replace: true });
//         }
//       }

//       return nav("/dashboard-cliente", { replace: true });
//     } catch (e2) {
//       console.error(e2);
//       setErr("Email o contraseña inválidos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
//           <div className="mb-6 text-center">
//             <Link to="/" className="inline-block">
//               <div className="text-3xl font-extrabold tracking-tight">
//                 Santiago<span className="text-slate-900">Shop</span>
//               </div>
//             </Link>
//             <p className="text-sm text-gray-500 mt-1">Ingresá a tu cuenta para continuar</p>
//           </div>

//           {err && (
//             <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {err}
//             </div>
//           )}

//           <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm mb-1" htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
//                 placeholder="tu@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="block text-sm mb-1" htmlFor="password">Contraseña</label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPwd ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   className="w-full border rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-slate-300"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPwd((v) => !v)}
//                   className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700"
//                   aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
//                   tabIndex={-1}
//                 >
//                   {showPwd ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="inline-flex items-center gap-2">
//                 <input type="checkbox" className="rounded" disabled={loading} />
//                 Recordarme
//               </label>
//               <Link to="/recuperar" className="text-slate-700 hover:underline">
//                 ¿Olvidaste tu contraseña?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg py-2.5 hover:opacity-95 disabled:opacity-60"
//             >
//               {loading && (
//                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"></path>
//                 </svg>
//               )}
//               {loading ? "Ingresando..." : "Ingresar"}
//             </button>
//           </form>

//           <div className="my-6 h-px bg-gray-100" />

//           <p className="text-center text-sm text-gray-600">
//             ¿No tenés cuenta?{" "}
//             <Link to="/registro/cliente" className="text-slate-900 font-medium hover:underline">
//               Crear cuenta
//             </Link>
//           </p>
//         </div>

//         <p className="mt-4 text-center text-xs text-gray-500">
//           Acceso para socios:{" "}
//           <Link to="/registro/socio" className="hover:underline">Registrarse como socio</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
// src/pages/login/login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, RefreshCw, Store, UserCog } from "lucide-react";
import api from "../../services/api";

// ==== helpers ====
const decodeJWT = (raw) => {
  try {
    if (!raw) return null;
    const [, payload] = String(raw).split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export default function Login() {
  const nav = useNavigate();

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
      // SimpleJWT: POST /api/token/ -> { access, refresh }
      const res = await api.post("/token/", { email, password });
      const access = res.data?.access;
      const refresh = res.data?.refresh;
      if (!access) throw new Error("Token no recibido");

      localStorage.setItem("token", access);
      if (refresh) localStorage.setItem("refresh", refresh);
      api.defaults.headers.common.Authorization = `Bearer ${access}`;

      // rol desde /users/me/ o desde JWT como fallback
      let role = "cliente";
      try {
        const me = await api.get("/users/me/");
        role = me.data?.role || role;
      } catch {
        const payload = decodeJWT(access) || {};
        if (payload.is_staff || payload.is_superuser || payload.role === "admin") role = "admin";
      }

      if (role === "admin") return nav("/admin", { replace: true });

      if (role === "socio" || role === "vendedor") {
        try {
          await api.get("/sellers/mi-perfil/"); // 200 = tiene perfil
          return nav("/socio/dashboard", { replace: true });
        } catch (e2) {
          if (e2?.response?.status === 404) return nav("/socio/crear-perfil", { replace: true });
          return nav("/login", { replace: true });
        }
      }

      return nav("/dashboard-cliente", { replace: true });
    } catch (e2) {
      console.error(e2);
      setErr("Email o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
      {/* glows decorativos */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

      <div className="mx-auto max-w-md px-4 py-16 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
            <Store className="h-5 w-5 text-slate-900" />
            <span className="text-sm font-semibold text-slate-900">SantiagoShop</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-700">
            Iniciá sesión
          </h1>
          <p className="mt-2 text-sm text-slate-600">Accedé a tu panel de cliente, socio o admin.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-lg"
        >
          {/* Mensajes */}
          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 pr-10 outline-none ring-indigo-200/60 focus:ring-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
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
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-2.5 hover:opacity-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Ingresando…
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" /> Ingresar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-100" />

          <div className="text-center text-sm text-gray-600">
            ¿No tenés cuenta?
            <div className="mt-2 flex items-center justify-center gap-3">
              <Link to="/registro/cliente" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-slate-50">
                <ShieldCheck className="h-4 w-4" /> Registrar cliente
              </Link>
              <Link to="/registro/socio" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-slate-50">
                <UserCog className="h-4 w-4" /> Registrar socio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
