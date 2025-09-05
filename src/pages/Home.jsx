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

import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

// ⚠️ Si tu componente está guardado como ProductCard.jsx,
// cambiá este import a:  import ProductCard from "../components/ProductCard";
import ProductCard from "../components/PorductCard";

function BannerStrip({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
      {items.map((b) => (
        <a
          key={b.id}
          href={b.link || "#"}
          target={b.link ? "_blank" : undefined}
          rel="noreferrer"
          className="block rounded-lg overflow-hidden border"
        >
          <img
            src={b.imagen_url}
            alt={b.titulo || "Banner"}
            className="w-full h-40 md:h-56 object-cover"
            // si la URL está caída o hay mixed-content, ocultamos el <img> roto
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const [destacados, setDestacados] = useState([]);          // ahora es ARRAY
  const [banners, setBanners] = useState({ principal: [], intermedio: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);

        // 1) Productos destacados (el back devuelve array simple)
        const r1 = await axios.get("products/home/destacados/");
        const d1 = r1.data;

        // tolerante: acepta formato nuevo (array) y el viejo (objeto con key productos_medios_o_basicos)
        const productos = Array.isArray(d1)
          ? d1
          : Array.isArray(d1?.productos_medios_o_basicos)
          ? d1.productos_medios_o_basicos
          : [];

        // 2) Banners públicos
        const r2 = await axios.get("products/banners/publico/");
        const d2 = Array.isArray(r2.data) ? r2.data : [];
        const principal = d2.filter((b) => b.posicion === "principal");
        const intermedio = d2.filter((b) => b.posicion === "intermedio");

        if (!mounted) return;
        setDestacados(productos);
        setBanners({ principal, intermedio });
      } catch (e) {
        console.error("Home load error:", e);
        if (!mounted) return;
        setDestacados([]);
        setBanners({ principal: [], intermedio: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Banners superiores */}
      <BannerStrip items={banners.principal} />

      {/* Destacados */}
      <section className="mt-2">
        <h2 className="text-xl font-semibold mb-3">Destacados</h2>
        {Array.isArray(destacados) && destacados.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {destacados.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Sin productos por ahora.</div>
        )}
      </section>

      {/* Banners intermedios */}
      <BannerStrip items={banners.intermedio} />
    </div>
  );
}
