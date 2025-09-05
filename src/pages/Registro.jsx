// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const API = import.meta.env.VITE_API_URL || 'https://intishopback.onrender.com/api/';

// const Registro = () => {
//   const { pathname, search } = useLocation();
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//     token: '',
//     codigo: '',
//   });

//   const [fase, setFase] = useState('verificacion'); // 'verificacion' | 'registro'
//   const [mensaje, setMensaje] = useState('');
//   const [error, setError] = useState('');
//   const [reintentarEn, setReintentarEn] = useState(0);
//   const [esperaActiva, setEsperaActiva] = useState(false);

//   const role = (() => {
//     if (pathname.includes('cliente')) return 'cliente';
//     if (pathname.includes('socio')) return 'socio';
//     if (pathname.includes('admin')) return 'admin';
//     return null;
//   })();

//   // Prefill del token por querystring si /registro/admin?token=...
//   useEffect(() => {
//     if (role === 'admin') {
//       const urlParams = new URLSearchParams(search);
//       const t = urlParams.get('token');
//       if (t) setForm((f) => ({ ...f, token: t }));
//     }
//   }, [role, search]);

//   // Countdown para reenviar código
//   useEffect(() => {
//     let intervalo;
//     if (reintentarEn > 0) {
//       intervalo = setInterval(() => setReintentarEn((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(intervalo);
//   }, [reintentarEn]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const enviarCodigo = async () => {
//     setMensaje('');
//     setError('');
//     if (!form.email) return setError('Email requerido');

//     if (role === 'admin' && !form.token) {
//       return setError('Token de Admin requerido');
//     }

//     setEsperaActiva(true);
//     setReintentarEn(60);
//     try {
//       const url = `${API}users/register/${role}/`;
//       const payload = { email: form.email };
//       if (role === 'admin') payload.token = form.token;

//       await axios.post(url, payload);
//       setMensaje('Código enviado al email');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Error al enviar el código');
//       setEsperaActiva(false);
//       setReintentarEn(0);
//     }
//   };

//   const verificarYRegistrar = async (e) => {
//     e.preventDefault();
//     setMensaje('');
//     setError('');

//     if (!form.email || !form.password || !form.codigo) {
//       return setError('Completá email, contraseña y código');
//     }

//     try {
//       // 1) Verificar y registrar
//       const verifyUrl = `${API}users/verificar-registro/`;
//       const payload = {
//         email: form.email,
//         password: form.password,
//         code: form.codigo,
//         role: role,
//       };
//       const res = await axios.post(verifyUrl, payload);
//       setMensaje(res.data.message || 'Usuario registrado correctamente');

//       // 2) Login automático
//       const loginUrl = `${API}login/`;
//       const loginRes = await axios.post(loginUrl, {
//         email: form.email,
//         password: form.password,
//       });

//       // Guardar token en contexto
//       const access = loginRes?.data?.access;
//       if (!access) throw new Error('No se recibió el token');
//       login(access);

//       // 3) Redirigir según el JWT real
//       let rol = null;
//       let isStaff = false;
//       try {
//         const payloadJwt = JSON.parse(atob(access.split('.')[1]));
//         rol = payloadJwt?.role || null;
//         isStaff = !!payloadJwt?.is_staff;
//       } catch {
//         // si falla el decode, seguimos con fallback por ruta
//       }

//       if (rol === 'admin' || isStaff) navigate('/admin');
//       else if (rol === 'socio') navigate('/socio/productos');
//       else navigate('/dashboard-cliente');
//     } catch (err) {
//       setError(
//         err.response?.data?.error ||
//           err.response?.data?.detail ||
//           err.message ||
//           'Error al verificar y registrar'
//       );
//     }
//   };

//   if (!role) return <p className="text-center text-red-600 mt-10">Ruta inválida</p>;

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded p-6">
//       <h2 className="text-xl font-bold mb-4 text-center">Registro {role.toUpperCase()}</h2>

//       {fase === 'verificacion' && (
//         <>
//           <input
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             type="email"
//             className="w-full border rounded p-2 mb-4"
//             required
//           />

//           {role === 'admin' && (
//             <input
//               name="token"
//               placeholder="Token de Admin"
//               value={form.token}
//               onChange={handleChange}
//               className="w-full border rounded p-2 mb-4"
//             />
//           )}

//           <button
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//             onClick={enviarCodigo}
//             disabled={esperaActiva}
//           >
//             {esperaActiva ? `Reenviar en ${reintentarEn}s` : 'Enviar código al email'}
//           </button>

//           <button
//             onClick={() => setFase('registro')}
//             className="w-full mt-3 text-sm text-blue-500 hover:underline"
//           >
//             Ya tengo el código
//           </button>
//         </>
//       )}

//       {fase === 'registro' && (
//         <form onSubmit={verificarYRegistrar}>
//           <input
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             type="email"
//             className="w-full border rounded p-2 mb-3"
//             required
//           />
//           <input
//             name="password"
//             placeholder="Contraseña"
//             value={form.password}
//             onChange={handleChange}
//             type="password"
//             className="w-full border rounded p-2 mb-3"
//             required
//           />
//           <input
//             name="codigo"
//             placeholder="Código recibido por email"
//             value={form.codigo}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mb-3"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//           >
//             Registrar y entrar
//           </button>
//         </form>
//       )}

//       {mensaje && <p className="text-green-600 text-sm mt-4">{mensaje}</p>}
//       {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
//     </div>
//   );
// };

// export default Registro;
// src/pages/registro/Registro.jsx
// src/pages/Registro.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Mail, Lock, KeyRound, ShieldCheck, RefreshCw, ArrowRight, UserPlus,
//   CheckCircle2, // 👈 faltaba este
// } from "lucide-react";

// // 👇 clientes HTTP
// import apiAuth from "../api/axiosConfig";   // con Authorization (interceptor)
// import axiosPublic from "../api/axiosPublic"; // sin Authorization

// // ===== Helpers =====
// const decodeJWT = (raw) => {
//   try {
//     if (!raw) return null;
//     const [, payload] = String(raw).split(".");
//     if (!payload) return null;
//     const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
//     const json = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// };
// const niceRole = (r) => (r ? r.charAt(0).toUpperCase() + r.slice(1) : "");

// export default function Registro() {
//   const { pathname, search } = useLocation();
//   const navigate = useNavigate();

//   const role = useMemo(() => {
//     if (pathname.includes("cliente")) return "cliente";
//     if (pathname.includes("socio")) return "socio";
//     if (pathname.includes("admin")) return "admin";
//     return null;
//   }, [pathname]);

//   const [fase, setFase] = useState("verificacion"); // 'verificacion' | 'registro'
//   const [form, setForm] = useState({ email: "", password: "", token: "", codigo: "" });
//   const [mensaje, setMensaje] = useState("");
//   const [error, setError] = useState("");
//   const [sending, setSending] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [reintentarEn, setReintentarEn] = useState(0);
//   const [showPwd, setShowPwd] = useState(false);

//   // Prefill token admin por querystring ?token=...
//   useEffect(() => {
//     if (role === "admin") {
//       const urlParams = new URLSearchParams(search);
//       const t = urlParams.get("token");
//       if (t) setForm((f) => ({ ...f, token: t }));
//     }
//   }, [role, search]);

//   // Countdown
//   useEffect(() => {
//     if (!reintentarEn) return;
//     const id = setInterval(() => setReintentarEn((s) => Math.max(0, s - 1)), 1000);
//     return () => clearInterval(id);
//   }, [reintentarEn]);

//   const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

//   const enviarCodigo = async () => {
//     setMensaje(""); setError("");
//     if (!role) return setError("Ruta inválida");
//     if (!form.email || !validarEmail(form.email)) return setError("Ingresá un email válido");
//     if (role === "admin" && !form.token) return setError("Ingresá el token de Admin");

//     setSending(true);
//     setReintentarEn(60);
//     try {
//       const url = `/users/register/${role}/`;
//       const payload = role === "admin" ? { email: form.email, token: form.token } : { email: form.email };
//       // 👇 público (sin Authorization) para evitar 401 por token viejo
//       await axiosPublic.post(url, payload);
//       setMensaje("Código enviado a tu email ✉️");
//     } catch (e) {
//       setReintentarEn(0);
//       setMensaje("");
//       setError(e.response?.data?.error || e.response?.data?.detail || "No se pudo enviar el código");
//     } finally {
//       setSending(false);
//     }
//   };

//   const verificarYRegistrar = async (e) => {
//     e.preventDefault();
//     setMensaje(""); setError("");

//     if (!role) return setError("Ruta inválida");
//     if (!form.email || !validarEmail(form.email)) return setError("Ingresá un email válido");
//     if (!form.password || form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
//     if (!form.codigo) return setError("Ingresá el código recibido por email");

//     setSubmitting(true);
//     try {
//       // 1) Verificar y registrar (público)
//       await axiosPublic.post(`/users/verificar-registro/`, {
//         email: form.email, password: form.password, code: form.codigo, role
//       });

//       // 2) Login automático (público)
//       const loginRes = await axiosPublic.post(`/login/`, { email: form.email, password: form.password });
//       const access = loginRes.data?.access || loginRes.data?.token;
//       const refresh = loginRes.data?.refresh;
//       if (!access) throw new Error("No se recibió el token de acceso");

//       // Guardar tokens y setear Authorization en el cliente con auth
//       localStorage.setItem("token", access);
//       if (refresh) localStorage.setItem("refresh", refresh);
//       apiAuth.defaults.headers.common.Authorization = `Bearer ${access}`;

//       // 3) Detectar rol real (intenta /users/me/; si falla usa JWT)
//       let userRole = role;
//       try {
//         const me = await apiAuth.get(`/users/me/`);
//         userRole = me.data?.role || userRole;
//       } catch {
//         const payloadJwt = decodeJWT(access) || {};
//         if (payloadJwt.is_staff || payloadJwt.is_superuser || payloadJwt.role === "admin") userRole = "admin";
//       }

//       // 4) Redirecciones
//       if (userRole === "admin") return navigate("/admin", { replace: true });

//       if (userRole === "socio" || userRole === "vendedor") {
//         try {
//           await apiAuth.get(`/sellers/mi-perfil/`); // 200 → tiene perfil
//           return navigate("/socio/dashboard", { replace: true });
//         } catch (e2) {
//           if (e2.response?.status === 404) return navigate("/socio/crear-perfil", { replace: true });
//           return navigate("/login", { replace: true });
//         }
//       }

//       return navigate("/dashboard-cliente", { replace: true });
//     } catch (e) {
//       setError(e.response?.data?.error || e.response?.data?.detail || e.message || "Error al registrar");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!role) {
//     return (
//       <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-50 to-white">
//         <div className="text-center">
//           <p className="text-red-600 font-medium">Ruta inválida</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
//       {/* Glows */}
//       <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

//       <div className="mx-auto max-w-md px-4 py-16 relative">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35 }}
//           className="text-center mb-8"
//         >
//           <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
//             <UserPlus className="h-5 w-5 text-slate-900" />
//             <span className="text-sm font-semibold text-slate-900">Registro {niceRole(role)}</span>
//           </div>
//           <h1 className="mt-4 text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-700">
//             Creá tu cuenta en segundos
//           </h1>
//           <p className="mt-2 text-sm text-slate-600">Te enviamos un código a tu correo para continuar.</p>
//         </motion.div>

//         {/* Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.05 }}
//           className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-lg"
//         >
//           {/* Tabs simple */}
//           <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm">
//             <button
//               onClick={() => setFase("verificacion")}
//               className={`py-2 rounded-lg transition ${fase === "verificacion" ? "bg-white shadow font-semibold" : "text-slate-600"}`}
//             >
//               Verificación
//             </button>
//             <button
//               onClick={() => setFase("registro")}
//               className={`py-2 rounded-lg transition ${fase === "registro" ? "bg-white shadow font-semibold" : "text-slate-600"}`}
//             >
//               Registro
//             </button>
//           </div>

//           {/* mensajes */}
//           {mensaje && (
//             <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
//               {mensaje}
//             </div>
//           )}
//           {error && (
//             <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           {/* Fase: Verificación */}
//           {fase === "verificacion" && (
//             <div className="space-y-3">
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//                 <input
//                   name="email"
//                   type="email"
//                   placeholder="Email"
//                   value={form.email}
//                   onChange={onChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
//                   required
//                 />
//               </div>

//               {role === "admin" && (
//                 <div className="relative">
//                   <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//                   <input
//                     name="token"
//                     placeholder="Token de Admin"
//                     value={form.token}
//                     onChange={onChange}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
//                   />
//                 </div>
//               )}

//               <div className="flex gap-2">
//                 <button
//                   onClick={enviarCodigo}
//                   disabled={sending || reintentarEn > 0}
//                   className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow hover:opacity-95 disabled:opacity-60"
//                 >
//                   {sending ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" /> Enviando
//                     </>
//                   ) : reintentarEn > 0 ? (
//                     <>Reenviar en {reintentarEn}s</>
//                   ) : (
//                     <>
//                       <ArrowRight className="h-4 w-4" /> Enviar código
//                     </>
//                   )}
//                 </button>

//                 <button
//                   onClick={() => setFase("registro")}
//                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
//                 >
//                   Ya lo tengo
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Fase: Registro */}
//           {fase === "registro" && (
//             <form onSubmit={verificarYRegistrar} className="space-y-3">
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//                 <input
//                   name="email"
//                   type="email"
//                   placeholder="Email"
//                   value={form.email}
//                   onChange={onChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
//                   required
//                 />
//               </div>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//                 <input
//                   name="password"
//                   type={showPwd ? "text" : "password"}
//                   placeholder="Contraseña (min 6)"
//                   value={form.password}
//                   onChange={onChange}
//                   minLength={6}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 pr-10 outline-none ring-indigo-200/60 focus:ring-2"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPwd((v) => !v)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
//                   tabIndex={-1}
//                 >
//                   {showPwd ? "Ocultar" : "Mostrar"}
//                 </button>
//               </div>

//               <div className="relative">
//                 <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//                 <input
//                   name="codigo"
//                   placeholder="Código recibido por email"
//                   value={form.codigo}
//                   onChange={onChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
//                   required
//                 />
//               </div>

//               <div className="flex items-center gap-2 pt-1">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-white shadow hover:bg-emerald-700 disabled:opacity-60"
//                 >
//                   {submitting ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" /> Registrando…
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="h-4 w-4" /> Registrar y entrar
//                     </>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setFase("verificacion")}
//                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
//                   disabled={submitting}
//                 >
//                   Volver
//                 </button>
//               </div>
//             </form>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail, Lock, KeyRound, ShieldCheck, RefreshCw, ArrowRight, UserPlus,
  CheckCircle2, // 👈 faltaba este
} from "lucide-react";

// 👇 clientes HTTP
import apiAuth from "../api/axiosConfig";   // con Authorization (interceptor)
import axiosPublic from "../api/axiosPublic"; // sin Authorization

// ===== Helpers =====
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
const niceRole = (r) => (r ? r.charAt(0).toUpperCase() + r.slice(1) : "");

export default function Registro() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const role = useMemo(() => {
    if (pathname.includes("cliente")) return "cliente";
    if (pathname.includes("socio")) return "socio";
    if (pathname.includes("admin")) return "admin";
    return null;
  }, [pathname]);

  const [fase, setFase] = useState("verificacion"); // 'verificacion' | 'registro'
  const [form, setForm] = useState({ email: "", password: "", token: "", codigo: "" });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reintentarEn, setReintentarEn] = useState(0);
  const [showPwd, setShowPwd] = useState(false);

  // Prefill token admin por querystring ?token=...
  useEffect(() => {
    if (role === "admin") {
      const urlParams = new URLSearchParams(search);
      const t = urlParams.get("token");
      if (t) setForm((f) => ({ ...f, token: t }));
    }
  }, [role, search]);

  // Countdown
  useEffect(() => {
    if (!reintentarEn) return;
    const id = setInterval(() => setReintentarEn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [reintentarEn]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const enviarCodigo = async () => {
    setMensaje(""); setError("");
    if (!role) return setError("Ruta inválida");
    if (!form.email || !validarEmail(form.email)) return setError("Ingresá un email válido");
    if (role === "admin" && !form.token) return setError("Ingresá el token de Admin");

    setSending(true);
    setReintentarEn(60);
    try {
      const url = `/users/register/${role}/`;
      const payload = role === "admin" ? { email: form.email, token: form.token } : { email: form.email };
      // 👇 público (sin Authorization) para evitar 401 por token viejo
      await axiosPublic.post(url, payload);
      setMensaje("Código enviado a tu email ✉️");
    } catch (e) {
      setReintentarEn(0);
      setMensaje("");
      setError(e.response?.data?.error || e.response?.data?.detail || "No se pudo enviar el código");
    } finally {
      setSending(false);
    }
  };

  const verificarYRegistrar = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");

    if (!role) return setError("Ruta inválida");
    if (!form.email || !validarEmail(form.email)) return setError("Ingresá un email válido");
    if (!form.password || form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
    if (!form.codigo) return setError("Ingresá el código recibido por email");

    setSubmitting(true);
    try {
      // 1) Verificar y registrar (público)
      await axiosPublic.post(`/users/verificar-registro/`, {
        email: form.email, password: form.password, code: form.codigo, role
      });

      // 2) Login automático (público)
      const loginRes = await axiosPublic.post(`/login/`, { email: form.email, password: form.password });
      const access = loginRes.data?.access || loginRes.data?.token;
      const refresh = loginRes.data?.refresh;
      if (!access) throw new Error("No se recibió el token de acceso");

      // Guardar tokens y setear Authorization en el cliente con auth
      localStorage.setItem("token", access);
      if (refresh) localStorage.setItem("refresh", refresh);
      apiAuth.defaults.headers.common.Authorization = `Bearer ${access}`;

      // 3) Detectar rol real (intenta /users/me/; si falla usa JWT)
      let userRole = role;
      try {
        const me = await apiAuth.get(`/users/me/`);
        userRole = me.data?.role || userRole;
      } catch {
        const payloadJwt = decodeJWT(access) || {};
        if (payloadJwt.is_staff || payloadJwt.is_superuser || payloadJwt.role === "admin") userRole = "admin";
      }

      // 4) Redirecciones
      if (userRole === "admin") return navigate("/admin", { replace: true });

      if (userRole === "socio" || userRole === "vendedor") {
        try {
          await apiAuth.get(`/sellers/mi-perfil/`); // 200 → tiene perfil
          return navigate("/socio/dashboard", { replace: true });
        } catch (e2) {
          if (e2.response?.status === 404) return navigate("/socio/crear-perfil", { replace: true });
          return navigate("/login", { replace: true });
        }
      }

      return navigate("/dashboard-cliente", { replace: true });
    } catch (e) {
      setError(e.response?.data?.error || e.response?.data?.detail || e.message || "Error al registrar");
    } finally {
      setSubmitting(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <p className="text-red-600 font-medium">Ruta inválida</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
      {/* Glows */}
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
            <UserPlus className="h-5 w-5 text-slate-900" />
            <span className="text-sm font-semibold text-slate-900">Registro {niceRole(role)}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-700">
            Creá tu cuenta en segundos
          </h1>
          <p className="mt-2 text-sm text-slate-600">Te enviamos un código a tu correo para continuar.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-lg"
        >
          {/* Tabs simple */}
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm">
            <button
              onClick={() => setFase("verificacion")}
              className={`py-2 rounded-lg transition ${fase === "verificacion" ? "bg-white shadow font-semibold" : "text-slate-600"}`}
            >
              Verificación
            </button>
            <button
              onClick={() => setFase("registro")}
              className={`py-2 rounded-lg transition ${fase === "registro" ? "bg-white shadow font-semibold" : "text-slate-600"}`}
            >
              Registro
            </button>
          </div>

          {/* mensajes */}
          {mensaje && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {mensaje}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Fase: Verificación */}
          {fase === "verificacion" && (
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
                  required
                />
              </div>

              {role === "admin" && (
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    name="token"
                    placeholder="Token de Admin"
                    value={form.token}
                    onChange={onChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={enviarCodigo}
                  disabled={sending || reintentarEn > 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow hover:opacity-95 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Enviando
                    </>
                  ) : reintentarEn > 0 ? (
                    <>Reenviar en {reintentarEn}s</>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" /> Enviar código
                    </>
                  )}
                </button>

                <button
                  onClick={() => setFase("registro")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
                >
                  Ya lo tengo
                </button>
              </div>
            </div>
          )}

          {/* Fase: Registro */}
          {fase === "registro" && (
            <form onSubmit={verificarYRegistrar} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Contraseña (min 6)"
                  value={form.password}
                  onChange={onChange}
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 pr-10 outline-none ring-indigo-200/60 focus:ring-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                  tabIndex={-1}
                >
                  {showPwd ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  name="codigo"
                  placeholder="Código recibido por email"
                  value={form.codigo}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 outline-none ring-indigo-200/60 focus:ring-2"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Registrando…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Registrar y entrar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFase("verificacion")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
                  disabled={submitting}
                >
                  Volver
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
