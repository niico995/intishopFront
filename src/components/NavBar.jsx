import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { useCart } from "./CartContext";
import { useAuth } from "../context/AuthContext";

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const { data } = await axiosInstance.get("/api/products/categorias/");
        if (!abort) setCats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Categorias error:", err?.message || err);
      }
    })();
    const onDown = (ev) => {
      if (menuRef.current && !menuRef.current.contains(ev.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => {
      abort = true;
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      onTouchStart={() => setOpen((v) => !v)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
      >
        Categorías
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <ul className="absolute left-0 mt-2 w-72 max-h-[70vh] overflow-auto bg-white shadow-lg rounded-lg z-50 p-2 ring-1 ring-black/5">
          {cats.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500">Sin categorías</li>
          )}
          {cats.map((c) => (
            <li key={c.id}>
              <Link
                to={`/c/${encodeURIComponent(c.nombre || c.name)}`}
                className="block w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => setOpen(false)}
              >
                {c.nombre || c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NavBar() {
  const { items } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const count = items.reduce((acc, it) => acc + Number(it.qty || 1), 0);

  const doSearch = (e) => {
    e?.preventDefault();
    const term = (q || "").trim();
    if (!term) return;
    navigate(`/buscar?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold tracking-tight">IntiShop</Link>
        </div>

        {/* Categorías (lg) */}
        <div className="hidden lg:block">
          <CategoriesMenu />
        </div>

        {/* Search */}
        <form onSubmit={doSearch} className="flex-1 flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch(e)}
            placeholder="Buscar productos o tiendas..."
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Buscar
          </button>
        </form>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/registro/socio"
            className="hidden sm:inline-flex px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Quiero ser socio
          </Link>

          {usuario ? (
            <Link to="/perfil" className="px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
              Perfil
            </Link>
          ) : (
            <Link to="/login" className="px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
              Login
            </Link>
          )}

          <Link to="/carrito" className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
            <span className="mr-2">Carrito</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] text-xs rounded-full bg-black text-white">
              {count}
            </span>
          </Link>

          {/* Categorías botón en mobile */}
          <div className="lg:hidden">
            <CategoriesMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
