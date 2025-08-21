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
import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import ProductCard from "../components/PorductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

function BannerBlock({ items = [], className = "" }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const multi = items.length > 1;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full aspect-[3/1] bg-gray-100 rounded-xl overflow-hidden">
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
                  className="w-full h-full object-cover"
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

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("products/home/destacados/")
      .then((r) => setData(r.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return <div className="max-w-6xl mx-auto p-4">Cargando…</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Banner principal (3:1) */}
      <div className="p-4">
        <BannerBlock items={data.banner_principal || []} />
      </div>

      {/* PRO */}
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-3">Destacados PRO</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.productos_pro?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Banner intermedio (3:1) */}
      <div className="p-4">
        <BannerBlock items={data.banner_intermedio || []} />
      </div>

      {/* MEDIO/BÁSICO */}
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-3">Otras tiendas</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.productos_medios_o_basicos?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
