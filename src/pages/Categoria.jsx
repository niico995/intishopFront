// src/pages/Categoria.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import ProductCard from "../components/PorductCard";

export default function Categoria() {
  const { slug } = useParams();
  const nombreCategoria = useMemo(() => decodeURIComponent(slug).toLowerCase(), [slug]);
  const [params, setParams] = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [count, setCount] = useState(0);
  const page = Number(params.get("page") || 1);
  const ordering = params.get("ordering") || ""; // precio | -precio | creado | -creado

  useEffect(() => {
    let cancel = false;
    async function run() {
      const url = `products/public/productos/?categoria=${encodeURIComponent(nombreCategoria)}&page=${page}${ordering ? `&ordering=${ordering}` : ""}`;
      const r = await axios.get(url);
      if (!cancel) {
        const data = r.data.results ? r.data : { results: r.data, count: (r.data?.length || 0) };
        setProductos(data.results);
        setCount(data.count);
      }
    }
    run();
    return () => { cancel = true; };
  }, [nombreCategoria, page, ordering]);

  const setOrdering = (ord) => {
    const next = new URLSearchParams(params);
    if (ord) next.set("ordering", ord); else next.delete("ordering");
    next.set("page", "1");
    setParams(next);
  };

  const totalPages = Math.max(1, Math.ceil(count / 24));

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Categoría: {nombreCategoria}</h1>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">Ordenar por:</span>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="">Recientes</option>
          <option value="precio">Precio ↑</option>
          <option value="-precio">Precio ↓</option>
          <option value="creado">Más antiguos</option>
          <option value="-creado">Más recientes</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {productos.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setParams({ page: String(page - 1), ordering })}
          className="px-3 py-1.5 border rounded-md disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span className="text-sm">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setParams({ page: String(page + 1), ordering })}
          className="px-3 py-1.5 border rounded-md disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
