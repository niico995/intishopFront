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
// import { useState } from "react";
// import { useNavigate,useLocation, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, RefreshCw, Store, UserCog } from "lucide-react";
// import api from "../../services/api";
// import axiosInstance from "../../api/axiosConfig";
// // ==== helpers ====
// function decodeJwt(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     // atob + decodeURIComponent para caracteres unicode
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch {
//     return {};
//   }
// }

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const from = location.state?.from || "/";

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setLoading(true);

//     try {
//       const { data } = await axiosInstance.post("login/", {
//         email: form.email.trim().toLowerCase(),
//         password: form.password,
//       });

//       const { access, refresh } = data || {};
//       if (!access) {
//         throw new Error("No se recibió el token de acceso.");
//       }

//       // Guardar tokens (compat con el resto del código)
//       localStorage.setItem("token", access);
//       localStorage.setItem("access", access);
//       if (refresh) localStorage.setItem("refresh", refresh);

//       // Decodificar claims para rutear
//       const payload = decodeJwt(access);
//       const role = payload.role || "cliente";
//       const isAdmin = !!payload.is_admin || !!payload.is_staff || !!payload.is_superuser;
//       const hasSellerProfile = !!payload.has_seller_profile;

//       // 🎯 Redirecciones
//       if (isAdmin || role === "admin") {
//         navigate("/admin", { replace: true });
//         return;
//       }

//       if (role === "socio" || role === "seller" || role === "vendedor") {
//         navigate(hasSellerProfile ? "/socio/productos" : "/socio/crear-perfil", { replace: true });
//         return;
//       }

//       // Cliente por defecto
//       navigate("/dashboard-cliente", { replace: true });
//     } catch (err) {
//       console.error("Error de login:", err);
//       const apiMsg =
//         err?.response?.data?.detail ||
//         err?.response?.data?.error ||
//         "Email o contraseña incorrectos.";
//       setErrorMsg(apiMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[70vh] flex items-center justify-center p-4">
//       <form
//         onSubmit={onSubmit}
//         className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-4"
//       >
//         <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

//         {errorMsg && (
//           <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
//             {errorMsg}
//           </div>
//         )}

//         <div className="space-y-1">
//           <label htmlFor="email" className="text-sm font-medium">
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             autoComplete="email"
//             className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-black/10"
//             placeholder="tu@email.com"
//             value={form.email}
//             onChange={onChange}
//             required
//           />
//         </div>

//         <div className="space-y-1">
//           <label htmlFor="password" className="text-sm font-medium">
//             Contraseña
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             autoComplete="current-password"
//             className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-black/10"
//             placeholder="••••••••"
//             value={form.password}
//             onChange={onChange}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-xl py-2 font-semibold border hover:bg-black hover:text-white transition disabled:opacity-60"
//         >
//           {loading ? "Ingresando..." : "Ingresar"}
//         </button>

//         <div className="text-center text-sm">
//           <Link to="/registro/cliente" className="underline">
//             Crear cuenta
//           </Link>
//           <span className="mx-2">·</span>
//           <Link to="/recuperar-password" className="underline">
//             ¿Olvidaste tu contraseña?
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }
// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../../api/axiosConfig";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1) Login
      const { data } = await axios.post("users/login/", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      const { access, refresh } = data || {};
      if (!access) throw new Error("No se recibió el token de acceso.");

      localStorage.setItem("access", access);
      localStorage.setItem("token", access);
      if (refresh) localStorage.setItem("refresh", refresh);

      // 2) Un solo request decide el destino
      const me = await axios.get("users/me/");
      const role = me?.data?.role;
      const hasSeller = !!me?.data?.seller_profile_exists;

      if (role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      if (role === "socio" || role === "seller") {
        navigate(hasSeller ? "/socio/productos" : "/socio/crear-perfil", { replace: true });
        return;
      }

      // cliente u otro rol
      navigate("/tienda", { replace: true }); // ajustá si tu home de cliente es otro
    } catch (err) {
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
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-4">
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

        <button type="submit" disabled={loading} className="w-full rounded-xl py-2 font-semibold border hover:bg-black hover:text-white transition disabled:opacity-60">
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
