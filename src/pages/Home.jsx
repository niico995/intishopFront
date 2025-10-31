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
// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import ProductCard from "../components/PorductCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

/* ====== Helpers ====== */
const pickImg = (x) =>
  x?.imagen_url || x?.image_url || x?.imagen || x?.image || x?.url || x?.src ||
  (typeof x === "string" ? x : null);

const hasImgs = (arr) => Array.isArray(arr) && arr.some((i) => !!pickImg(i));

/* ====== HERO ====== */
function Hero({ slides = [] }) {
  const hasSlides = hasImgs(slides);
  const first = slides?.[0] || {};

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "80vh", minHeight: "600px" }} // altura garantizada
    >
      {hasSlides ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop
          autoplay={slides.length > 1 ? { delay: 4500, disableOnInteraction: false } : false}
          className="absolute inset-0 h-full w-full"
        >
          {slides.map((b, i) => {
            const src = pickImg(b);
            return (
              <SwiperSlide key={b.id || i} className="relative h-full w-full">
                <img src={src} alt={b?.titulo || `Banner ${i + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/35" />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        // Fallback visible si no hay banners
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-zinc-800" />
      )}

      {/* Contenido centrado (siempre visible) */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <h2 className="mb-6 text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl">
            {first?.titulo || "Todo lo que necesitás, en un solo lugar."}
          </h2>
          <Link
            to={first?.cta_link || "/tienda"}
            className="inline-block rounded-md border-2 border-[#FFB800] px-6 py-3 font-semibold text-white transition hover:bg-[#FFB800] hover:text-black"
          >
            {first?.cta_text || "Nuestros productos"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ====== TARJETA "PAGÁ EN CUOTAS" ====== */
function PaymentCard() {
  return (
    <div className="bg-black py-4 text-center text-lg font-semibold tracking-wide text-[#FFB800]">
      💳 Pagá en cuotas
    </div>
  );
}

/* ====== CATEGORÍAS (sin imágenes, solo texto) ====== */
function CategoryMosaic({ cats = [] }) {
  if (!Array.isArray(cats) || cats.length === 0) return null;

  const featured = cats.slice(0, 3);
  const main = featured[0];
  const others = featured.slice(1);

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Principal grande */}
          {main && (
            <Link
              to={`/c/${encodeURIComponent(main.nombre || "")}`}
              className="flex h-[320px] items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF7B00] to-[#FFB800] text-center text-3xl font-bold text-white transition hover:brightness-110"
            >
              {main.nombre}
            </Link>
          )}

          {/* Dos secundarias */}
          <div className="grid grid-rows-2 gap-4">
            {others.map((c) => (
              <Link
                key={c.id}
                to={`/c/${encodeURIComponent(c.nombre || "")}`}
                className="flex h-[150px] items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF7B00] to-[#FFB800] text-center text-xl font-semibold text-white transition hover:brightness-110"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== BANNER INTERMEDIO (de products/banners/) ====== */
function MidBanner({ slides = [] }) {
  if (!hasImgs(slides)) return null;

  return (
    <section className="relative w-full py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop
            autoplay={slides.length > 1 ? { delay: 4000, disableOnInteraction: false } : false}
            className="h-[220px] sm:h-[260px] md:h-[320px]"
          >
            {slides.map((b, i) => {
              const src = pickImg(b);
              return (
                <SwiperSlide key={b.id || i} className="relative">
                  <img src={src} alt={b?.titulo || `Banner intermedio ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
                  {b?.titulo && (
                    <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
                      <h3 className="text-2xl font-semibold text-white drop-shadow-lg md:text-3xl">
                        {b.titulo}
                      </h3>
                    </div>
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

/* ====== HOME PAGE ====== */
export default function Home() {
  const [heroSlides, setHeroSlides] = useState([]);   // products/banners/ → banner_principal
  const [midSlides, setMidSlides] = useState([]);     // products/banners/ → banner_intermedio
  const [prods, setProds] = useState([]);             // products/home/destacados/ → productos_pro
  const [cats, setCats] = useState([]);               // products/categorias/

  useEffect(() => {
    // ✅ BANNERS PÚBLICOS (UNA SOLA RUTA)
    axiosPublic
      .get("products/banners/")
      .then((r) => {
        // Esperamos algo tipo { banner_principal: [...], banner_intermedio: [...] }
        const bp = Array.isArray(r.data?.banner_principal) ? r.data.banner_principal : [];
        const bi = Array.isArray(r.data?.banner_intermedio) ? r.data.banner_intermedio : [];
        setHeroSlides(bp);
        setMidSlides(bi);
      })
      .catch(() => {
        setHeroSlides([]);
        setMidSlides([]);
      });

    // ✅ DESTACADOS (socios Pro)
    axiosPublic
      .get("products/home/destacados/")
      .then((r) => setProds(r.data?.productos_pro || []))
      .catch(() => setProds([]));

    // ✅ CATEGORÍAS
    axiosPublic
      .get("products/categorias/")
      .then((r) => setCats(r.data || []))
      .catch(() => setCats([]));
  }, []);

  return (
    <div className="w-full">
      {/* HERO (toma banner_principal) */}
      <Hero slides={heroSlides} />

      {/* Tarjeta cuotas */}
      <PaymentCard />

      {/* Categorías (texto con degradado naranja/amarillo) */}
      <CategoryMosaic cats={cats} />

      {/* Banner intermedio (toma banner_intermedio) */}
      <MidBanner slides={midSlides} />

      {/* Productos más vendidos */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Nuestros productos más vendidos</h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#FFB800]" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {prods.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
