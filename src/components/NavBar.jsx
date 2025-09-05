import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { api } from "../lib/api";

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    let abort = false;

    (async () => {
      try {
        const data = await axiosInstance.get("/api/products/categorias/");
        if (!abort) setCats(Array.isArray(data) ? data : []);
      } catch (err) {
        // no rompemos la UI si falla
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
      className="relative hidden lg:block select-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      onTouchStart={() => setOpen((v) => !v)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
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
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            IntiShop
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <CategoriesMenu />
          {/* tus otros botones: Login, Carrito, etc. */}
        </div>
      </div>
    </header>
  );
}
