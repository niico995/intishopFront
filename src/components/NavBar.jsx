// // // src/components/Navbar.jsx
// // import { useEffect, useState, useRef, useMemo } from "react";
// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import axiosPublic from "../api/axiosPublic";     // público (sin Authorization)
// // import axiosAuth from "../api/axiosConfig";       // con Authorization cuando exista
// // import { useCart } from "./CartContext";

// // const DEBOUNCE_MS = 400;
// // const MIN_CHARS = 2;

// // /* Helpers */
// // function decodeJWT(raw) {
// //   try {
// //     if (!raw) return null;
// //     const [, payload] = String(raw).split(".");
// //     if (!payload) return null;
// //     const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
// //     const json = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
// //     return JSON.parse(json);
// //   } catch {
// //     return null;
// //   }
// // }

// // function tokenIsValid() {
// //   const tok = localStorage.getItem("token") || localStorage.getItem("access");
// //   if (!tok) return false;
// //   const payload = decodeJWT(tok);
// //   if (!payload?.exp) return true; // si no hay exp, asumimos válido
// //   const now = Math.floor(Date.now() / 1000);
// //   return payload.exp > now;
// // }

// // function guessRoleFromToken() {
// //   const tok = localStorage.getItem("token") || localStorage.getItem("access");
// //   const p = decodeJWT(tok);
// //   if (!p) return null;
// //   if (p.is_superuser || p.is_staff || p.role === "admin") return "admin";
// //   if (p.role === "socio" || p.role === "vendedor") return "socio";
// //   if (p.role === "cliente") return "cliente";
// //   return p.role || null;
// // }

// // export default function NavBar() {
// //   const [cats, setCats] = useState([]);
// //   const [q, setQ] = useState("");
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

// //   // Autocomplete
// //   const [loadingSug, setLoadingSug] = useState(false);
// //   const [prodSug, setProdSug] = useState([]);
// //   const [storeSug, setStoreSug] = useState([]);
// //   const [openSug, setOpenSug] = useState(false);
// //   const [activeIdx, setActiveIdx] = useState(-1);

// //   // Auth state
// //   const [isLogged, setIsLogged] = useState(tokenIsValid());
// //   const [role, setRole] = useState(isLogged ? guessRoleFromToken() : null);
// //   const [roleLoading, setRoleLoading] = useState(false);

// //   const searchRef = useRef(null);
// //   const popRef = useRef(null);
// //   const debounceRef = useRef(null);
// //   const reqIdRef = useRef(0);
// //   const cacheRef = useRef(new Map());

// //   const navigate = useNavigate();
// //   const { search } = useLocation();
// //   const { count } = useCart();

// //   // Mantener auth state actualizado
// //   useEffect(() => {
// //     const sync = () => {
// //       const valid = tokenIsValid();
// //       setIsLogged(valid);
// //       setRole(valid ? guessRoleFromToken() : null);
// //     };
// //     window.addEventListener("storage", sync);
// //     window.addEventListener("focus", sync);
// //     return () => {
// //       window.removeEventListener("storage", sync);
// //       window.removeEventListener("focus", sync);
// //     };
// //   }, []);

// //   // Categorías (público)
// //   useEffect(() => {
// //     let mounted = true;
// //     axiosPublic
// //       .get("products/categorias/")
// //       .then((r) => mounted && setCats(r.data || []))
// //       .catch(() => setCats([]));
// //     return () => {
// //       mounted = false;
// //     };
// //   }, []);

// //   // Mantener query en input si venimos de /buscar
// //   useEffect(() => {
// //     const params = new URLSearchParams(search);
// //     setQ(params.get("q") || "");
// //   }, [search]);

// //   const closeAllMobile = () => {
// //     setMobileOpen(false);
// //     setMobileSearchOpen(false);
// //   };

// //   // ---------- AUTOCOMPLETE ----------
// //   const combined = useMemo(() => {
// //     const prods = (prodSug || []).map((p) => ({
// //       kind: "product",
// //       id: p.id,
// //       label: p.nombre,
// //       subtitle: p.seller_nombre || "Producto",
// //       to: `/producto/${p.id}`,
// //       img: p.imagenes?.find((i) => i.is_primary)?.url || p.imagenes?.[0]?.url || null,
// //     }));
// //     const stores = (storeSug || []).map((s) => ({
// //       kind: "store",
// //       id: s.id,
// //       label: s.nombre_fantasia || s.name || "Tienda",
// //       subtitle: "Tienda",
// //       to: `/vendedor/${s.id}`,
// //       img: s.logo_url || null,
// //     }));
// //     return [...prods, ...stores];
// //   }, [prodSug, storeSug]);

// //   async function fetchSuggestions(query) {
// //     const key = query.toLowerCase();

// //     if (cacheRef.current.has(key)) {
// //       const { prods, stores } = cacheRef.current.get(key);
// //       setProdSug(prods);
// //       setStoreSug(stores);
// //       setOpenSug(true);
// //       setActiveIdx(-1);
// //       return;
// //     }

// //     const myId = ++reqIdRef.current;
// //     setLoadingSug(true);
// //     try {
// //       const pr = await axiosPublic
// //         .get(
// //           `products/tienda/productos/?search=${encodeURIComponent(
// //             query
// //           )}&ordering=-creado&limit=12`
// //         )
// //         .catch(() => ({ data: [] }));

// //       if (myId !== reqIdRef.current) return;

// //       const list = Array.isArray(pr.data?.results) ? pr.data.results : pr.data || [];
// //       const prods = list.slice(0, 5);

// //       const storeMap = new Map();
// //       for (const p of list) {
// //         const id = p.seller_id ?? p.seller?.id;
// //         const name = p.seller_nombre ?? p.seller?.nombre_fantasia ?? p.seller?.name;
// //         if (id && name && !storeMap.has(id)) storeMap.set(id, { id, nombre_fantasia: name });
// //         if (storeMap.size >= 5) break;
// //       }
// //       const stores = Array.from(storeMap.values());

// //       if (cacheRef.current.size > 50) {
// //         const firstKey = cacheRef.current.keys().next().value;
// //         cacheRef.current.delete(firstKey);
// //       }
// //       cacheRef.current.set(key, { prods, stores });

// //       setProdSug(prods);
// //       setStoreSug(stores);
// //       setOpenSug(true);
// //       setActiveIdx(-1);
// //     } finally {
// //       if (myId === reqIdRef.current) setLoadingSug(false);
// //     }
// //   }

// //   // Debounce input
// //   useEffect(() => {
// //     const query = q.trim();
// //     if (debounceRef.current) clearTimeout(debounceRef.current);

// //     if (!query || query.length < MIN_CHARS) {
// //       setOpenSug(false);
// //       setProdSug([]);
// //       setStoreSug([]);
// //       setActiveIdx(-1);
// //       return;
// //     }
// //     debounceRef.current = setTimeout(() => {
// //       fetchSuggestions(query);
// //     }, DEBOUNCE_MS);

// //     return () => clearTimeout(debounceRef.current);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [q]);

// //   // Cerrar dropdown al click afuera
// //   useEffect(() => {
// //     function onClickOutside(e) {
// //       if (!openSug) return;
// //       const t = e.target;
// //       if (
// //         searchRef.current &&
// //         !searchRef.current.contains(t) &&
// //         popRef.current &&
// //         !popRef.current.contains(t)
// //       ) {
// //         setOpenSug(false);
// //       }
// //     }
// //     window.addEventListener("mousedown", onClickOutside);
// //     return () => window.removeEventListener("mousedown", onClickOutside);
// //   }, [openSug]);

// //   const navigateTo = (to) => {
// //     setOpenSug(false);
// //     closeAllMobile();
// //     navigate(to);
// //   };

// //   const submitSearch = (e) => {
// //     e?.preventDefault?.();
// //     const query = q.trim();
// //     if (!query) return;
// //     navigateTo(`/buscar?q=${encodeURIComponent(query)}`);
// //   };

// //   // ⇢ Resolver ruta de perfil según rol (con verificación para socio)
// //   const goToProfile = async () => {
// //     if (!isLogged) {
// //       return navigateTo("/login");
// //     }

// //     // Si ya sabemos el rol, usamos eso; si no, tratamos de pedirlo
// //     let r = role;
// //     if (!r && !roleLoading) {
// //       try {
// //         setRoleLoading(true);
// //         const me = await axiosAuth.get("users/me/");
// //         r = me.data?.role || null;
// //         setRole(r);
// //       } catch {
// //         // si falla, intentamos igual con el guess del token
// //         r = guessRoleFromToken();
// //         setRole(r);
// //       } finally {
// //         setRoleLoading(false);
// //       }
// //     }

// //     if (r === "admin") {
// //       return navigateTo("/admin");
// //     }

// //     if (r === "socio" || r === "vendedor") {
// //       try {
// //         await axiosAuth.get("sellers/mi-perfil/"); // 200 si existe
// //         return navigateTo("/socio/dashboard");
// //       } catch (e) {
// //         if (e?.response?.status === 404) return navigateTo("/socio/crear-perfil");
// //         return navigateTo("/socio/dashboard"); // fallback
// //       }
// //     }

// //     // cliente u otros
// //     return navigateTo("/dashboard-cliente");
// //   };

// //   const onKeyDown = (e) => {
// //     if (!openSug && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
// //       setOpenSug(true);
// //       return;
// //     }
// //     if (!openSug || combined.length === 0) return;

// //     if (e.key === "ArrowDown") {
// //       e.preventDefault();
// //       setActiveIdx((i) => (i + 1) % combined.length);
// //     } else if (e.key === "ArrowUp") {
// //       e.preventDefault();
// //       setActiveIdx((i) => (i - 1 + combined.length) % combined.length);
// //     } else if (e.key === "Enter") {
// //       if (activeIdx >= 0 && combined[activeIdx]) {
// //         e.preventDefault();
// //         const item = combined[activeIdx];
// //         navigateTo(item.to);
// //       } else {
// //         submitSearch(e);
// //       }
// //     } else if (e.key === "Escape") {
// //       setOpenSug(false);
// //     }
// //   };

// //   return (
// //     <header className="sticky top-0 z-40 w-full border-b bg-white">
// //       {/* Top bar */}
// //       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
// //         {/* Hamburger (mobile) */}
// //         <button
// //           aria-label="Abrir menú"
// //           aria-expanded={mobileOpen}
// //           onClick={() => setMobileOpen(true)}
// //           className="lg:hidden px-2 py-1 rounded-md border hover:bg-gray-50"
// //         >
// //           ☰
// //         </button>

// //         {/* Logo */}
// //         <Link
// //           to="/"
// //           className="text-2xl font-bold"
// //           onClick={() => {
// //             setOpenSug(false);
// //             closeAllMobile();
// //           }}
// //         >
// //           IntiShop
// //         </Link>

// //         {/* Categorías (desktop) */}
// //         <div className="relative group hidden lg:block">
// //           <button className="px-3 py-2 rounded-md hover:bg-gray-100" aria-haspopup="true">
// //             Categorías
// //           </button>
// //           <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-md shadow-md z-20 max-h-[70vh] overflow-auto min-w-56">
// //             {cats.map((c) => (
// //               <Link
// //                 key={c.id}
// //                 to={`/c/${encodeURIComponent(String(c.nombre || "").toLowerCase())}`}
// //                 className="block px-4 py-2 hover:bg-gray-50"
// //                 onClick={() => setOpenSug(false)}
// //               >
// //                 {c.nombre}
// //               </Link>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Search (desktop) */}
// //         <div ref={searchRef} className="relative hidden lg:flex flex-1">
// //           <form onSubmit={submitSearch} className="flex-1 flex">
// //             <input
// //               value={q}
// //               onChange={(e) => setQ(e.target.value)}
// //               onKeyDown={onKeyDown}
// //               onFocus={() => q.trim().length >= MIN_CHARS && setOpenSug(true)}
// //               placeholder="Buscar productos o tiendas…"
// //               className="flex-1 border rounded-l-md px-3 py-2 outline-none focus:ring-2"
// //               aria-label="Buscar"
// //               aria-autocomplete="list"
// //             />
// //             <button className="px-4 py-2 border border-l-0 rounded-r-md hover:bg-gray-50">
// //               Buscar
// //             </button>
// //           </form>

// //           {/* Sugerencias (desktop) */}
// //           {openSug && (
// //             <div
// //               ref={popRef}
// //               className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-30 max-h-[70vh] overflow-auto"
// //               role="listbox"
// //             >
// //               <SugContent
// //                 loading={loadingSug}
// //                 prodSug={prodSug}
// //                 storeSug={storeSug}
// //                 activeIdx={activeIdx}
// //                 setActiveIdx={setActiveIdx}
// //                 onPick={(to) => navigateTo(to)}
// //                 onSeeAll={() => submitSearch()}
// //               />
// //             </div>
// //           )}
// //         </div>

// //         {/* Mobile search toggle */}
// //         <button
// //           aria-label="Buscar"
// //           className="lg:hidden ml-auto px-2 py-1 rounded-md border hover:bg-gray-50"
// //           onClick={() => setMobileSearchOpen((v) => !v)}
// //         >
// //           🔎
// //         </button>

// //         {/* Acciones (desktop) */}
// //         <div className="hidden lg:flex items-center gap-2">
// //           <Link to="/quiero-ser-socio" className="px-3 py-2 rounded-md border hover:bg-gray-50">
// //             Quiero ser socio
// //           </Link>

// //           {/* Si no está logueado: Login; si está logueado: Mi perfil (dinámico) */}
// //           {isLogged ? (
// //             <button
// //               onClick={goToProfile}
// //               className="px-3 py-2 rounded-md hover:bg-gray-50"
// //               disabled={roleLoading}
// //             >
// //               {roleLoading ? "Cargando…" : "Mi perfil"}
// //             </button>
// //           ) : (
// //             <Link to="/login" className="px-3 py-2 rounded-md hover:bg-gray-50">
// //               Login
// //             </Link>
// //           )}

// //           <Link to="/carrito" className="relative px-3 py-2 rounded-md hover:bg-gray-50">
// //             🛒
// //             {count > 0 && (
// //               <span className="absolute -top-1 -right-1 text-xs bg-black text-white rounded-full px-1.5">
// //                 {count}
// //               </span>
// //             )}
// //           </Link>
// //         </div>
// //       </div>

// //       {/* Mobile search + suggestions */}
// //       {mobileSearchOpen && (
// //         <div className="lg:hidden border-t bg-white">
// //           <div ref={searchRef} className="max-w-6xl mx-auto px-4 py-3">
// //             <form onSubmit={submitSearch} className="flex gap-2">
// //               <input
// //                 value={q}
// //                 onChange={(e) => setQ(e.target.value)}
// //                 onKeyDown={onKeyDown}
// //                 onFocus={() => q.trim().length >= MIN_CHARS && setOpenSug(true)}
// //                 placeholder="Buscar productos o tiendas…"
// //                 className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2"
// //                 aria-label="Buscar en móvil"
// //               />
// //               <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Buscar</button>
// //             </form>

// //             {openSug && (
// //               <div
// //                 ref={popRef}
// //                 className="mt-2 bg-white border rounded-md shadow-lg z-30 max-h-[60vh] overflow-auto"
// //                 role="listbox"
// //               >
// //                 <SugContent
// //                   loading={loadingSug}
// //                   prodSug={prodSug}
// //                   storeSug={storeSug}
// //                   activeIdx={activeIdx}
// //                   setActiveIdx={setActiveIdx}
// //                   onPick={(to) => {
// //                     setOpenSug(false);
// //                     closeAllMobile();
// //                     navigate(to);
// //                   }}
// //                   onSeeAll={() => {
// //                     setOpenSug(false);
// //                     closeAllMobile();
// //                     submitSearch();
// //                   }}
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* Mobile off-canvas menu */}
// //       <MobileMenu
// //         open={mobileOpen}
// //         onClose={closeAllMobile}
// //         cats={cats}
// //         cartCount={count}
// //         isLogged={isLogged}
// //         onGoProfile={goToProfile}
// //       />
// //     </header>
// //   );
// // }

// // /* ---------- SUGGESTIONS UI ---------- */
// // function SugContent({ loading, prodSug, storeSug, activeIdx, setActiveIdx, onPick, onSeeAll }) {
// //   if (loading) {
// //     return <div className="p-4 text-sm text-gray-500">Buscando…</div>;
// //   }

// //   const total = (prodSug?.length || 0) + (storeSug?.length || 0);
// //   if (total === 0) {
// //     return (
// //       <div className="p-4 text-sm text-gray-500">
// //         Sin sugerencias. Presioná Enter para ver todos los resultados.
// //       </div>
// //     );
// //   }

// //   let idx = 0;
// //   return (
// //     <div>
// //       {prodSug?.length > 0 && (
// //         <div className="py-2">
// //           <div className="px-3 pb-1 text-xs uppercase text-gray-500">Productos</div>
// //           {prodSug.map((p) => {
// //             const my = idx++;
// //             const active = my === activeIdx;
// //             const img = p.imagenes?.find((x) => x.is_primary)?.url || p.imagenes?.[0]?.url || null;
// //             return (
// //               <button
// //                 key={`p-${p.id}`}
// //                 role="option"
// //                 aria-selected={active}
// //                 onMouseEnter={() => setActiveIdx(my)}
// //                 onMouseDown={(e) => {
// //                   e.preventDefault();
// //                   onPick(`/producto/${p.id}`);
// //                 }}
// //                 className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
// //                   active ? "bg-gray-50" : ""
// //                 }`}
// //               >
// //                 <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
// //                   {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : null}
// //                 </div>
// //                 <div className="min-w-0">
// //                   <div className="text-sm font-medium truncate">{p.nombre}</div>
// //                   <div className="text-xs text-gray-500 truncate">
// //                     {p.seller_nombre || "Producto"}
// //                   </div>
// //                 </div>
// //               </button>
// //             );
// //           })}
// //         </div>
// //       )}

// //       {storeSug?.length > 0 && (
// //         <div className="py-2 border-t">
// //           <div className="px-3 pb-1 text-xs uppercase text-gray-500">Tiendas</div>
// //           {storeSug.map((s) => {
// //             const my = idx++;
// //             const active = my === activeIdx;
// //             return (
// //               <button
// //                 key={`s-${s.id}`}
// //                 role="option"
// //                 aria-selected={active}
// //                 onMouseEnter={() => setActiveIdx(my)}
// //                 onMouseDown={(e) => {
// //                   e.preventDefault();
// //                   onPick(`/vendedor/${s.id}`);
// //                 }}
// //                 className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
// //                   active ? "bg-gray-50" : ""
// //                 }`}
// //               >
// //                 <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0" />
// //                 <div className="min-w-0">
// //                   <div className="text-sm font-medium truncate">
// //                     {s.nombre_fantasia || s.name || "Tienda"}
// //                   </div>
// //                   <div className="text-xs text-gray-500 truncate">Ver tienda</div>
// //                 </div>
// //               </button>
// //             );
// //           })}
// //         </div>
// //       )}

// //       <div className="border-t">
// //         <button
// //           onMouseDown={(e) => {
// //             e.preventDefault();
// //             onSeeAll();
// //           }}
// //           className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
// //         >
// //           Ver todos los resultados
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ---------- MOBILE MENU ---------- */
// // function MobileMenu({ open, onClose, cats, cartCount, isLogged, onGoProfile }) {
// //   return (
// //     <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
// //       <div
// //         className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
// //         onClick={onClose}
// //       />
// //       <aside
// //         className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl transform transition-transform ${
// //           open ? "translate-x-0" : "-translate-x-full"
// //         }`}
// //         role="dialog"
// //         aria-label="Menú de navegación"
// //       >
// //         <div className="p-4 border-b flex items-center justify-between">
// //           <span className="font-semibold">Menú</span>
// //           <button
// //             aria-label="Cerrar menú"
// //             onClick={onClose}
// //             className="px-2 py-1 rounded-md border hover:bg-gray-50"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         <nav className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
// //           <div className="flex items-center justify-between">
// //             <Link to="/carrito" onClick={onClose} className="relative px-3 py-2 rounded-md border hover:bg-gray-50">
// //               🛒 Carrito
// //               {cartCount > 0 && (
// //                 <span className="ml-2 text-xs bg-black text-white rounded-full px-1.5 align-middle">
// //                   {cartCount}
// //                 </span>
// //               )}
// //             </Link>

// //             {isLogged ? (
// //               <button onClick={() => { onClose(); onGoProfile(); }} className="px-3 py-2 rounded-md hover:bg-gray-50">
// //                 Mi perfil
// //               </button>
// //             ) : (
// //               <Link to="/login" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-gray-50">
// //                 Login
// //               </Link>
// //             )}
// //           </div>

// //           <Link to="/quiero-ser-socio" onClick={onClose} className="block px-3 py-2 rounded-md border hover:bg-gray-50">
// //             Quiero ser socio
// //           </Link>

// //           <div>
// //             <div className="text-xs uppercase text-gray-500 mb-2">Categorías</div>
// //             <ul className="space-y-1">
// //               {cats.map((c) => (
// //                 <li key={c.id}>
// //                   <Link
// //                     to={`/c/${encodeURIComponent(String(c.nombre || "").toLowerCase())}`}
// //                     onClick={onClose}
// //                     className="block px-3 py-2 rounded-md hover:bg-gray-50"
// //                   >
// //                     {c.nombre}
// //                   </Link>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           <div>
// //             <div className="text-xs uppercase text-gray-500 mb-2">Enlaces</div>
// //             <ul className="space-y-1">
// //               <li>
// //                 <Link to="/" onClick={onClose} className="block px-3 py-2 rounded-md hover:bg-gray-50">
// //                   Inicio
// //                 </Link>
// //               </li>
// //               <li>
// //                 <Link to="/buscar" onClick={onClose} className="block px-3 py-2 rounded-md hover:bg-gray-50">
// //                   Buscar
// //                 </Link>
// //               </li>
// //             </ul>
// //           </div>
// //         </nav>
// //       </aside>
// //     </div>
// //   );
// // }
// import { useEffect, useRef, useState } from "react";
// import { listarCompat } from "../api/products";
// import { useNavigate } from "react-router-dom";

// export default function NavBar() {
//   const [term, setTerm] = useState("");
//   const [sugs, setSugs] = useState([]);
//   const nav = useNavigate();
//   const tRef = useRef(null);

//   useEffect(() => {
//     if (!term || term.length < 2) {
//       setSugs([]);
//       return;
//     }
//     const ctl = new AbortController();
//     listarCompat({ q: term, order: "nuevos", limit: 8 })
//       .then((res) => {
//         const arr = Array.isArray(res.data) ? res.data : (res.data?.results || []);
//         setSugs(arr);
//       })
//       .catch(() => {})
//     return () => ctl.abort();
//   }, [term]);

//   const submit = (e) => {
//     e.preventDefault();
//     const q = term.trim();
//     if (!q) return;
//     setSugs([]);
//     nav(`/buscar?q=${encodeURIComponent(q)}`);
//   };

//   return (
//     <header className="bg-black/30 backdrop-blur sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
//         <div className="font-bold">IntiShop</div>
//         <form onSubmit={submit} className="flex-1 relative">
//           <input
//             ref={tRef}
//             className="w-full px-3 py-2 rounded-lg bg-white/5"
//             placeholder="Buscar productos…"
//             value={term}
//             onChange={(e) => setTerm(e.target.value)}
//           />
//           {sugs.length > 0 && (
//             <div className="absolute left-0 right-0 top-[110%] bg-neutral-900 border border-white/10 rounded-xl p-2">
//               {sugs.map((s) => (
//                 <button
//                   key={s.id}
//                   type="button"
//                   onClick={() => nav(`/producto/${s.id}`)}
//                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
//                 >
//                   {s.nombre}
//                 </button>
//               ))}
//             </div>
//           )}
//         </form>
//       </div>
//     </header>
//   );
// }
// src/components/Navbar.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";     // público (sin Authorization)
import axiosAuth from "../api/axiosConfig";       // con Authorization cuando exista
import { useCart } from "./CartContext";

const DEBOUNCE_MS = 400;
const MIN_CHARS = 2;

/* Helpers */
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
  if (!payload?.exp) return true; // si no hay exp, asumimos válido
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

export default function NavBar() {
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Autocomplete
  const [loadingSug, setLoadingSug] = useState(false);
  const [prodSug, setProdSug] = useState([]);
  const [storeSug, setStoreSug] = useState([]);
  const [openSug, setOpenSug] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Auth state
  const [isLogged, setIsLogged] = useState(tokenIsValid());
  const [role, setRole] = useState(isLogged ? guessRoleFromToken() : null);
  const [roleLoading, setRoleLoading] = useState(false);

  const searchRef = useRef(null);
  const popRef = useRef(null);
  const debounceRef = useRef(null);
  const reqIdRef = useRef(0);
  const cacheRef = useRef(new Map());

  const navigate = useNavigate();
  const { search } = useLocation();
  const { count } = useCart();

  // Mantener auth state actualizado
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

  // Categorías (público)
  useEffect(() => {
    let mounted = true;
    axiosPublic
      .get("products/categorias/")
      .then((r) => mounted && setCats(r.data || []))
      .catch(() => setCats([]));
    return () => {
      mounted = false;
    };
  }, []);

  // Mantener query en input si venimos de /buscar
  useEffect(() => {
    const params = new URLSearchParams(search);
    setQ(params.get("q") || "");
  }, [search]);

  const closeAllMobile = () => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  };

  // ---------- AUTOCOMPLETE ----------
  const combined = useMemo(() => {
    const prods = (prodSug || []).map((p) => ({
      kind: "product",
      id: p.id,
      label: p.nombre,
      subtitle: p.seller_nombre || "Producto",
      to: `/producto/${p.id}`,
      img: p.imagenes?.find((i) => i.is_primary)?.url || p.imagenes?.[0]?.url || null,
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
          `products/tienda/productos/?search=${encodeURIComponent(
            query
          )}&ordering=-creado&limit=12`
        )
        .catch(() => ({ data: [] }));

      if (myId !== reqIdRef.current) return;

      const list = Array.isArray(pr.data?.results) ? pr.data.results : pr.data || [];
      const prods = list.slice(0, 5);

      const storeMap = new Map();
      for (const p of list) {
        const id = p.seller_id ?? p.seller?.id;
        const name = p.seller_nombre ?? p.seller?.nombre_fantasia ?? p.seller?.name;
        if (id && name && !storeMap.has(id)) storeMap.set(id, { id, nombre_fantasia: name });
        if (storeMap.size >= 5) break;
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

  // Debounce input
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
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Cerrar dropdown al click afuera
  useEffect(() => {
    function onClickOutside(e) {
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
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [openSug]);

  const navigateTo = (to) => {
    setOpenSug(false);
    closeAllMobile();
    navigate(to);
  };

  const submitSearch = (e) => {
    e?.preventDefault?.();
    const query = q.trim();
    if (!query) return;
    navigateTo(`/buscar?q=${encodeURIComponent(query)}`);
  };

  // ⇢ Resolver ruta de perfil según rol (con verificación para socio)
  const goToProfile = async () => {
    if (!isLogged) {
      return navigateTo("/login");
    }

    // Si ya sabemos el rol, usamos eso; si no, tratamos de pedirlo
    let r = role;
    if (!r && !roleLoading) {
      try {
        setRoleLoading(true);
        const me = await axiosAuth.get("users/me/");
        r = me.data?.role || null;
        setRole(r);
      } catch {
        // si falla, intentamos igual con el guess del token
        r = guessRoleFromToken();
        setRole(r);
      } finally {
        setRoleLoading(false);
      }
    }

    if (r === "admin") {
      return navigateTo("/admin");
    }

    if (r === "socio" || r === "vendedor") {
      try {
        await axiosAuth.get("sellers/mi-perfil/"); // 200 si existe
        return navigateTo("/socio/dashboard");
      } catch (e) {
        if (e?.response?.status === 404) return navigateTo("/socio/crear-perfil");
        return navigateTo("/socio/dashboard"); // fallback
      }
    }

    // cliente u otros
    return navigateTo("/dashboard-cliente");
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
        const item = combined[activeIdx];
        navigateTo(item.to);
      } else {
        submitSearch(e);
      }
    } else if (e.key === "Escape") {
      setOpenSug(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Hamburger (mobile) */}
        <button
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="lg:hidden px-2 py-1 rounded-md border hover:bg-gray-50"
        >
          ☰
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold"
          onClick={() => {
            setOpenSug(false);
            closeAllMobile();
          }}
        >
          IntiShop
        </Link>

        {/* Categorías (desktop) */}
        <div className="relative group hidden lg:block">
          <button className="px-3 py-2 rounded-md hover:bg-gray-100" aria-haspopup="true">
            Categorías
          </button>
          <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-md shadow-md z-20 max-h-[70vh] overflow-auto min-w-56">
            {cats.map((c) => (
              <Link
                key={c.id}
                to={`/c/${encodeURIComponent(String(c.nombre || "").toLowerCase())}`}
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={() => setOpenSug(false)}
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </div>

        {/* Search (desktop) */}
        <div ref={searchRef} className="relative hidden lg:flex flex-1">
          <form onSubmit={submitSearch} className="flex-1 flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => q.trim().length >= MIN_CHARS && setOpenSug(true)}
              placeholder="Buscar productos o tiendas…"
              className="flex-1 border rounded-l-md px-3 py-2 outline-none focus:ring-2"
              aria-label="Buscar"
              aria-autocomplete="list"
            />
            <button className="px-4 py-2 border border-l-0 rounded-r-md hover:bg-gray-50">
              Buscar
            </button>
          </form>

          {/* Sugerencias (desktop) */}
          {openSug && (
            <div
              ref={popRef}
              className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-30 max-h-[70vh] overflow-auto"
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

        {/* Mobile search toggle */}
        <button
          aria-label="Buscar"
          className="lg:hidden ml-auto px-2 py-1 rounded-md border hover:bg-gray-50"
          onClick={() => setMobileSearchOpen((v) => !v)}
        >
          🔎
        </button>

        {/* Acciones (desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/quiero-ser-socio" className="px-3 py-2 rounded-md border hover:bg-gray-50">
            Quiero ser socio
          </Link>

          {/* Si no está logueado: Login; si está logueado: Mi perfil (dinámico) */}
          {isLogged ? (
            <button
              onClick={goToProfile}
              className="px-3 py-2 rounded-md hover:bg-gray-50"
              disabled={roleLoading}
            >
              {roleLoading ? "Cargando…" : "Mi perfil"}
            </button>
          ) : (
            <Link to="/login" className="px-3 py-2 rounded-md hover:bg-gray-50">
              Login
            </Link>
          )}

          <Link to="/carrito" className="relative px-3 py-2 rounded-md hover:bg-gray-50">
            🛒
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-black text-white rounded-full px-1.5">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search + suggestions */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t bg-white">
          <div ref={searchRef} className="max-w-6xl mx-auto px-4 py-3">
            <form onSubmit={submitSearch} className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => q.trim().length >= MIN_CHARS && setOpenSug(true)}
                placeholder="Buscar productos o tiendas…"
                className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2"
                aria-label="Buscar en móvil"
              />
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Buscar</button>
            </form>

            {openSug && (
              <div
                ref={popRef}
                className="mt-2 bg-white border rounded-md shadow-lg z-30 max-h-[60vh] overflow-auto"
                role="listbox"
              >
                <SugContent
                  loading={loadingSug}
                  prodSug={prodSug}
                  storeSug={storeSug}
                  activeIdx={activeIdx}
                  setActiveIdx={setActiveIdx}
                  onPick={(to) => {
                    setOpenSug(false);
                    closeAllMobile();
                    navigate(to);
                  }}
                  onSeeAll={() => {
                    setOpenSug(false);
                    closeAllMobile();
                    submitSearch();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile off-canvas menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={closeAllMobile}
        cats={cats}
        cartCount={count}
        isLogged={isLogged}
        onGoProfile={goToProfile}
      />
    </header>
  );
}

/* ---------- SUGGESTIONS UI ---------- */
function SugContent({ loading, prodSug, storeSug, activeIdx, setActiveIdx, onPick, onSeeAll }) {
  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Buscando…</div>;
  }

  const total = (prodSug?.length || 0) + (storeSug?.length || 0);
  if (total === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Sin sugerencias. Presioná Enter para ver todos los resultados.
      </div>
    );
  }

  let idx = 0;
  return (
    <div>
      {prodSug?.length > 0 && (
        <div className="py-2">
          <div className="px-3 pb-1 text-xs uppercase text-gray-500">Productos</div>
          {prodSug.map((p) => {
            const my = idx++;
            const active = my === activeIdx;
            const img = p.imagenes?.find((x) => x.is_primary)?.url || p.imagenes?.[0]?.url || null;
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
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
                  active ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{p.nombre}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {p.seller_nombre || "Producto"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {storeSug?.length > 0 && (
        <div className="py-2 border-t">
          <div className="px-3 pb-1 text-xs uppercase text-gray-500">Tiendas</div>
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
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
                  active ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {s.nombre_fantasia || s.name || "Tienda"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">Ver tienda</div>
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
          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
        >
          Ver todos los resultados
        </button>
      </div>
    </div>
  );
}

/* ---------- MOBILE MENU ---------- */
function MobileMenu({ open, onClose, cats, cartCount, isLogged, onGoProfile }) {
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Menú de navegación"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <span className="font-semibold">Menú</span>
          <button
            aria-label="Cerrar menú"
            onClick={onClose}
            className="px-2 py-1 rounded-md border hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
          <div className="flex items-center justify-between">
            <Link to="/carrito" onClick={onClose} className="relative px-3 py-2 rounded-md border hover:bg-gray-50">
              🛒 Carrito
              {cartCount > 0 && (
                <span className="ml-2 text-xs bg-black text-white rounded-full px-1.5 align-middle">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLogged ? (
              <button onClick={() => { onClose(); onGoProfile(); }} className="px-3 py-2 rounded-md hover:bg-gray-50">
                Mi perfil
              </button>
            ) : (
              <Link to="/login" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-gray-50">
                Login
              </Link>
            )}
          </div>

          <Link to="/quiero-ser-socio" onClick={onClose} className="block px-3 py-2 rounded-md border hover:bg-gray-50">
            Quiero ser socio
          </Link>

          <div>
            <div className="text-xs uppercase text-gray-500 mb-2">Categorías</div>
            <ul className="space-y-1">
              {cats.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/c/${encodeURIComponent(String(c.nombre || "").toLowerCase())}`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-500 mb-2">Enlaces</div>
            <ul className="space-y-1">
              <li>
                <Link to="/" onClick={onClose} className="block px-3 py-2 rounded-md hover:bg-gray-50">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/buscar" onClick={onClose} className="block px-3 py-2 rounded-md hover:bg-gray-50">
                  Buscar
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </div>
  );
}
