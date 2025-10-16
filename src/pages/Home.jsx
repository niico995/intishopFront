// // src/pages/Home.jsx
// import { useEffect, useState } from "react";
// import axios from "../api/axiosConfig";
// import ProductCard from "../components/PorductCard";

// export default function Home() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     axios.get("products/home/destacados/").then(r => setData(r.data)).catch(() => setData(null));
//   }, []);

//   if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Banner principal */}
//       <div className="p-4">
//         <div className="w-full aspect-[16/5] bg-gray-100 rounded-xl overflow-hidden">
//           {data.banner_principal?.[0] ? (
//             <img src={data.banner_principal[0].imagen_url} alt="" className="w-full h-full object-cover" />
//           ) : null}
//         </div>
//       </div>

//       {/* PRO */}
//       <section className="p-4">
//         <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {data.productos_pro?.map(p => <ProductCard key={p.id} product={p} />)}
//         </div>
//       </section>

//       {/* Banner intermedio */}
//       <div className="p-4">
//         <div className="w-full aspect-[5/1] bg-gray-100 rounded-xl overflow-hidden">
//           {data.banner_intermedio?.[0] ? (
//             <img src={data.banner_intermedio[0].imagen_url} alt="" className="w-full h-full object-cover" />
//           ) : null}
//         </div>
//       </div>

//       {/* MEDIO/BÁSICO */}
//       <section className="p-4">
//         <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {data.productos_medios_o_basicos?.map(p => <ProductCard key={p.id} product={p} />)}
//         </div>
//       </section>
//     </div>
//   );
// }
// src/pages/Home.jsx
// import { useEffect, useState } from "react";
// import axios from "../api/axiosConfig";
// import ProductCard from "../components/PorductCard";
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
//     axios
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
//===========================================
//===========================================
//===========================================
//===========================================
//===========================================
//===========================================
//===========================================
//===========================================
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

// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import ProductCard from "../components/PorductCard"; // 👈 respetamos tu card
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

/* ---------------------------
   UI Helpers (solo estética)
----------------------------*/
function SectionTitle({ children, rightLink }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold">{children}</h2>
      {rightLink ? (
        <a href={rightLink} className="text-sm font-medium underline">
          Ver todo
        </a>
      ) : null}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-xl border px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

/* ----------------------------------
   HERO (texto a la izquierda + banner)
   Mantiene 100% dinamismo desde admin
-----------------------------------*/
function HeroBlock({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  // Tomamos el primero para texto; mantenemos slideshow a la derecha
  const first = items[0] || {};
  const titulo = first.titulo || "Todo lo que necesitás, en un solo lugar";
  const subtitulo = first.subtitulo || "Tecnología, electro, hogar y más";
  const cta_text = first.cta_text || "Ver productos";
  const cta_link = first.cta_link || "/tienda";

  // normalizamos imágenes del slot para el carrusel (derecha)
  const slides = useMemo(
    () =>
      items.map((b, i) => ({
        id: b.id || i,
        src: b.imagen_url || b.url || b,
        alt: b.alt || b.titulo || `Banner ${i + 1}`,
        link: b.link || null,
      })),
    [items]
  );

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Columna izquierda: texto/CTA */}
        <div className="p-8 md:p-12 lg:p-14">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{titulo}</h1>
          <p className="mt-4 text-base md:text-lg opacity-80">{subtitulo}</p>
          <div className="mt-6">
            <a
              href={cta_link}
              className="inline-block rounded-2xl border px-5 py-2.5 font-medium hover:shadow"
            >
              {cta_text}
            </a>
          </div>

          {/* Badges de confianza (no cambian datos) */}
          <div className="mt-8 flex flex-wrap items-center gap-3 opacity-90">
            <Badge>Pagá en cuotas</Badge>
            <Badge>Débito / Efectivo</Badge>
            <Badge>Envíos a todo el país</Badge>
          </div>
        </div>

        {/* Columna derecha: slider de banners (admin) */}
        <div className="relative h-[260px] md:h-full">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={10}
            autoplay={slides.length > 1 ? { delay: 3500, disableOnInteraction: false } : false}
            className="absolute inset-0"
          >
            {slides.map((s, i) => {
              const content = (
                <picture>
                  <source srcSet={s.src} type="image/webp" />
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="h-full w-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    sizes="(min-width:1024px) 600px, 100vw"
                  />
                </picture>
              );
              return (
                <SwiperSlide key={s.id}>
                  {s.link ? (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.alt}>
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------
   BLOQUE DE BANNER (para intermedio)
   Mantiene tu dinámica 100%
-----------------------------------*/
function BannerBlock({ items = [], className = "" }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const multi = items.length > 1;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full aspect-[3/1] bg-gray-100 rounded-3xl border overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={10}
          autoplay={multi ? { delay: 3500, disableOnInteraction: false } : false}
          className="w-full h-full"
        >
          {items.map((b, i) => {
            const url = b.imagen_url || b.url || b;
            const link = b.link || null;
            const title = b.titulo || b.alt || `Banner ${i + 1}`;

            const content = (
              <picture>
                <source srcSet={url} type="image/webp" />
                <img
                  src={url}
                  alt={title}
                  className="h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  sizes="(min-width:1024px) 1200px, 100vw"
                />
              </picture>
            );

            return (
              <SwiperSlide key={b.id || i}>
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={title}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

/* ----------------------------------
   HOME (mismos endpoints/datos)
-----------------------------------*/
export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosPublic
      .get("products/home/destacados/")
      .then((r) => setData(r.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return <div className="mx-auto max-w-7xl p-4">Cargando…</div>;

  return (
    <div className="mx-auto max-w-7xl">
      {/* HERO principal (texto + slider admin) */}
      <div className="px-4 sm:px-6 lg:px-8">
        <HeroBlock items={data.banner_principal || []} />
      </div>

      {/* DESTACADOS PRO */}
      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <SectionTitle rightLink="/tienda">Destacados PRO</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.productos_pro?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BANNER INTERMEDIO (admin) */}
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <BannerBlock items={data.banner_intermedio || []} />
      </div>

      {/* OTRAS TIENDAS (medio/básico) */}
      <section className="px-4 sm:px-6 lg:px-8 mt-10 mb-12">
        <SectionTitle rightLink="/tienda">Otras tiendas</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.productos_medios_o_basicos?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
