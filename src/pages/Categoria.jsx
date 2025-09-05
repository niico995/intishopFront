// // src/pages/Categoria.jsx
// import { useEffect, useState, useMemo } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import axios from "../api/axiosConfig";
// import ProductCard from "../components/PorductCard";

// export default function Categoria() {
//   const { slug } = useParams();
//   const nombreCategoria = useMemo(() => decodeURIComponent(slug).toLowerCase(), [slug]);
//   const [params, setParams] = useSearchParams();

//   const [productos, setProductos] = useState([]);
//   const [count, setCount] = useState(0);
//   const page = Number(params.get("page") || 1);
//   const ordering = params.get("ordering") || ""; // precio | -precio | creado | -creado

//   useEffect(() => {
//     let cancel = false;
//     async function run() {
//       const url = `products/tienda/productos/?categoria=${encodeURIComponent(nombreCategoria)}&page=${page}${ordering ? `&ordering=${ordering}` : ""}`;
//       const r = await axios.get(url);
//       if (!cancel) {
//         const data = r.data.results ? r.data : { results: r.data, count: (r.data?.length || 0) };
//         setProductos(data.results);
//         setCount(data.count);
//       }
//     }
//     run();
//     return () => { cancel = true; };
//   }, [nombreCategoria, page, ordering]);

//   const setOrdering = (ord) => {
//     const next = new URLSearchParams(params);
//     if (ord) next.set("ordering", ord); else next.delete("ordering");
//     next.set("page", "1");
//     setParams(next);
//   };

//   const totalPages = Math.max(1, Math.ceil(count / 24));

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-xl font-semibold mb-4">Categoría: {nombreCategoria}</h1>

//       <div className="mb-4 flex items-center gap-2">
//         <span className="text-sm">Ordenar por:</span>
//         <select
//           value={ordering}
//           onChange={(e) => setOrdering(e.target.value)}
//           className="border rounded-md px-2 py-1 text-sm"
//         >
//           <option value="">Recientes</option>
//           <option value="precio">Precio ↑</option>
//           <option value="-precio">Precio ↓</option>
//           <option value="creado">Más antiguos</option>
//           <option value="-creado">Más recientes</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {productos.map(p => <ProductCard key={p.id} product={p} />)}
//       </div>

//       <div className="mt-6 flex items-center justify-center gap-2">
//         <button
//           disabled={page <= 1}
//           onClick={() => setParams({ page: String(page - 1), ordering })}
//           className="px-3 py-1.5 border rounded-md disabled:opacity-50"
//         >
//           ← Anterior
//         </button>
//         <span className="text-sm">{page} / {totalPages}</span>
//         <button
//           disabled={page >= totalPages}
//           onClick={() => setParams({ page: String(page + 1), ordering })}
//           className="px-3 py-1.5 border rounded-md disabled:opacity-50"
//         >
//           Siguiente →
//         </button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { listarCategorias, listarPublicos } from "../api/products";
import ProductCard from "../components/PorductCard"
import { useParams, useSearchParams } from "react-router-dom";

const ORDER_MAP = {
  "nuevos": "nuevos",
  "antiguos": "antiguos",
  "precio-asc": "precio_asc",
  "precio-desc": "precio_desc",
  "az": "az",
  "za": "za",
};

export default function Categoria() {
  const { nombre } = useParams(); // /categoria/:nombre (slug o nombre exacto)
  const [sp, setSp] = useSearchParams();
  const orderParam = sp.get("order") || "nuevos";
  const page = Number(sp.get("page") || 1);

  const [catId, setCatId] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const order = useMemo(() => ORDER_MAP[orderParam] || "nuevos", [orderParam]);

  useEffect(() => {
    let alive = true;
    // 1) Traer categorías y resolver ID por nombre/slug
    listarCategorias()
      .then((res) => {
        const cats = res.data || [];
        const found =
          cats.find((c) => (c.nombre || "").toLowerCase() === (nombre || "").toLowerCase()) ||
          cats.find((c) => (c.nombre || "").toLowerCase().replace(/\s+/g, "-") === (nombre || "").toLowerCase());
        setCatId(found?.id || null);
      })
      .catch((e) => console.error("categorías error:", e?.response?.data || e?.message));
    return () => { alive = false; };
  }, [nombre]);

  useEffect(() => {
    let alive = true;
    if (!catId) {
      setItems([]);
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    listarPublicos({ categoria: catId, page, order })
      .then((res) => {
        const data = res.data;
        const results = Array.isArray(data) ? data : (data?.results || []);
        setItems(results);
        setCount(data?.count ?? results.length);
      })
      .catch((e) => console.error("categoria error:", e?.response?.data || e?.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [catId, page, order]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Categoría: {nombre}</h1>
        <select
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
          value={orderParam}
          onChange={(e) => {
            sp.set("order", e.target.value);
            sp.set("page", "1");
            setSp(sp, { replace: true });
          }}
        >
          <option value="nuevos">Nuevos</option>
          <option value="antiguos">Antiguos</option>
          <option value="precio-asc">Precio ↑</option>
          <option value="precio-desc">Precio ↓</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-800/40 h-64" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-400">No hay productos en esta categoría.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* paginado simple */}
          <div className="flex items-center gap-2 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => {
                sp.set("page", String(page - 1));
                setSp(sp, { replace: true });
              }}
              className="px-3 py-2 rounded-lg bg-white/5 disabled:opacity-40"
            >Anterior</button>
            <span className="text-xs text-gray-400">
              Página {page} · {count} resultados
            </span>
            <button
              disabled={items.length === 0 || items.length < 20}
              onClick={() => {
                sp.set("page", String(page + 1));
                setSp(sp, { replace: true });
              }}
              className="px-3 py-2 rounded-lg bg-white/5 disabled:opacity-40"
            >Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}
