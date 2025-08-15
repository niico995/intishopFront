import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosPublic from '../api/axiosPublic';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Helmet } from 'react-helmet-async';

const currency = (v) =>
  Number(v).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

export default function ProductPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosPublic.get(`products/tienda/producto/${id}/`);
        setProducto(res.data);
      } catch (e) {
        setError('No se pudo cargar el producto');
      }
    };
    load();
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!producto) return <div className="p-6">Cargando producto…</div>;

  const imgs = Array.isArray(producto.imagenes) ? producto.imagenes : [];
  const cuota = Number(producto.precio || 0) / 4;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: String(producto.precio || 0),
      availability: (producto.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    image: imgs.map(i => i.url),
    sku: String(producto.id),
    brand: producto.seller_nombre || 'Vendedor',
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Helmet>
        <title>{producto.nombre} | SantiagoShop</title>
        <meta name="description" content={producto.descripcion?.slice(0, 160)} />
        <link rel="canonical" href={`${window.location.origin}/producto/${producto.id}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* carrusel */}
        <div className="w-full">
          <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-80 rounded overflow-hidden">
            {imgs.length ? imgs.map(img => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.url}
                  alt={producto.nombre}
                  className="w-full h-80 object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </SwiperSlide>
            )) : (
              <SwiperSlide>
                <div className="w-full h-80 flex items-center justify-center bg-gray-100 text-gray-400">
                  Sin imágenes
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* info */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold mb-2">{producto.nombre}</h1>
          <div className="text-gray-600 mb-4">
            {producto.categorias?.length ? (
              <span>Categorías: {producto.categorias.join(', ')}</span>
            ) : null}
          </div>

          <div className="flex items-baseline gap-3 mb-3">
            <div className="text-3xl font-bold">{currency(producto.precio)}</div>
            <div className="text-gray-600">4 cuotas de {currency(cuota)}</div>
          </div>

          <div className="mb-3">
            <span className={`px-2 py-1 rounded text-sm ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
            </span>
          </div>

          <p className="whitespace-pre-wrap text-gray-800 mb-4">
            {producto.descripcion}
          </p>

          {producto.seller_id && (
            <div className="mb-6">
              <span className="text-gray-600 mr-2">Vendido por</span>
              <Link to={`/vendedor/${producto.seller_id}`} className="text-blue-600 hover:underline">
                {producto.seller_nombre || 'Vendedor'}
              </Link>
            </div>
          )}

          {/* placeholder para botón carrito (lo mejoramos luego) */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
