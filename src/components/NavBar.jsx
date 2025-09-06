import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "../context/AuthContext";
import { getCategorias } from "../api/products";

/** Badge carrito */
function CartBadge({ count = 0 }) {
  return (
    <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-[20px] text-[11px] rounded-full bg-black text-white px-1">
      {count}
    </span>
  );
}

function Drawer({ open, onClose, children }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white z-50 transform transition-transform duration-200 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {children}
      </aside>
    </>
  );
}

function CategoriesList({ onItemClick }) {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    getCategorias()
      .then(({ data }) => setCats(Array.isArray(data) ? data : []))
      .catch((e)=>console.error("Categorias error:", e?.message||e));
  }, []);
  return (
    <ul className="space-y-1">
      {cats.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">Sin categorías</li>}
      {cats.map((c) => (
        <li key={c.id || c.nombre || c.name}>
          <Link
            to={`/c/${encodeURIComponent(c.nombre || c.name)}`}
            className="block px-3 py-2 rounded-md hover:bg-gray-100"
            onClick={onItemClick}
          >
            {c.nombre || c.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function NavBar() {
  const { items } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, it) => acc + Number(it.qty || 1), 0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [q, setQ] = useState("");

  const catsRef = useRef(null);
  useEffect(() => {
    const onOutside = (e) => { if (catsRef.current && !catsRef.current.contains(e.target)) setCatsOpen(false); };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const submitSearch = (e) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/buscar?q=${encodeURIComponent(term)}`);
    setShowMobileSearch(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center gap-2">
        <button className="lg:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={() => setDrawerOpen(true)} aria-label="Menú">
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" /></svg>
        </button>

        <Link to="/" className="text-lg font-semibold tracking-tight select-none">IntiShop</Link>

        <form onSubmit={submitSearch} className="hidden lg:flex ml-4 flex-1 items-center gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && submitSearch(e)} placeholder="Buscar productos o tiendas..." className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20" />
          <button className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50">Buscar</button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button className="lg:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={() => setShowMobileSearch(v=>!v)} aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          </button>

          <Link to="/registro/socio" className="hidden lg:inline-flex px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">Quiero ser socio</Link>

          {usuario ? (
            <Link className="hidden sm:inline-flex px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" to="/perfil">Perfil</Link>
          ) : (
            <Link className="hidden sm:inline-flex px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" to="/login">Login</Link>
          )}

          <Link to="/carrito" className="inline-flex items-center px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-12zM6 6l-2-2H2" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            <CartBadge count={cartCount} />
          </Link>
        </div>
      </div>

      <div className="hidden lg:block border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div ref={catsRef} className="relative inline-block" onMouseEnter={()=>setCatsOpen(true)} onMouseLeave={()=>setCatsOpen(false)}>
            <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>setCatsOpen(v=>!v)}>
              Categorías
              <svg width="14" height="14" viewBox="0 0 20 20"><path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
            {catsOpen && (
              <div className="absolute left-0 mt-2 w-96 max-h-[70vh] overflow-auto bg-white shadow-xl rounded-lg z-30 p-2 ring-1 ring-black/5">
                <CategoriesList onItemClick={()=>setCatsOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileSearch && (
        <div className="lg:hidden border-t border-gray-100 px-3 pb-3">
          <form onSubmit={submitSearch} className="flex items-center gap-2 pt-3">
            <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && submitSearch(e)} placeholder="Buscar productos o tiendas..." className="w-full px-3 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 text-base" />
            <button className="px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50">Buscar</button>
          </form>
        </div>
      )}

      <Drawer open={drawerOpen} onClose={()=>setDrawerOpen(false)}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <span className="font-semibold">Menú</span>
          <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>setDrawerOpen(false)} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">Categorías</p>
            <CategoriesList onItemClick={()=>setDrawerOpen(false)} />
          </div>
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <Link to="/registro/socio" className="block px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>setDrawerOpen(false)}>Quiero ser socio</Link>
            {usuario ? (
              <Link to="/perfil" className="block px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>setDrawerOpen(false)}>Perfil</Link>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>setDrawerOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
}
