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
import ProductCard from "../components/PorductCard";
import { Link } from "react-router-dom";

/* ============ Utilidades pequeñas ============ */
const pickImg = (x) =>
  x?.imagen_url || x?.url || (typeof x === "string" ? x : null);

const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ============ HERO con imagen del admin + overlay + título/CTA ============ */
function PageHero({ image, title, ctaText = "Nuestros productos", ctaHref = "/tienda" }) {
  return (
    <section className="relative h-[320px] sm:h-[420px] lg:h-[520px] w-full overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />
      {/* Texto centrado */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Todo lo que necesitás, en un solo lugar.
          </h1>
          <div className="mt-6">
            <Link
              to={ctaHref}
              className="inline-block rounded-md bg-white/90 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Badges (cuotas / débito / efectivo) ============ */
function TrustBadges() {
  const item = (icon, text) => (
    <div className="flex items-center gap-3 rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-black/5">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
  return (
    <div className="mx-auto -mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {item("💳", "Pagá en cuotas")}
        {item("🏧", "Tarjeta de débito")}
        {item("💵", "Efectivo")}
      </div>
    </div>
  );
}

/* ============ Mosaico de categorías (usa imágenes del admin) ============ */
/* Usamos 3 imágenes (si el admin subió menos, reusamos la primera).
   Los títulos y destinos son fijos (sin subcategorías nuevas). */
function CategoryMosaic({ images = [], categories = [] }) {
  // Títulos/destinos “como la referencia”
  const targets = useMemo(() => {
    const prefer = ["Herramientas", "Celulares", "Electrodomésticos"];
    // Buscamos esos nombres en tus categorías; si no, caemos al propio título.
    const toPath = (name) =>
      `/c/${slug(
        categories.find((c) => String(c.nombre).toLowerCase() === name.toLowerCase())
          ?.nombre || name
      )}`;
    return [
      { title: "Herramientas", href: toPath("Herramientas") },
      { title: "Celulares", href: toPath("Celulares") },
      { title: "Electrodomésticos", href: toPath("Electrodomésticos") },
    ];
  }, [categories]);

  const img0 = pickImg(images[0]) || pickImg(images[1]) || pickImg(images[2]) || null;
  const img1 = pickImg(images[1]) || img0;
  const img2 = pickImg(images[2]) || img0;

  const Tile = ({ src, title, href, className = "" }) => (
    <Link
      to={href}
      className={`group relative overflow-hidden rounded-2xl ring-1 ring-black/10 ${className}`}
    >
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-gray-200" />
      )}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 flex items-end">
        <div className="p-6">
          <div className="text-2xl font-extrabold text-white drop-shadow">{title}</div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Tile src={img0} title={targets[0].title} href={targets[0].href} className="h-[320px]" />
        <div className="grid grid-rows-2 gap-4">
          <Tile src={img1} title={targets[1].title} href={targets[1].href} className="h-[150px] md:h-[158px]" />
          <Tile src={img2} title={targets[2].title} href={targets[2].href} className="h-[150px] md:h-[158px]" />
        </div>
      </div>
    </div>
  );
}

/* ============ Fila de “beneficios” inferior ============ */
function ServiceRow() {
  const Box = ({ icon, title, text }) => (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
      <div className="text-2xl">{icon}</div>
      <div className="mt-3 text-sm font-semibold">{title}</div>
      <div className="mt-2 text-xs text-gray-600">{text}</div>
    </div>
  );
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Box
          icon="🚚"
          title="Envíos en toda Argentina"
          text="Recibí tu compra en cualquier lugar del país."
        />
        <Box
          icon="🛡️"
          title="Pagos 100% seguros"
          text="Transacciones protegidas para tu tranquilidad."
        />
        <Box
          icon="🔥"
          title="Ofertas irresistibles"
          text="Promos y precios especiales todas las semanas."
        />
        <Box
          icon="📦"
          title="Compra confiable"
          text="Productos seleccionados de vendedores verificados."
        />
      </div>
    </div>
  );
}

/* ============ HOME (todo dinámico con tus endpoints) ============ */
export default function Home() {
  const [data, setData] = useState(null);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    axiosPublic
      .get("products/home/destacados/")
      .then((r) => setData(r.data))
      .catch(() => setData(null));

    axiosPublic
      .get("products/categorias/")
      .then((r) => setCats(r.data || []))
      .catch(() => setCats([]));
  }, []);

  if (!data) return <div className="mx-auto max-w-7xl p-4">Cargando…</div>;

  const heroImg = pickImg((data.banner_principal || [])[0]);
  const tilesImgs = data.banner_intermedio || data.banner_principal || [];

  return (
    <div className="w-full">
      {/* 1) HERO como la referencia: imagen admin + overlay + CTA */}
      <PageHero image={heroImg} title="Todo lo que necesitás" />

      {/* 2) Badges/medios de pago */}
      <TrustBadges />

      {/* 3) Mosaico de categorías (sin subcategorías, con imágenes del admin) */}
      <CategoryMosaic images={tilesImgs} categories={cats} />

      {/* 4) Lista de “Nuestros productos más vendidos” -> socios TOP (productos_pro) */}
      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Nuestros productos más vendidos</h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gray-900/80" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(data.productos_pro || []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5) Banner intermedio (si el admin quiere otro bloque gráfico) */}
      {tilesImgs?.length > 0 && (
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
            <img
              src={pickImg(tilesImgs[0])}
              alt="Banner"
              className="h-[180px] w-full object-cover sm:h-[220px]"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* 6) Otra grilla (si querés mostrar más productos) — dejamos tu bloque de básicos/medios */}
      {Array.isArray(data.productos_medios_o_basicos) &&
        data.productos_medios_o_basicos.length > 0 && (
          <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Más productos</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {data.productos_medios_o_basicos.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      {/* 7) Fila de beneficios (como las cards de abajo en la referencia) */}
      <ServiceRow />
    </div>
  );
}
