// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import ProductCard from "../components/PorductCard";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [pro, setPro] = useState([]);
  const [otros, setOtros] = useState([]);

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await axios.get("/products/home/destacados/");
        if (abort) return;

        // Acepto claves nuevas o viejas para evitar romper compatibilidad
        const arrPro =
          data?.pro || data?.productos_pro || data?.destacados_pro || [];
        const arrOtros =
          data?.otros ||
          data?.productos_medios_o_basicos ||
          data?.destacados_otros ||
          [];

        setPro(Array.isArray(arrPro) ? arrPro : []);
        setOtros(Array.isArray(arrOtros) ? arrOtros : []);
      } catch (e) {
        if (!abort)
          setErr(
            e?.response?.data?.detail ||
              e?.message ||
              "Error cargando destacados"
          );
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {err && (
        <div className="rounded border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      {/* Productos Pro */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Productos Pro
        </h2>
        {loading ? (
          <div className="text-center">Cargando…</div>
        ) : pro.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pro.map((p) => (
              <ProductCard key={p.id ?? p.slug ?? p.nombre} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center">
            Sin productos por ahora.
          </div>
        )}
      </section>

      {/* Otros productos */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Otros productos
        </h2>
        {loading ? (
          <div className="text-center">Cargando…</div>
        ) : otros.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otros.map((p) => (
              <ProductCard key={p.id ?? p.slug ?? p.nombre} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center">
            Sin productos por ahora.
          </div>
        )}
      </section>
    </div>
  );
}
