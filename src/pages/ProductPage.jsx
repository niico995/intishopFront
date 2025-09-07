// src/pages/ProductPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useCart } from "../components/CartContext";
import AddToCartButton from "../components/AddToCartButton";

const fmt = (v) =>
  Number(v ?? 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function getSellerId(p) {
  return (
    p.seller_id ??
    p.sellerId ??
    p.sellerID ??
    p?.seller?.id ??
    p.tienda_id ??
    p?.tienda?.id ??
    p.vendedor_id ??
    p?.vendedor?.id ??
    null
  );
}

function getSellerName(p) {
  return (
    p.seller_nombre ??
    p.sellerName ??
    p?.seller?.nombre_fantasia ??
    p?.seller?.name ??
    p?.seller?.username ??
    p.tienda_nombre ??
    p?.tienda?.nombre_fantasia ??
    p?.tienda?.nombre ??
    p.vendedor_nombre ??
    p?.vendedor?.nombre ??
    p.proveedor ??
    ""
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const [qty, setQty] = useState(1);
  const [sel, setSel] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let abort = false;
    (async () => {
      setErr("");
      try {
        const { data } = await axios.get(`/products/tienda/producto/${id}/`);
        if (!abort) setP(data);
      } catch (e) {
        if (!abort)
          setErr(
            e?.response?.data?.detail ||
              e?.message ||
              "No pudimos cargar el producto."
          );
      }
    })();
    return () => {
      abort = true;
    };
  }, [id]);

  // Imágenes
  const imgs = useMemo(() => {
    const arr = [];
    if (Array.isArray(p?.imagenes)) {
      for (const im of p.imagenes) {
        if (typeof im === "string") arr.push(im);
        else if (im?.url) arr.push(im.url);
      }
    }
    if (p?.imagen_principal && arr.length === 0) arr.push(p.imagen_principal);
    return arr;
  }, [p]);

  const principal = imgs[sel ?? 0];

  // Stock y límites
  const stockValue = typeof p?.stock === "number" ? Math.max(0, p.stock) : null;
  const maxQty = stockValue ?? 99;
  const sinStock = stockValue !== null ? stockValue <= 0 : false;

  const clamp = (n) => Math.min(Math.max(1, Number.isFinite(n) ? n : 1), Math.max(1, maxQty));
  const onMinus = () => setQty((q) => clamp(q - 1));
  const onPlus  = () => setQty((q) => clamp(q + 1));
  const onChange = (e) => {
    const onlyDigits = String(e.target.value || "1").replace(/\D+/g, "");
    setQty(clamp(parseInt(onlyDigits || "1", 10)));
  };

  const addToCart = () => {
    if (!p || sinStock) return;
    addItem(
      {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        imagen_principal: principal || p.imagen_principal || null,
        seller_id: getSellerId(p) || undefined,
      },
      qty
    );
  };

  if (err)
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">{err}</div>
    );
  if (!p)
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">Cargando…</div>
    );

  const precio = p.precio ?? 0;
  const cuota4 = precio / 4;
  const sellerId = getSellerId(p);
  const sellerName = getSellerName(p);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <div className="rounded-2xl overflow-hidden border aspect-square bg-neutral-100">
          {principal && (
            <img
              src={principal}
              alt={p.nombre}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {imgs.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {imgs.map((u, idx) => (
              <button
                key={idx}
                onClick={() => setSel(idx)}
                className={
                  "border rounded overflow-hidden aspect-square " +
                  (sel === idx ? "ring-2 ring-black" : "")
                }
                aria-label={`Imagen ${idx + 1}`}
              >
                <img
                  src={u}
                  alt={`${p.nombre} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{p.nombre}</h1>

        <div className="opacity-70 text-sm">
          {sellerId ? (
            <Link
              to={`/vendedor/${sellerId}`}
              className="hover:underline"
              title="Ver vendedor"
            >
              {sellerName || "Vendedor"}
            </Link>
          ) : (
            sellerName || ""
          )}
        </div>

        <div className="mt-3 text-3xl font-semibold">${fmt(precio)}</div>
        <div className="text-sm text-gray-500">En 4 cuotas de ${fmt(cuota4)}</div>

        <p className="mt-4 whitespace-pre-wrap">{p.descripcion || ""}</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="inline-flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={onMinus}
              className="px-4 py-2 text-lg disabled:opacity-50"
              aria-label="Reducir cantidad"
              disabled={sinStock || qty <= 1}
            >
              -
            </button>
            <input
              className="w-12 text-center outline-none select-all"
              value={qty}
              onChange={onChange}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label="Cantidad"
            />
            <button
              onClick={onPlus}
              className="px-4 py-2 text-lg disabled:opacity-50"
              aria-label="Aumentar cantidad"
              disabled={sinStock || qty >= maxQty}
            >
              +
            </button>
          </div>

          <AddToCartButton onClick={addToCart} disabled={sinStock} />
        </div>

        {stockValue !== null ? (
          stockValue <= 0 ? (
            <div className="mt-2 text-sm text-red-600">Sin stock</div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">Stock: {stockValue}</div>
          )
        ) : null}
      </div>
    </div>
  );
}
