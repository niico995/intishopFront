import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosConfig";

const fmtPrice = (v) => Number(v ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
        const { data } = await axios.get("/products/home/destacados/");
        if (abort) return;
        setPro(data?.pro || data?.productos_pro || []);
        setOtros(data?.otros || data?.productos_medios_o_basicos || []);
      } catch (e) {
        if (!abort) setErrMsg(e?.response?.data?.detail || e?.message || "Error cargando destacados");
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  if (loading) return <div className="p-4 text-center">Cargando…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {errMsg && <div className="rounded border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-sm">{errMsg}</div>}

      <Bloque titulo="Productos Pro" items={pro} />
      <Bloque titulo="Otros productos" items={otros} />
    </div>
  );
}

function Bloque({ titulo, items }) {
  const fmt = (v) =>
    Number(v ?? 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{titulo}</h2>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Sin productos por ahora.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((p) => {
            const precioFinal = p.precio ?? p.precio_base ?? 0;
            const cuota = precioFinal / 4;
            return (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                className="group border rounded p-3 hover:shadow-sm"
              >
                <div className="text-sm font-medium truncate">{p.nombre}</div>
                <div className="text-xs text-gray-500 truncate">
                  {p.seller_nombre || "-"}
                </div>
                <div className="mt-1 text-lg font-semibold">
                  ${fmt(precioFinal)}
                </div>
                <div className="text-xs text-gray-500">
                  En 4 cuotas de ${fmt(cuota)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

