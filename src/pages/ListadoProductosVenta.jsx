// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from '../api/axiosConfig';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import axiosPublic from '../api/axiosPublic';

// const currency = (v) =>
//   Number(v).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

// const ListadoProductosVenta = ({ onAgregar }) => {
//   const [productos, setProductos] = useState([]);

//   useEffect(() => {
//     getProductos();
//   }, []);
// console.log('axiosPublic baseURL ->', axiosPublic.defaults.baseURL);
// const getProductos = async () => {
//   try {
//     const res = await axiosPublic.get('products/tienda/productos/');
    
//     setProductos(res.data || []);
//   } catch (err) {
//     console.error('Error cargando productos', err);
//     setProductos([]);
//   }
// };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {productos.map((prod) => {
//         const imgs = Array.isArray(prod.imagenes) ? prod.imagenes : [];
//         const precioNum = Number(prod.precio) || 0;
//         const cuota = precioNum / 4;

//         return (
//           <div
//             key={prod.id}
//             className="border rounded-lg shadow p-4 flex flex-col min-w-0 overflow-hidden"
//           >
//             {/* 1️⃣ Carrusel de imágenes (evita overflow) */}
//             <div className="relative w-full h-48 overflow-hidden rounded">
//               <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-48">
//                 {imgs.length > 0 ? (
//                   imgs.map((img) => (
//                     <SwiperSlide key={img.id}>
//                       <img
//                         src={img.url}
//                         alt={prod.nombre}
//                         className="w-full h-48 object-cover block"
//                         draggable={false}
//                       />
//                     </SwiperSlide>
//                   ))
//                 ) : (
//                   <SwiperSlide>
//                     <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
//                       Sin imágenes
//                     </div>
//                   </SwiperSlide>
//                 )}
//               </Swiper>
//             </div>

//             {/* 4️⃣ Link al detalle del producto */}
//             <Link to={`/producto/${prod.id}`} className="mt-3 font-bold text-lg hover:underline truncate">
//               {prod.nombre}
//             </Link>

//             {/* 3️⃣ Nombre del vendedor + link */}
//             {prod.seller_nombre && prod.seller_id && (
//               <Link
//                 to={`/vendedor/${prod.seller_id}`}
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 {prod.seller_nombre}
//               </Link>
//             )}

//             {/* 2️⃣ Precio total + precio en 4 cuotas */}
//             <div className="mt-2">
//               <span className="text-xl font-bold">{currency(precioNum)}</span>
//               <span className="ml-3 text-gray-600">
//                 {`4 cuotas de ${currency(cuota)}`}
//               </span>
//             </div>

//             {/* Botón agregar al carrito */}
//             <button
//               onClick={() => onAgregar(prod)}
//               className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Agregar al carrito
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ListadoProductosVenta;
import { useEffect, useState } from "react";
import ProductCard from "../components/PorductCard";
import { listarCompat } from "../api/products";

export default function ListadoProductosVenta({ q, categoriaId, sellerId, limit = 24, order = "nuevos" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const params = { limit, order };
    if (q) params.q = q;
    if (categoriaId) params.categoria = categoriaId;
    if (sellerId) params.seller = sellerId;

    listarCompat(params)
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const norm = arr.map((p) => ({
          ...p,
          imagenes: Array.isArray(p.imagenes)
            ? p.imagenes
            : (p.primary_image ? [{ id: `prim-${p.id}`, url: p.primary_image, is_primary: true }] : []),
        }));
        if (alive) setItems(norm);
      })
      .catch((e) => console.error(e))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [q, categoriaId, sellerId, limit, order]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-gray-800/40 h-64" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-sm text-gray-400">No hay productos.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
