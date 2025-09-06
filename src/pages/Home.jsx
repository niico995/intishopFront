import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [pro, setPro] = useState([]);
  const [otros, setOtros] = useState([]);

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        // El baseURL ya incluye /api; NO anteponer /api aquí
        const r = await axiosInstance.get("/products/home/destacados/");
        if (abort) return;
        const d = r?.data || {};
        // Soportar varias claves posibles del back
        setPro(d.pro || d.pros || d.productos_pro || []);
        setOtros(d.otros || d.productos || d.no_pro || []);
      } catch (err) {
        if (abort) return;
        setErrMsg(err?.response?.data?.detail || err?.message || "Error cargando destacados");
        setPro([]);
        setOtros([]);
        console.error("Home destacados:", err);
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {errMsg && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-sm">
          {errMsg}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Productos Pro</h2>
        {pro.length === 0 ? (
          <div className="text-sm text-gray-500">Sin productos por ahora.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pro.map((p) => (
              <Link key={p.id || p.slug || p.nombre} to={`/producto/${p.id || p.slug}`} className="border rounded p-3 hover:shadow-sm">
                <div className="text-sm font-medium truncate">{p.nombre || p.title}</div>
                <div className="text-xs text-gray-500 truncate">{p.proveedor || "-"}</div>
                <div className="mt-1 text-green-700 font-semibold">${p.precio_base ?? p.precio}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Otros productos</h2>
        {otros.length === 0 ? (
          <div className="text-sm text-gray-500">Sin productos por ahora.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {otros.map((p) => (
              <Link key={p.id || p.slug || p.nombre} to={`/producto/${p.id || p.slug}`} className="border rounded p-3 hover:shadow-sm">
                <div className="text-sm font-medium truncate">{p.nombre || p.title}</div>
                <div className="text-xs text-gray-500 truncate">{p.proveedor || "-"}</div>
                <div className="mt-1 text-green-700 font-semibold">${p.precio_base ?? p.precio}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
