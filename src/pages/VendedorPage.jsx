// src/pages/VendedorPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosPublic from '../api/axiosPublic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Helmet } from 'react-helmet-async';

const currency = (v) =>
  Number(v).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

export default function VendedorPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, pRes] = await Promise.all([
          axiosPublic.get(`sellers/public/${id}/`),
          axiosPublic.get(`products/tienda/productos/?seller=${id}`),
        ]);
        setSeller(vRes.data);
        setProductos(pRes.data?.results || pRes.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [id]);

  const hasBanners = Array.isArray(seller?.banners) && seller.banners.length > 0;
  const useAutoplay = useMemo(() => hasBanners && seller.banners.length > 1, [hasBanners, seller]);

  if (!seller) return <div className="p-6">Cargando vendedor…</div>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seller.nombre_fantasia || seller.nombre || 'Vendedor',
    url: typeof window !== 'undefined' ? window.location.href : '',
    logo: seller.avatar_url || undefined,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Helmet>
        <title>{(seller.nombre_fantasia || seller.nombre || 'Vendedor') + ' | SantiagoShop'}</title>
        <meta name="description" content={(seller.bio || seller.descripcion || '').slice(0, 160)} />
        <link rel="canonical" href={`${window.location.origin}/vendedor/${id}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Header vendedor */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        {seller.avatar_url && (
          <img
            src={seller.avatar_url}
            alt="avatar"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {seller.nombre_fantasia || seller.nombre || 'Vendedor'}
          </h1>
          {seller.bio && <p className="text-gray-700 text-sm sm:text-base">{seller.bio}</p>}
        </div>
      </div>

      {/* Banners o fallback */}
      {hasBanners ? (
        <div className="mb-6 sm:mb-8">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={useAutoplay ? { delay: 3500, disableOnInteraction: false } : false}
            className="w-full rounded overflow-hidden"
          >
            {seller.banners.map((b, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-40 sm:h-56 lg:h-72 bg-gray-100">
                  <img
                    src={b.url || b}
                    alt={`banner-${i}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="mb-6 sm:mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            {seller.nombre_fantasia || seller.nombre || 'Vendedor'}
          </h2>
          {seller.bio && <p className="mt-2 text-white/90 max-w-2xl">{seller.bio}</p>}
        </div>
      )}

      {/* Productos del vendedor */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Productos</h2>
        <span className="text-sm text-gray-500">{productos.length} resultado(s)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {productos.map((prod) => {
          const img = prod.imagenes?.[0]?.url;
          return (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}
              className="border rounded-lg shadow-sm hover:shadow transition block"
            >
              <div className="w-full h-44 sm:h-48 bg-gray-50 rounded-t overflow-hidden">
                {img ? (
                  <img src={img} alt={prod.nombre} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="font-semibold truncate">{prod.nombre}</div>
                <div className="text-gray-700">{currency(prod.precio)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
