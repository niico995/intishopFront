// // src/components/Navbar.jsx
// import { useEffect, useState, useRef, useMemo } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axiosPublic from "../api/axiosPublic";     // público (sin Authorization)
// import axiosAuth from "../api/axiosConfig";       // con Authorization cuando exista
// import { useCart } from "./CartContext";

// const DEBOUNCE_MS = 400;
// const MIN_CHARS = 2;
// const SEARCH_ENDPOINT = "products/public/"; // 👈 endpoint público correcto
// const SEARCH_ORDER = "-id";                  // 👈 evita 'creado' que no existe

// /* Helpers */
// function decodeJWT(raw) {
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
// }

// function tokenIsValid() {
//   const tok = localStorage.getItem("token") || localStorage.getItem("access");
//   if (!tok) return false;
//   const payload = decodeJWT(tok);
//   if (!payload?.exp) return true;
//   const now = Math.floor(Date.now() / 1000);
//   return payload.exp > now;
// }

// function guessRoleFromToken() {
//   const tok = localStorage.getItem("token") || localStorage.getItem("access");
//   const p = decodeJWT(tok);
//   if (!p) return null;
//   if (p.is_superuser || p.is_staff || p.role === "admin") return "admin";
//   if (p.role === "socio" || p.role === "vendedor") return "socio";
//   if (p.role === "cliente") return "cliente";
//   return p.role || null;
// }

// export default function NavBar() {
//   const [cats, setCats] = useState([]);
//   const [q, setQ] = useState("");
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

//   // Dropdown de categorías por CLICK
//   const [catsOpen, setCatsOpen] = useState(false);
//   const catsBtnRef = useRef(null);
//   const catsMenuRef = useRef(null);

//   // Autocomplete
//   const [loadingSug, setLoadingSug] = useState(false);
//   const [prodSug, setProdSug] = useState([]);
//   const [storeSug, setStoreSug] = useState([]);
//   const [openSug, setOpenSug] = useState(false);
//   const [activeIdx, setActiveIdx] = useState(-1);

//   // Auth state
//   const [isLogged, setIsLogged] = useState(tokenIsValid());
//   const [role, setRole] = useState(isLogged ? guessRoleFromToken() : null);
//   const [roleLoading, setRoleLoading] = useState(false);

//   const searchRef = useRef(null);
//   const popRef = useRef(null);
//   const debounceRef = useRef(null);
//   const reqIdRef = useRef(0);
//   const cacheRef = useRef(new Map());

//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const { count } = useCart();

//   // Mantener auth state actualizado
//   useEffect(() => {
//     const sync = () => {
//       const valid = tokenIsValid();
//       setIsLogged(valid);
//       setRole(valid ? guessRoleFromToken() : null);
//     };
//     window.addEventListener("storage", sync);
//     window.addEventListener("focus", sync);
//     return () => {
//       window.removeEventListener("storage", sync);
//       window.removeEventListener("focus", sync);
//     };
//   }, []);

//   // Categorías (público)
//   useEffect(() => {
//     let mounted = true;
//     axiosPublic
//       .get("products/categorias/")
//       .then((r) => mounted && setCats(r.data || []))
//       .catch(() => setCats([]));
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Mantener query en input si venimos de /buscar
//   useEffect(() => {
//     const params = new URLSearchParams(search);
//     setQ(params.get("q") || "");
//   }, [search]);

//   const closeAllMobile = () => {
//     setMobileOpen(false);
//     setMobileSearchOpen(false);
//     setCatsOpen(false);
//   };

//   // Cerrar dropdown de categorías al click afuera / Escape
//   useEffect(() => {
//     function onDocDown(e) {
//       if (!catsOpen) return;
//       const t = e.target;
//       if (catsBtnRef.current?.contains(t)) return;
//       if (catsMenuRef.current?.contains(t)) return;
//       setCatsOpen(false);
//     }
//     function onEsc(e) {
//       if (e.key === "Escape") setCatsOpen(false);
//     }
//     document.addEventListener("mousedown", onDocDown);
//     document.addEventListener("keydown", onEsc);
//     return () => {
//       document.removeEventListener("mousedown", onDocDown);
//       document.removeEventListener("keydown", onEsc);
//     };
//   }, [catsOpen]);

//   // ---------- AUTOCOMPLETE ----------
//   const combined = useMemo(() => {
//     const prods = (prodSug || []).map((p) => ({
//       kind: "product",
//       id: p.id,
//       label: p.nombre,
//       subtitle: p.seller_nombre || "Producto",
//       to: `/producto/${p.id}`,
//       img: p.imagenes?.find((i) => i.is_primary)?.url || p.imagenes?.[0]?.url || null,
//     }));
//     const stores = (storeSug || []).map((s) => ({
//       kind: "store",
//       id: s.id,
//       label: s.nombre_fantasia || s.name || "Tienda",
//       subtitle: "Tienda",
//       to: `/vendedor/${s.id}`,
//       img: s.logo_url || null,
//     }));
//     return [...prods, ...stores];
//   }, [prodSug, storeSug]);

//   async function fetchSuggestions(query) {
//     const key = query.toLowerCase();

//     if (cacheRef.current.has(key)) {
//       const { prods, stores } = cacheRef.current.get(key);
//       setProdSug(prods);
//       setStoreSug(stores);
//       setOpenSug(true);
//       setActiveIdx(-1);
//       return;
//     }

//     const myId = ++reqIdRef.current;
//     setLoadingSug(true);
//     try {
//       // 👇 endpoint público correcto y order por -id
//       const pr = await axiosPublic
//         .get(
//           `${SEARCH_ENDPOINT}?search=${encodeURIComponent(query)}&ordering=${encodeURIComponent(
//             SEARCH_ORDER
//           )}&limit=12`
//         )
//         .catch(() => ({ data: [] }));

//       if (myId !== reqIdRef.current) return;

//       const list = Array.isArray(pr.data?.results) ? pr.data.results : pr.data || [];
//       const prods = list.slice(0, 5);

//       const storeMap = new Map();
//       for (const p of list) {
//         const id = p.seller_id ?? p.seller?.id;
//         const name = p.seller_nombre ?? p.seller?.nombre_fantasia ?? p.seller?.name;
//         if (id && name && !storeMap.has(id)) storeMap.set(id, { id, nombre_fantasia: name });
//         if (storeMap.size >= 5) break;
//       }
//       const stores = Array.from(storeMap.values());

//       if (cacheRef.current.size > 50) {
//         const firstKey = cacheRef.current.keys().next().value;
//         cacheRef.current.delete(firstKey);
//       }
//       cacheRef.current.set(key, { prods, stores });

//       setProdSug(prods);
//       setStoreSug(stores);
//       setOpenSug(true);
//       setActiveIdx(-1);
//     } finally {
//       if (myId === reqIdRef.current) setLoadingSug(false);
//     }
//   }

//   // Debounce input
//   useEffect(() => {
//     const query = q.trim();
//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     if (!query || query.length < MIN_CHARS) {
//       setOpenSug(false);
//       setProdSug([]);
//       setStoreSug([]);
//       setActiveIdx(-1);
//       return;
//     }
//     debounceRef.current = setTimeout(() => {
//       fetchSuggestions(query);
//     }, DEBOUNCE_MS);

//     return () => clearTimeout(debounceRef.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q]);

//   // Cerrar dropdown de sugerencias al click afuera
//   useEffect(() => {
//     function onClickOutside(e) {
//       if (!openSug) return;
//       const t = e.target;
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(t) &&
//         popRef.current &&
//         !popRef.current.contains(t)
//       ) {
//         setOpenSug(false);
//       }
//     }
//     window.addEventListener("mousedown", onClickOutside);
//     return () => window.removeEventListener("mousedown", onClickOutside);
//   }, [openSug]);

//   const navigateTo = (to) => {
//     setOpenSug(false);
//     closeAllMobile();
//     navigate(to);
//   };

//   const submitSearch = (e) => {
//     e?.preventDefault?.();
//     const query = q.trim();
//     if (!query) return;
//     navigateTo(`/buscar?q=${encodeURIComponent(query)}`);
//   };

//   // ⇢ Resolver ruta de perfil según rol (con verificación para socio)
//   const goToProfile = async () => {
//     if (!isLogged) {
//       return navigateTo("/login");
//     }

//     let r = role;
//     if (!r && !roleLoading) {
//       try {
//         setRoleLoading(true);
//         const me = await axiosAuth.get("users/me/");
//         r = me.data?.role || null;
//         setRole(r);
//       } catch {
//         r = guessRoleFromToken();
//         setRole(r);
//       } finally {
//         setRoleLoading(false);
//       }
//     }

//     if (r === "admin") {
//       return navigateTo("/admin");
//     }

//     if (r === "socio" || r === "vendedor") {
//       try {
//         await axiosAuth.get("sellers/mi-perfil/"); // 200 si existe
//         return navigateTo("/socio/dashboard");
//       } catch (e) {
//         if (e?.response?.status === 404) return navigateTo("/socio/crear-perfil");
//         return navigateTo("/socio/dashboard"); // fallback
//       }
//     }

//     // cliente u otros
//     return navigateTo("/dashboard-cliente");
//   };

//   const onKeyDown = (e) => {
//     if (!openSug && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
//       setOpenSug(true);
//       return;
//     }
//     if (!openSug || combined.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIdx((i) => (i + 1) % combined.length);
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIdx((i) => (i - 1 + combined.length) % combined.length);
//     } else if (e.key === "Enter") {
//       if (activeIdx >= 0 && combined[activeIdx]) {
//         e.preventDefault();
//         const item = combined[activeIdx];
//         navigateTo(item.to);
//       } else {
//         submitSearch(e);
//       }
//     } else if (e.key === "Escape") {
//       setOpenSug(false);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-white">
//       {/* Top bar */}
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
//         {/* Hamburger (mobile) */}
//         <button
//           aria-label="Abrir menú"
//           aria-expanded={mobileOpen}
//           onClick={() => setMobileOpen(true)}
//           className="lg:hidden px-2 py-1 rounded-md border hover:bg-gray-50"
//         >
//           ☰
//         </button>

//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-2xl font-bold"
//           onClick={() => {
//             setOpenSug(false);
//             closeAllMobile();
//           }}
//         >
//           IntiShop
//         </Link>

//         {/* Categorías (desktop) — por CLICK */}
//         <div className="relative hidden lg:block">
//           <button
//             ref={catsBtnRef}
//             className="px-3 py-2 rounded-md hover:bg-gray-100"
//             aria-haspopup="true"
//             aria-expanded={catsOpen}
//             onClick={() => setCatsOpen((v) => !v)}
//           >
//             Categorías
//           </button>

//           {catsOpen && (
//             <div
//               ref={catsMenuRef}
//               className="absolute left-0 top-full bg-white border rounded-md shadow-md z-30 max-h-[70vh] overflow-auto min-w-56"
//             >
//               {cats.map((c) => (
//                 <Link
//                   key={c.id}
//                   to={`/c/${encodeURIComponent(String(c.nombre || "").toLowerCase())}`}
//                   className="block px-4 py-2 hover:bg-gray-50"
//                   onClick={() => setCatsOpen(false)}
//                 >
//                   {c.nombre}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Search (desktop) */}
//         <div ref={searchRef} className="relative hidden lg:flex flex-1">
//           <form onSubmit={submitSearch} className="flex-1 flex">
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               onKeyDown={onKeyDown}
//               onFocus={() => q.trim().length >= MIN_CHARS && setOpenSug(true)}
//               placeholder="Buscar productos o tiendas…"
//               className="flex-1 border rounded-l-md px-3 py-2 outline-none focus:ring-2"
//               aria-label="Buscar"
//               aria-autocomplete="list"
//             />
//             <button className="px-4 py-2 border border-l-0 rounded-r-md hover:bg-gray-50">
//               Buscar
//             </button>
//           </form>

//           {/* Sugerencias (desktop) */}
//           {openSug && (
//             <div
//               ref={popRef}
//               className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-30 max-h-[70vh] overflow-auto"
//               role="listbox"
//             >
//               <SugContent
//                 loading={loadingSug}
//                 prodSug={prodSug}
//                 storeSug={storeSug}
//                 activeIdx={activeIdx}
//                 setActiveIdx={setActiveIdx}
//                 onPick={(to) => navigateTo(to)}
//                 onSeeAll={() => submitSearch()}
//               />
//             </div>
//           )}
//         </div>

//         {/* Mobile search toggle */}
//         <button
//           aria-label="Buscar"
//           className="lg:hidden ml-auto px-2 py-1 rounded-md border hover:bg-gray-50"
//           onClick={() => setMobileSearchOpen((v) => !v)}
//         >
//           🔎
//         </button>

//         {/* Acciones (desktop) */}
//         <div className="hidden lg:flex items-center gap-2">
//           <Link to="/quiero-ser-socio" className="px-3 py-2 rounded-md border hover:bg-gray-50">
//             Quiero ser socio
//           </Link>

//           {isLogged ? (
//             <button
//               onClick={goToProfile}
//               className="px-3 py-2 rounded-md hover:bg-gray-50"
//               disabled={roleLoading}
//             >
//               {roleLoading ? "Cargando…" : "Mi perfil"}
//             </button>
//           ) : (
//             <Link to="/login" className="px-3 py-2 rounded-md hover:bg-gray-50">
//               Login
//             </Link>
//           )}

//           <Link to="/carrito" className="relative px-3 py-2 rounded-md hover:bg-gray-50">
//             🛒
//             {count > 0 && (
//               <span className="absolute -top-1 -right-1 text-xs bg-black text-white rounded-full px-1.5">
//                 {count}
//               </span>
//             )}
//           </Link>
//         </div>
//       </div>

//       {/* Mobile search + suggestions */}
//       {mobileSearchOpen && (
//         <div className="lg:hidden border-t bg-white">
//           <div ref={searchRef} className="max-w-6xl mx-auto px-4 py-3">
//             <form onSubmit={submitSearch} className="flex gap-2">
//               <input
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 onKeyDown={onKeyDown}
//                 onFocus={() => q.trim().length >= MIN_CHARS && setOpenSug(true)}
//                 placeholder="Buscar productos o tiendas…"
//                 className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2"
//                 aria-label="Buscar en móvil"
//               />
//               <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Buscar</button>
//             </form>

//             {openSug && (
//               <div
//                 ref={popRef}
//                 className="mt-2 bg-white border rounded-md shadow-lg z-30 max-h-[60vh] overflow-auto"
//                 role="listbox"
//               >
//                 <SugContent
//                   loading={loadingSug}
//                   prodSug={prodSug}
//                   storeSug={storeSug}
//                   activeIdx={activeIdx}
//                   setActiveIdx={setActiveIdx}
//                   onPick={(to) => {
//                     setOpenSug(false);
//                     closeAllMobile();
//                     navigate(to);
//                   }}
//                   onSeeAll={() => {
//                     setOpenSug(false);
//                     closeAllMobile();
//                     submitSearch();
//                   }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Mobile off-canvas menu */}
//       <MobileMenu
//         open={mobileOpen}
//         onClose={closeAllMobile}
//         cats={cats}
//         cartCount={count}
//         isLogged={isLogged}
//         onGoProfile={goToProfile}
//       />
//     </header>
//   );
// }

// /* ---------- SUGGESTIONS UI ---------- */
// function SugContent({ loading, prodSug, storeSug, activeIdx, setActiveIdx, onPick, onSeeAll }) {
//   if (loading) {
//     return <div className="p-4 text-sm text-gray-500">Buscando…</div>;
//   }

//   const total = (prodSug?.length || 0) + (storeSug?.length || 0);
//   if (total === 0) {
//     return (
//       <div className="p-4 text-sm text-gray-500">
//         Sin sugerencias. Presioná Enter para ver todos los resultados.
//       </div>
//     );
//   }

//   let idx = 0;
//   return (
//     <div>
//       {prodSug?.length > 0 && (
//         <div className="py-2">
//           <div className="px-3 pb-1 text-xs uppercase text-gray-500">Productos</div>
//           {prodSug.map((p) => {
//             const my = idx++;
//             const active = my === activeIdx;
//             const img = p.imagenes?.find((x) => x.is_primary)?.url || p.imagenes?.[0]?.url || null;
//             return (
//               <button
//                 key={`p-${p.id}`}
//                 role="option"
//                 aria-selected={active}
//                 onMouseEnter={() => setActiveIdx(my)}
//                 onMouseDown={(e) => {
//                   e.preventDefault();
//                   onPick(`/producto/${p.id}`);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
//                   active ? "bg-gray-50" : ""
//                 }`}
//               >
//                 <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
//                   {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : null}
//                 </div>
//                 <div className="min-w-0">
//                   <div className="text-sm font-medium truncate">{p.nombre}</div>
//                   <div className="text-xs text-gray-500 truncate">
//                     {p.seller_nombre || "Producto"}
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {storeSug?.length > 0 && (
//         <div className="py-2 border-t">
//           <div className="px-3 pb-1 text-xs uppercase text-gray-500">Tiendas</div>
//           {storeSug.map((s) => {
//             const my = idx++;
//             const active = my === activeIdx;
//             return (
//               <button
//                 key={`s-${s.id}`}
//                 role="option"
//                 aria-selected={active}
//                 onMouseEnter={() => setActiveIdx(my)}
//                 onMouseDown={(e) => {
//                   e.preventDefault();
//                   onPick(`/vendedor/${s.id}`);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
//                   active ? "bg-gray-50" : ""
//                 }`}
//               >
//                 <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0" />
//                 <div className="min-w-0">
//                   <div className="text-sm font-medium truncate">
//                     {s.nombre_fantasia || s.name || "Tienda"}
//                   </div>
//                   <div className="text-xs text-gray-500 truncate">Ver tienda</div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       <div className="border-t">
//         <button
//           onMouseDown={(e) => {
//             e.preventDefault();
//             onSeeAll();
//           }}
//           className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
//         >
//           Ver todos los resultados
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------- MOBILE MENU ---------- */
// function MobileMenu({ open, onClose, cats, cartCount, isLogged, onGoProfile }) {
//   return (
//     <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
//       <div
//         className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
//         onClick={onClose}
//       />
//       <aside
//         className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl transform transition-transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//         role="dialog"
//         aria-label="Menú de navegación"
//       >
//         <div className="p-4 border-b flex items-center justify-between">
//           <span className="font-semibold">Menú</span>
//           <button
//             aria-label="Cerrar menú"
//             onClick={onClose}
//             className="px-2 py-1 rounded-md border hover:bg-gray-50"
//           >
//             ✕
//           </button>
//         </div>

//         <nav className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
//           <div className="flex items-center justify-between">
//             <Link to="/carrito" onClick={onClose} className="relative px-3 py-2 rounded-md border hover:bg-gray-50">
//               🛒 Carrito
//               {cartCount > 0 && (
//                 <span className="ml-2 text-xs bg-black text-white rounded-full px-1.5 align-middle">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {isLogged ? (
//               <button onClick={() => { onClose(); onGoProfile(); }} className="px-3 py-2 rounded-md hover:bg-gray-50">
//                 Mi perfil
//               </button>
//             ) : (
//               <Link to="/login" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-gray-50">
//                 Login
//               </Link>
//             )}
//           </div>

//           <Link to="/quiero-ser-socio" onClick={onClose} className="block px-3 py-2 rounded-md border hover:bg-gray-50">
//             Quiero ser socio
//           </Link>

//           <div>
//             <div className="text-xs uppercase text-gray-500 mb-2">Categorías</div>
//             <ul className="space-y-1">
//               {cats.map((c) => (
//                 <li key={c.id}>
//                   <Link
//                     to={`/c/${encodeURIComponent(String(c.nombre || "").toLowerCase())}`}
//                     onClick={onClose}
//                     className="block px-3 py-2 rounded-md hover:bg-gray-50"
//                   >
//                     {c.nombre}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <div className="text-xs uppercase text-gray-500 mb-2">Enlaces</div>
//             <ul className="space-y-1">
//               <li>
//                 <Link to="/" onClick={onClose} className="block px-3 py-2 rounded-md hover:bg-gray-50">
//                   Inicio
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/buscar" onClick={onClose} className="block px-3 py-2 rounded-md hover:bg-gray-50">
//                   Buscar
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </aside>
//     </div>
//   );
// }
// src/components/Navbar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import axiosAuth from "../api/axiosConfig";
import { useCart } from "./CartContext";
import { verCreditos } from "../api/recargarCredito";

const DEBOUNCE_MS = 400;
const MIN_CHARS = 2;
const SEARCH_ENDPOINT = "products/public/";
const SEARCH_ORDER = "-id";

/* ========== Helpers Auth ========== */
function decodeJWT(raw) {
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
}
function tokenIsValid() {
  const tok = localStorage.getItem("token") || localStorage.getItem("access");
  if (!tok) return false;
  const payload = decodeJWT(tok);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}
function guessRoleFromToken() {
  const tok = localStorage.getItem("token") || localStorage.getItem("access");
  const p = decodeJWT(tok);
  if (!p) return null;
  if (p.is_superuser || p.is_staff || p.role === "admin") return "admin";
  if (p.role === "socio" || p.role === "vendedor") return "socio";
  if (p.role === "cliente") return "cliente";
  return p.role || null;
}

/* ========== Formato $ ARS ========== */
const fmtARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

function toNumber(raw) {
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  const s = String(raw).trim();
  if (!s) return 0;
  const only = s.replace(/[^0-9.,-]/g, "");
  const hasDot = only.includes(".");
  const hasComma = only.includes(",");
  if (hasDot && hasComma) return Number(only.replace(/\./g, "").replace(",", "."));
  if (hasComma && !hasDot) return Number(only.replace(",", "."));
  return Number(only);
}

/* ========== Componente ========== */
export default function NavBar() {
  const [cats, setCats] = useState([]);
  const [catFilter, setCatFilter] = useState("");
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(null);

  // Autocomplete (desktop)
  const [loadingSug, setLoadingSug] = useState(false);
  const [prodSug, setProdSug] = useState([]);
  const [storeSug, setStoreSug] = useState([]);
  const [openSug, setOpenSug] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Auth
  const [isLogged, setIsLogged] = useState(tokenIsValid());
  const [role, setRole] = useState(isLogged ? guessRoleFromToken() : null);
  const [roleLoading, setRoleLoading] = useState(false);

  // Créditos (cliente)
  const [credits, setCredits] = useState(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  // Scroll / headroom
  const [scrolled, setScrolled] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  // Layout
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(72); // fallback altura aprox.

  // Refs auxiliares
  const catsBtnRef = useRef(null);
  const catsMenuRef = useRef(null);
  const searchRef = useRef(null);
  const popRef = useRef(null);
  const debounceRef = useRef(null);
  const reqIdRef = useRef(0);
  const cacheRef = useRef(new Map());
  const lastYRef = useRef(0);
  const navigate = useNavigate();
  const { search } = useLocation();
  const { count } = useCart();

  /* ===== Medir alto del header para el spacer ===== */
  const measureHeader = () => {
    const h = headerRef.current?.offsetHeight || 0;
    if (h && h !== headerH) setHeaderH(h);
  };
  useEffect(() => {
    measureHeader();
    const ro = new ResizeObserver(measureHeader);
    if (headerRef.current) ro.observe(headerRef.current);
    const onResize = () => measureHeader();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []); // eslint-disable-line

  /* ===== Body lock drawer ===== */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /* ===== Sync auth y focus ===== */
  useEffect(() => {
    const sync = () => {
      const valid = tokenIsValid();
      setIsLogged(valid);
      setRole(valid ? guessRoleFromToken() : null);
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  /* ===== Blur + headroom (con position: fixed) ===== */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 6);

      // no ocultar si hay menús abiertos
      if (catsOpen || mobileOpen) {
        setHideHeader(false);
        lastYRef.current = y;
        return;
      }

      // lógica headroom
      const last = lastYRef.current;
      const goingDown = y > last;
      const delta = Math.abs(y - last);

      if (y < 64) {
        setHideHeader(false);
      } else if (goingDown && delta > 8) {
        setHideHeader(true);
      } else if (!goingDown && delta > 6) {
        setHideHeader(false);
      }
      lastYRef.current = y;
    };

    // estado inicial
    lastYRef.current = window.scrollY || 0;
    setScrolled(lastYRef.current > 6);
    setHideHeader(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [catsOpen, mobileOpen]);

  /* ===== Categorías ===== */
  useEffect(() => {
    axiosPublic
      .get("products/categorias/")
      .then((r) => setCats(r.data || []))
      .catch(() => setCats([]));
  }, []);

  /* ===== Preservar query ===== */
  useEffect(() => {
    const params = new URLSearchParams(search);
    setQ(params.get("q") || "");
  }, [search]);

  /* ===== Mega menu top ===== */
  const updateMenuTop = () => {
    const btn = catsBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    // como el header es fixed, el top real es rect.bottom desde viewport
    setMenuTop(rect.bottom + window.scrollY);
  };

  /* ===== Cierre dropdown categorías ===== */
  useEffect(() => {
    const onDocDown = (e) => {
      if (!catsOpen) return;
      const t = e.target;
      if (catsBtnRef.current?.contains(t)) return;
      if (catsMenuRef.current?.contains(t)) return;
      setCatsOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setCatsOpen(false);
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [catsOpen]);

  /* ===== Debounce autocomplete ===== */
  useEffect(() => {
    const query = q.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < MIN_CHARS) {
      setOpenSug(false);
      setProdSug([]);
      setStoreSug([]);
      setActiveIdx(-1);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  /* ===== Click afuera sugerencias ===== */
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!openSug) return;
      const t = e.target;
      if (
        searchRef.current &&
        !searchRef.current.contains(t) &&
        popRef.current &&
        !popRef.current.contains(t)
      ) {
        setOpenSug(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [openSug]);

  /* ===== Autocomplete (desktop) ===== */
  const combined = useMemo(() => {
    const prods = (prodSug || []).map((p) => ({
      kind: "product",
      id: p.id,
      label: p.nombre,
      subtitle: p.seller_nombre || "Producto",
      to: `/producto/${p.id}`,
      img:
        p.imagenes?.find((i) => i.is_primary)?.url ||
        p.imagenes?.[0]?.url ||
        null,
    }));
    const stores = (storeSug || []).map((s) => ({
      kind: "store",
      id: s.id,
      label: s.nombre_fantasia || s.name || "Tienda",
      subtitle: "Tienda",
      to: `/vendedor/${s.id}`,
      img: s.logo_url || null,
    }));
    return [...prods, ...stores];
  }, [prodSug, storeSug]);

  async function fetchSuggestions(query) {
    const key = query.toLowerCase();
    if (cacheRef.current.has(key)) {
      const { prods, stores } = cacheRef.current.get(key);
      setProdSug(prods);
      setStoreSug(stores);
      setOpenSug(true);
      setActiveIdx(-1);
      return;
    }
    const myId = ++reqIdRef.current;
    setLoadingSug(true);
    try {
      const pr = await axiosPublic
        .get(
          `${SEARCH_ENDPOINT}?search=${encodeURIComponent(
            query
          )}&ordering=${encodeURIComponent(SEARCH_ORDER)}&limit=12`
        )
        .catch(() => ({ data: [] }));
      if (myId !== reqIdRef.current) return;

      const list = Array.isArray(pr.data?.results)
        ? pr.data.results
        : pr.data || [];
      const prods = list.slice(0, 6);

      const storeMap = new Map();
      for (const p of list) {
        const id = p.seller_id ?? p.seller?.id;
        const name =
          p.seller_nombre ?? p.seller?.nombre_fantasia ?? p.seller?.name;
        if (id && name && !storeMap.has(id))
          storeMap.set(id, { id, nombre_fantasia: name });
        if (storeMap.size >= 6) break;
      }
      const stores = Array.from(storeMap.values());

      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
      cacheRef.current.set(key, { prods, stores });

      setProdSug(prods);
      setStoreSug(stores);
      setOpenSug(true);
      setActiveIdx(-1);
    } finally {
      if (myId === reqIdRef.current) setLoadingSug(false);
    }
  }

  const navigateTo = (to) => {
    closeAll();
    navigate(to);
  };
  const submitSearch = (e) => {
    e?.preventDefault?.();
    const query = q.trim();
    if (!query) return;
    navigateTo(`/buscar?q=${encodeURIComponent(query)}`);
  };
  const onKeyDown = (e) => {
    if (!openSug && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpenSug(true);
      return;
    }
    if (!openSug || combined.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % combined.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + combined.length) % combined.length);
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && combined[activeIdx]) {
        e.preventDefault();
        navigateTo(combined[activeIdx].to);
      } else {
        submitSearch(e);
      }
    } else if (e.key === "Escape") {
      setOpenSug(false);
    }
  };

  /* ===== Créditos ===== */
  const fetchClientCredits = async () => {
    if (!isLogged || role !== "cliente") return;
    setCreditsLoading(true);
    try {
      const value = await verCreditos();
      setCredits(toNumber(value));
    } catch {
      setCredits(0);
    } finally {
      setCreditsLoading(false);
    }
  };
  useEffect(() => {
    if (isLogged && role === "cliente") fetchClientCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, role]);
  useEffect(() => {
    const onFocus = () => {
      if (isLogged && role === "cliente") fetchClientCredits();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [isLogged, role]);

  const closeAll = () => {
    setMobileOpen(false);
    setCatsOpen(false);
    setOpenSug(false);
  };

  const goToProfile = async () => {
    if (!isLogged) return navigateTo("/login");
    let r = role;
    if (!r && !roleLoading) {
      try {
        setRoleLoading(true);
        const me = await axiosAuth.get("users/me/");
        r = me.data?.role || null;
        setRole(r);
      } catch {
        r = guessRoleFromToken();
        setRole(r);
      } finally {
        setRoleLoading(false);
      }
    }
    if (r === "admin") return navigateTo("/admin");
    if (r === "socio" || r === "vendedor") {
      try {
        await axiosAuth.get("sellers/mi-perfil/");
        return navigateTo("/socio/dashboard");
      } catch (e) {
        if (e?.response?.status === 404)
          return navigateTo("/socio/crear-perfil");
        return navigateTo("/socio/dashboard");
      }
    }
    return navigateTo("/dashboard-cliente");
  };

  /* ===== Clases dinámicas del header (fixed + blur + headroom) ===== */
  const headerClass = [
    "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
    "transform-gpu will-change-transform",
    hideHeader ? "-translate-y-full" : "translate-y-0",
    scrolled
      ? "bg-white/60 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/55"
      : "bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70"
  ].join(" ");

  /* ===== Render ===== */
  return (
    <>
      {/* Header fijo */}
      <header ref={headerRef} className={headerClass} data-scrolled={scrolled ? "1" : "0"}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Hamburguesa */}
          <button
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FFB800] text-gray-900 hover:bg-[#FFB800] hover:text-black transition lg:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current rounded" />
              <span className="block h-0.5 w-5 bg-current rounded" />
              <span className="block h-0.5 w-5 bg-current rounded" />
            </div>
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => {
              setOpenSug(false);
              setCatsOpen(false);
            }}
          >
            <span className="inline-block h-8 w-8 rounded-lg bg-gray-900" />
            <span>IntiShop</span>
          </Link>

          {/* Botón Categorías */}
          <div className="relative hidden lg:block">
            <button
              ref={catsBtnRef}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:shadow"
              onClick={() => {
                setCatsOpen((v) => !v);
                updateMenuTop();
                setHideHeader(false); // asegurar visible cuando se abre
              }}
            >
              Categorías
              <svg
                className={`h-4 w-4 transition-transform ${catsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
              </svg>
            </button>
          </div>

          {/* Mega menú (fixed) */}
          {catsOpen && (
            <div
              ref={catsMenuRef}
              className="fixed inset-x-0 z-[100] pt-3"
              style={{ top: menuTop ?? 0 }}
            >
              <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b bg-gray-50/80 px-6 py-4">
                  <span className="text-base font-semibold text-gray-800">
                    Todas las categorías
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                      <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <input
                      value={catFilter}
                      onChange={(e) => setCatFilter(e.target.value)}
                      placeholder="Filtrar categorías…"
                      className="w-56 bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {(cats || [])
                      .filter((c) =>
                        !catFilter
                          ? true
                          : String(c?.nombre || "")
                              .toLowerCase()
                              .includes(catFilter.toLowerCase())
                      )
                      .map((c) => (
                        <Link
                          key={c.id}
                          to={`/c/${encodeURIComponent(
                            String(c.nombre || "").toLowerCase()
                          )}`}
                          onClick={() => setCatsOpen(false)}
                          className="block rounded-xl border px-4 py-3 text-base hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                        >
                          <span className="line-clamp-1">{c.nombre}</span>
                        </Link>
                      ))}
                  </div>

                  {/* Sin resultados */}
                  {cats?.length > 0 &&
                    (cats.filter((c) =>
                      String(c?.nombre || "")
                        .toLowerCase()
                        .includes(catFilter.toLowerCase())
                    ).length === 0) && (
                      <div className="px-2 py-10 text-center text-sm text-gray-500">
                        Sin resultados para “{catFilter}”.
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Buscador (desktop) */}
          <div ref={searchRef} className="relative hidden flex-1 lg:flex">
            <form onSubmit={submitSearch} className="flex w-full items-center">
              <div className="flex w-full items-center gap-2 rounded-xl border px-3 py-2">
                <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                  <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={() => setOpenSug(q.trim().length >= MIN_CHARS)}
                  placeholder="Buscar productos o tiendas…"
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label="Buscar"
                />
                <button
                  className="rounded-lg border px-3 py-1.5 text-sm hover:shadow"
                  type="submit"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Sugerencias */}
            {openSug && (
              <div
                ref={popRef}
                className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-[70vh] overflow-auto rounded-xl border bg-white shadow-2xl"
                role="listbox"
              >
                <SugContent
                  loading={loadingSug}
                  prodSug={prodSug}
                  storeSug={storeSug}
                  activeIdx={activeIdx}
                  setActiveIdx={setActiveIdx}
                  onPick={(to) => navigateTo(to)}
                  onSeeAll={() => submitSearch()}
                />
              </div>
            )}
          </div>

          {/* Acciones (desktop) */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {/* Créditos del cliente */}
            {isLogged && role === "cliente" && (
              <div className="rounded-lg border px-3 py-2 text-sm font-medium">
                {creditsLoading ? "Créditos: …" : `Créditos: ${fmtARS(credits ?? 0)}`}
              </div>
            )}

            <Link
              to="/quiero-ser-socio"
              className="rounded-lg border px-3 py-2 text-sm hover:shadow"
            >
              Quiero ser socio
            </Link>

            <button
              onClick={isLogged ? goToProfile : () => navigateTo("/login")}
              className="rounded-lg border px-3 py-2 text-sm hover:shadow"
              disabled={roleLoading}
            >
              {isLogged ? (roleLoading ? "Cargando…" : "Mi perfil") : "Login"}
            </button>

            <Link
              to="/carrito"
              className="relative inline-flex items-center gap-2 rounded-lg border px-3 py-2"
              aria-label="Ir al carrito"
            >
              🛒
              {count > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full border bg-[#FFB800] px-1.5 text-xs font-semibold text-black">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Drawer móvil */}
        <MobileMenu
          open={mobileOpen}
          onClose={closeAll}
          cats={cats}
          count={count}
          isLogged={isLogged}
          role={role}
          credits={credits}
          creditsLoading={creditsLoading}
          goToProfile={goToProfile}
        />
      </header>

      {/* Spacer para no tapar el contenido (altura del header fijo) */}
      <div aria-hidden="true" style={{ height: headerH }} />
    </>
  );
}

/* ===== Sugerencias (desktop) ===== */
function SugContent({
  loading,
  prodSug,
  storeSug,
  activeIdx,
  setActiveIdx,
  onPick,
  onSeeAll,
}) {
  if (loading)
    return <div className="p-4 text-sm text-gray-500">Buscando…</div>;
  const total = (prodSug?.length || 0) + (storeSug?.length || 0);
  if (total === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Sin sugerencias. Enter para ver todos.
      </div>
    );
  }
  let idx = 0;
  return (
    <div>
      {prodSug?.length > 0 && (
        <div className="py-2">
          <div className="px-3 pb-1 text-xs uppercase text-gray-500">
            Productos
          </div>
          {prodSug.map((p) => {
            const my = idx++;
            const active = my === activeIdx;
            const img =
              p.imagenes?.find((x) => x.is_primary)?.url ||
              p.imagenes?.[0]?.url ||
              null;
            return (
              <button
                key={`p-${p.id}`}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIdx(my)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(`/producto/${p.id}`);
                }}
                className={`w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 md:flex ${
                  active ? "bg-gray-50" : ""
                }`}
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {p.nombre}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {p.seller_nombre || "Producto"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {storeSug?.length > 0 && (
        <div className="border-t py-2">
          <div className="px-3 pb-1 text-xs uppercase text-gray-500">
            Tiendas
          </div>
          {storeSug.map((s) => {
            const my = idx++;
            const active = my === activeIdx;
            return (
              <button
                key={`s-${s.id}`}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIdx(my)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(`/vendedor/${s.id}`);
                }}
                className={`w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 md:flex ${
                  active ? "bg-gray-50" : ""
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-md bg-gray-100" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {s.nombre_fantasia || s.name || "Tienda"}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    Ver tienda
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <div className="border-t">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onSeeAll();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
        >
          Ver todos los resultados
        </button>
      </div>
    </div>
  );
}

/* ===== Drawer Mobile ===== */
function MobileMenu({
  open,
  onClose,
  cats,
  count,
  isLogged,
  role,
  credits,
  creditsLoading,
  goToProfile,
}) {
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  const fmtARS = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(n) ? n : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = search.trim();
    if (!text) return;
    onClose();
    nav(`/buscar?q=${encodeURIComponent(text)}`);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-screen w-screen sm:w-[85%] sm:max-w-md transform bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white/95 px-5 py-4 shadow-sm">
          <span className="inline-block h-9 w-9 rounded-lg bg-gray-900" />
          <span className="text-lg font-semibold text-gray-800">Menú</span>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto px-5 pb-6 pt-4 space-y-6">
          {/* Buscador */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm"
          >
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos o tiendas…"
              className="flex-1 bg-transparent text-base outline-none"
            />
            <button
              type="submit"
              className="rounded-lg border border-[#FFB800] px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-[#FFB800] hover:text-black"
            >
              Buscar
            </button>
          </form>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-2 gap-3">
            {isLogged && role === "cliente" ? (
              <div className="w-full rounded-lg border bg-white px-4 py-3 text-center text-sm font-medium">
                {creditsLoading ? "Créditos: …" : `Créditos: ${fmtARS(credits ?? 0)}`}
              </div>
            ) : (
              <div className="w-full rounded-lg border bg-white px-4 py-3 text-center text-sm text-gray-500">
                Bienvenido
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                isLogged ? goToProfile() : nav("/login");
              }}
              className="w-full rounded-lg border bg-white px-4 py-3 text-center text-sm font-medium hover:bg-gray-50"
            >
              {isLogged ? "Mi perfil" : "Login"}
            </button>
          </div>

          {/* Enlaces */}
          <nav className="space-y-2">
            <Link
              to="/"
              onClick={onClose}
              className="block rounded-lg border bg-white px-4 py-3 text-sm hover:bg-gray-50"
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              onClick={onClose}
              className="block rounded-lg border bg-white px-4 py-3 text-sm hover:bg-gray-50"
            >
              Tienda
            </Link>
            <Link
              to="/quiero-ser-socio"
              onClick={onClose}
              className="block rounded-lg border bg-white px-4 py-3 text-sm hover:bg-gray-50"
            >
              Quiero ser socio
            </Link>
          </nav>

          {/* Categorías */}
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">
              Categorías
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cats.length === 0 ? (
                <div className="col-span-2 rounded-lg border bg-white px-4 py-3 text-sm text-gray-500">
                  Sin categorías
                </div>
              ) : (
                cats.map((c) => (
                  <Link
                    key={c.id}
                    to={`/c/${encodeURIComponent(
                      String(c.nombre || "").toLowerCase()
                    )}`}
                    onClick={onClose}
                    className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    {c.nombre}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Carrito (mobile) */}
          <Link
            to="/carrito"
            onClick={onClose}
            className="relative block rounded-lg border bg-white px-4 py-3 text-center text-sm font-medium hover:bg-gray-50"
          >
            🛒 Ir al carrito
            {count > 0 && (
              <span className="ml-2 rounded-full bg-[#FFB800] px-1.5 text-xs font-semibold text-black align-middle">
                {count}
              </span>
            )}
          </Link>
        </div>
      </aside>
    </div>
  );
}
