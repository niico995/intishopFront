// // src/pages/Buscar.jsx
// import { useEffect, useState } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import axios from "../api/axiosConfig";
// import ProductCard from "../components/PorductCard";

// export default function Buscar() {
//   const [params] = useSearchParams();
//   const q = params.get("q") || "";
//   const seller = params.get("seller");

//   const [productos, setProductos] = useState([]);
//   const [tiendas, setTiendas] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancel = false;
//     (async () => {
//       setLoading(true);
//       try {
//         const url = seller
//           ? `products/tienda/productos/?seller=${seller}`
//           : `products/tienda/productos/?search=${encodeURIComponent(q)}&ordering=-creado`;

//         const r = await axios.get(url);
//         const list = r.data?.results ? r.data.results : (r.data || []);
//         if (cancel) return;

//         setProductos(list);

//         // Si no filtramos por seller puntual, derivar tiendas de los productos
//         if (!seller) {
//           const map = new Map();
//           for (const p of list) {
//             const id = p.seller_id ?? p.seller?.id;
//             const name = p.seller_nombre ?? p.seller?.nombre_fantasia ?? p.seller?.name;
//             if (id && name && !map.has(id)) map.set(id, { id, nombre_fantasia: name });
//             if (map.size >= 12) break;
//           }
//           setTiendas(Array.from(map.values()));
//         } else {
//           setTiendas([]);
//         }
//       } finally {
//         if (!cancel) setLoading(false);
//       }
//     })();
//     return () => { cancel = true; };
//   }, [q, seller]);

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-xl font-semibold mb-4">
//         {seller ? "Productos de la tienda" : `Resultados para: "${q}"`}
//       </h1>

//       {!seller && (
//         <>
//           <h2 className="font-semibold mb-2">Tiendas</h2>
//           {tiendas.length === 0 ? (
//             <div className="text-sm text-gray-500 mb-6">No se encontraron tiendas.</div>
//           ) : (
//             <ul className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
//               {tiendas.map(t => (
//                 <li key={t.id} className="border rounded-lg p-3 flex items-center justify-between">
//                   <div>
//                     <div className="font-medium">{t.nombre_fantasia}</div>
//                     <div className="text-xs text-gray-500">Ver productos del vendedor</div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Link to={`/vendedor/${t.id}`} className="text-sm px-3 py-1.5 border rounded-md hover:bg-gray-50">
//                       Ver tienda
//                     </Link>
//                     <Link to={`/buscar?seller=${t.id}`} className="text-sm px-3 py-1.5 border rounded-md hover:bg-gray-50">
//                       Ver productos
//                     </Link>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}

//       <h2 className="font-semibold mb-2">Productos</h2>
//       {loading ? (
//         <div>Cargando…</div>
//       ) : productos.length === 0 ? (
//         <div className="text-sm text-gray-500">No se encontraron productos.</div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {productos.map(p => <ProductCard key={p.id} product={p} />)}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import ProductCard from "../components/PorductCard"
import { listarCompat } from "../api/products";
import { useSearchParams } from "react-router-dom";

export default function Buscar() {
  const [params] = useSearchParams();
  const term = params.get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const q = term.trim();
    listarCompat({ q, order: "nuevos", limit: 24 })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const norm = arr.map((p) => ({
          ...p,
          imagenes: p.primary_image ? [{ id: `prim-${p.id}`, url: p.primary_image, is_primary: true }] : (p.imagenes || []),
        }));
        if (alive) setItems(norm);
      })
      .catch((e) => console.error("Buscar error:", e?.response?.data || e?.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [term]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Resultados de “{term}”</h1>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-800/40 h-64" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-400">No se encontraron productos.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
