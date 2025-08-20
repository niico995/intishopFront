// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import ProductCard from "../components/PorductCard";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("products/home/destacados/").then(r => setData(r.data)).catch(() => setData(null));
  }, []);

  if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Banner principal */}
      <div className="p-4">
        <div className="w-full aspect-[16/5] bg-gray-100 rounded-xl overflow-hidden">
          {data.banner_principal?.[0] ? (
            <img src={data.banner_principal[0].imagen_url} alt="" className="w-full h-full object-cover" />
          ) : null}
        </div>
      </div>

      {/* PRO */}
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.productos_pro?.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banner intermedio */}
      <div className="p-4">
        <div className="w-full aspect-[5/1] bg-gray-100 rounded-xl overflow-hidden">
          {data.banner_intermedio?.[0] ? (
            <img src={data.banner_intermedio[0].imagen_url} alt="" className="w-full h-full object-cover" />
          ) : null}
        </div>
      </div>

      {/* MEDIO/BÁSICO */}
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.productos_medios_o_basicos?.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
