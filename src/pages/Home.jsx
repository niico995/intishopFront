// // // // src/pages/Home.jsx
// // // import { useEffect, useState } from "react";
// // // import axios from "../api/axiosConfig";
// // // import ProductCard from "../components/PorductCard";

// // // export default function Home() {
// // //   const [data, setData] = useState(null);

// // //   useEffect(() => {
// // //     axios.get("products/home/destacados/").then(r => setData(r.data)).catch(() => setData(null));
// // //   }, []);

// // //   if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

// // //   return (
// // //     <div className="max-w-6xl mx-auto">
// // //       {/* Banner principal */}
// // //       <div className="p-4">
// // //         <div className="w-full aspect-[16/5] bg-gray-100 rounded-xl overflow-hidden">
// // //           {data.banner_principal?.[0] ? (
// // //             <img src={data.banner_principal[0].imagen_url} alt="" className="w-full h-full object-cover" />
// // //           ) : null}
// // //         </div>
// // //       </div>

// // //       {/* PRO */}
// // //       <section className="p-4">
// // //         <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           {data.productos_pro?.map(p => <ProductCard key={p.id} product={p} />)}
// // //         </div>
// // //       </section>

// // //       {/* Banner intermedio */}
// // //       <div className="p-4">
// // //         <div className="w-full aspect-[5/1] bg-gray-100 rounded-xl overflow-hidden">
// // //           {data.banner_intermedio?.[0] ? (
// // //             <img src={data.banner_intermedio[0].imagen_url} alt="" className="w-full h-full object-cover" />
// // //           ) : null}
// // //         </div>
// // //       </div>

// // //       {/* MEDIO/BÁSICO */}
// // //       <section className="p-4">
// // //         <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           {data.productos_medios_o_basicos?.map(p => <ProductCard key={p.id} product={p} />)}
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }
// // // src/pages/Home.jsx
// // // import { useEffect, useState } from "react";
// // // import axios from "../api/axiosConfig";
// // // import ProductCard from "../components/PorductCard";
// // // import { Swiper, SwiperSlide } from "swiper/react";
// // // import { Autoplay } from "swiper/modules";
// // // import "swiper/css";
// // // import "swiper/css/autoplay";

// // // function BannerBlock({ items = [], className = "" }) {
// // //   if (!Array.isArray(items) || items.length === 0) return null;
// // //   const multi = items.length > 1;

// // //   return (
// // //     <div className={`w-full ${className}`}>
// // //       <div className="w-full aspect-[3/1] bg-gray-100 rounded-xl overflow-hidden">
// // //         <Swiper
// // //           modules={[Autoplay]}
// // //           slidesPerView={1}
// // //           spaceBetween={10}
// // //           autoplay={multi ? { delay: 3500, disableOnInteraction: false } : false}
// // //           className="w-full h-full"
// // //         >
// // //           {items.map((b, i) => {
// // //             const url = b.imagen_url || b.url || b;
// // //             const link = b.link || null;
// // //             const title = b.titulo || b.alt || `Banner ${i + 1}`;

// // //             const content = (
// // //               <picture>
// // //                 <source srcSet={url} type="image/webp" />
// // //                 <img
// // //                   src={url}
// // //                   alt={title}
// // //                   className="w-full h-full object-cover"
// // //                   loading={i === 0 ? "eager" : "lazy"}
// // //                   decoding="async"
// // //                   sizes="(min-width:1024px) 1200px, 100vw"
// // //                 />
// // //               </picture>
// // //             );

// // //             return (
// // //               <SwiperSlide key={b.id || i}>
// // //                 {link ? (
// // //                   <a href={link} target="_blank" rel="noopener noreferrer" aria-label={title}>
// // //                     {content}
// // //                   </a>
// // //                 ) : (
// // //                   content
// // //                 )}
// // //               </SwiperSlide>
// // //             );
// // //           })}
// // //         </Swiper>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default function Home() {
// // //   const [data, setData] = useState(null);

// // //   useEffect(() => {
// // //     axios
// // //       .get("products/home/destacados/")
// // //       .then((r) => setData(r.data))
// // //       .catch(() => setData(null));
// // //   }, []);

// // //   if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

// // //   return (
// // //     <div className="max-w-6xl mx-auto">
// // //       {/* Banner principal (3:1) */}
// // //       <div className="p-4">
// // //         <BannerBlock items={data.banner_principal || []} />
// // //       </div>

// // //       {/* PRO */}
// // //       <section className="p-4">
// // //         <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           {data.productos_pro?.map((p) => (
// // //             <ProductCard key={p.id} product={p} />
// // //           ))}
// // //         </div>
// // //       </section>

// // //       {/* Banner intermedio (3:1) */}
// // //       <div className="p-4">
// // //         <BannerBlock items={data.banner_intermedio || []} />
// // //       </div>

// // //       {/* MEDIO/BÁSICO */}
// // //       <section className="p-4">
// // //         <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           {data.productos_medios_o_basicos?.map((p) => (
// // //             <ProductCard key={p.id} product={p} />
// // //           ))}
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }


// // // ..................--------------------------------------



// // // import { useEffect, useState } from "react";
// // // import axiosPublic from "../api/axiosPublic";
// // // import ProductCard from "../components/PorductCard"; // 👈 corregido el typo del import
// // // import { Swiper, SwiperSlide } from "swiper/react";
// // // import { Autoplay } from "swiper/modules";
// // // import "swiper/css";
// // // import "swiper/css/autoplay";

// // // function BannerBlock({ items = [], className = "" }) {
// // //   if (!Array.isArray(items) || items.length === 0) return null;
// // //   const multi = items.length > 1;

// // //   return (
// // //     <div className={`w-full ${className}`}>
// // //       <div className="w-full aspect-[3/1] bg-gray-100 rounded-xl overflow-hidden">
// // //         <Swiper
// // //           modules={[Autoplay]}
// // //           slidesPerView={1}
// // //           spaceBetween={10}
// // //           autoplay={multi ? { delay: 3500, disableOnInteraction: false } : false}
// // //           className="w-full h-full"
// // //         >
// // //           {items.map((b, i) => {
// // //             const url = b.imagen_url || b.url || b;
// // //             const link = b.link || null;
// // //             const title = b.titulo || b.alt || `Banner ${i + 1}`;

// // //             const content = (
// // //               <picture>
// // //                 <source srcSet={url} type="image/webp" />
// // //                 <img
// // //                   src={url}
// // //                   alt={title}
// // //                   className="w-full h-full object-cover"
// // //                   loading={i === 0 ? "eager" : "lazy"}
// // //                   decoding="async"
// // //                   sizes="(min-width:1024px) 1200px, 100vw"
// // //                 />
// // //               </picture>
// // //             );

// // //             return (
// // //               <SwiperSlide key={b.id || i}>
// // //                 {link ? (
// // //                   <a href={link} target="_blank" rel="noopener noreferrer" aria-label={title}>
// // //                     {content}
// // //                   </a>
// // //                 ) : (
// // //                   content
// // //                 )}
// // //               </SwiperSlide>
// // //             );
// // //           })}
// // //         </Swiper>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default function Home() {
// // //   const [data, setData] = useState(null);

// // //   useEffect(() => {
// // //     axiosPublic
// // //       .get("products/home/destacados/")
// // //       .then((r) => setData(r.data))
// // //       .catch(() => setData(null));
// // //   }, []);

// // //   if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

// // //   return (
// // //     <div className="max-w-6xl mx-auto">
// // //       {/* Banner principal (3:1) */}
// // //       <div className="p-4">
// // //         <BannerBlock items={data.banner_principal || []} />
// // //       </div>

// // //       {/* PRO */}
// // //       <section className="p-4">
// // //         <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           {data.productos_pro?.map((p) => (
// // //             <ProductCard key={p.id} product={p} />
// // //           ))}
// // //         </div>
// // //       </section>

// // //       {/* Banner intermedio (3:1) */}
// // //       <div className="p-4">
// // //         <BannerBlock items={data.banner_intermedio || []} />
// // //       </div>

// // //       {/* MEDIO/BÁSICO */}
// // //       <section className="p-4">
// // //         <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           {data.productos_medios_o_basicos?.map((p) => (
// // //             <ProductCard key={p.id} product={p} />
// // //           ))}
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }




// // import { useEffect, useState } from "react";
// // import ProductCard from "../components/PorductCard"
// // import { getHomeDestacados, getBannersPublicos } from "../api/products";

// // const precioFmt = (v) => {
// //   const n = Number(v ?? 0);
// //   return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
// // };

// // export default function Home() {
// //   const [items, setItems] = useState([]);
// //   const [bannerPrincipal, setBannerPrincipal] = useState(null);
// //   const [bannerIntermedio, setBannerIntermedio] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     let alive = true;

// //     Promise.all([getHomeDestacados({ limit: 12 }), getBannersPublicos()])
// //       .then(([resProds, resBanners]) => {
// //         // Productos
// //         const arr = Array.isArray(resProds.data) ? resProds.data : (resProds.data?.results || []);
// //         const norm = arr.map((p) => ({
// //           ...p,
// //           imagenes: p.primary_image ? [{ id: `prim-${p.id}`, url: p.primary_image, is_primary: true }] : (p.imagenes || []),
// //         }));
// //         if (!alive) return;
// //         setItems(norm);

// //         // Banners
// //         const banners = Array.isArray(resBanners.data) ? resBanners.data : [];
// //         const principal = banners.find((b) => b.posicion === "principal");
// //         const intermedio = banners.find((b) => b.posicion === "intermedio");
// //         setBannerPrincipal(principal || null);
// //         setBannerIntermedio(intermedio || null);
// //       })
// //       .catch((e) => {
// //         console.error("Home error:", e?.response?.data || e?.message);
// //       })
// //       .finally(() => alive && setLoading(false));

// //     return () => { alive = false; };
// //   }, []);

// //   return (
// //     <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
// //       {bannerPrincipal && (
// //         <a href={bannerPrincipal.link || "#"} target={bannerPrincipal.link ? "_blank" : "_self"} rel="noreferrer">
// //           {/* eslint-disable-next-line jsx-a11y/alt-text */}
// //           <img src={bannerPrincipal.imagen_url} className="w-full rounded-2xl object-cover" />
// //         </a>
// //       )}

// //       <section>
// //         <h2 className="text-xl font-semibold mb-4">Destacados</h2>
// //         {loading ? (
// //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
// //             {Array.from({ length: 8 }).map((_, i) => (
// //               <div key={i} className="animate-pulse rounded-2xl bg-gray-800/40 h-64" />
// //             ))}
// //           </div>
// //         ) : items.length === 0 ? (
// //           <div className="text-sm text-gray-400">Sin destacados por ahora.</div>
// //         ) : (
// //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
// //             {items.map((p) => (
// //               <ProductCard key={p.id} product={p} />
// //             ))}
// //           </div>
// //         )}
// //       </section>

// //       {bannerIntermedio && (
// //         <a href={bannerIntermedio.link || "#"} target={bannerIntermedio.link ? "_blank" : "_self"} rel="noreferrer">
// //           {/* eslint-disable-next-line jsx-a11y/alt-text */}
// //           <img src={bannerIntermedio.imagen_url} className="w-full rounded-2xl object-cover" />
// //         </a>
// //       )}
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import axiosPublic from "../api/axiosPublic";
// import ProductCard from "../components/PorductCard"; // 👈 corregido el typo del import
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/autoplay";

// function BannerBlock({ items = [], className = "" }) {
//   if (!Array.isArray(items) || items.length === 0) return null;
//   const multi = items.length > 1;

//   return (
//     <div className={`w-full ${className}`}>
//       <div className="w-full aspect-[3/1] bg-gray-100 rounded-xl overflow-hidden">
//         <Swiper
//           modules={[Autoplay]}
//           slidesPerView={1}
//           spaceBetween={10}
//           autoplay={multi ? { delay: 3500, disableOnInteraction: false } : false}
//           className="w-full h-full"
//         >
//           {items.map((b, i) => {
//             const url = b.imagen_url || b.url || b;
//             const link = b.link || null;
//             const title = b.titulo || b.alt || `Banner ${i + 1}`;

//             const content = (
//               <picture>
//                 <source srcSet={url} type="image/webp" />
//                 <img
//                   src={url}
//                   alt={title}
//                   className="w-full h-full object-cover"
//                   loading={i === 0 ? "eager" : "lazy"}
//                   decoding="async"
//                   sizes="(min-width:1024px) 1200px, 100vw"
//                 />
//               </picture>
//             );

//             return (
//               <SwiperSlide key={b.id || i}>
//                 {link ? (
//                   <a href={link} target="_blank" rel="noopener noreferrer" aria-label={title}>
//                     {content}
//                   </a>
//                 ) : (
//                   content
//                 )}
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     axiosPublic
//       .get("products/home/destacados/")
//       .then((r) => setData(r.data))
//       .catch(() => setData(null));
//   }, []);

//   if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Banner principal (3:1) */}
//       <div className="p-4">
//         <BannerBlock items={data.banner_principal || []} />
//       </div>

//       {/* PRO */}
//       <section className="p-4">
//         <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {data.productos_pro?.map((p) => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>
//       </section>

//       {/* Banner intermedio (3:1) */}
//       <div className="p-4">
//         <BannerBlock items={data.banner_intermedio || []} />
//       </div>

//       {/* MEDIO/BÁSICO */}
//       <section className="p-4">
//         <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {data.productos_medios_o_basicos?.map((p) => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

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
        const data = await api("/api/products/home/destacados/");
        if (abort) return;
        setPro(data?.pro || []);
        setOtros(data?.otros || []);
      } catch (err) {
        if (abort) return;
        // Mostramos error pero NO rompemos la app (evita “e is not defined”)
        setErrMsg(err?.message || "Error cargando destacados");
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
              <Link key={p.id} to={`/producto/${p.id}`} className="border rounded p-3 hover:shadow-sm">
                <div className="text-sm font-medium truncate">{p.nombre}</div>
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
              <Link key={p.id} to={`/producto/${p.id}`} className="border rounded p-3 hover:shadow-sm">
                <div className="text-sm font-medium truncate">{p.nombre}</div>
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
