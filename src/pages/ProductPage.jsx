import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useCart } from "../components/CartContext";
import AddToCartButton from "../components/AddToCartButton";

const fmtARS = (v) =>
  Number(v ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [error, setError] = useState("");
  const [qtyStr, setQtyStr] = useState("1");
  const [selIdx, setSelIdx] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let abort = false;
    (async () => {
      setError("");
      try {
        const { data } = await axios.get(`/products/tienda/producto/${id}/`);
        if (!abort) setP(data);
      } catch (e) {
        if (!abort) setError(e?.response?.data?.detail || e?.message || "No pudimos cargar el producto.");
      }
    })();
    return () => { abort = true; };
  }, [id]);

  const parseClamp = (s) => {
    const n = Math.max(1, Math.min(99, parseInt(String(s || "1").replace(/\D+/g, ""), 10) || 1));
    return n;
  };

  const stockValue = useMemo(() => (typeof p?.stock === "number" ? p.stock : null), [p]);
  const hasStockNumber = typeof stockValue === "number";
  const sinStock = hasStockNumber ? stockValue <= 0 : false;

  const allImages = useMemo(() => {
    const imgs = [];
    if (Array.isArray(p?.imagenes)) {
      for (const im of p.imagenes) {
        if (typeof im === "string") imgs.push(im);
        else if (im?.url) imgs.push(im.url);
      }
    }
    if (p?.imagen_principal && !imgs.length) imgs.push(p.imagen_principal);
    return imgs;
  }, [p]);

  const primary = useMemo(() => allImages[selIdx ?? 0] ?? null, [allImages, selIdx]);

  const step = (delta) => setQtyStr((s) => String(parseClamp((parseInt(s || "1", 10) || 1) + delta)));
  const addToCart = () => {
    if (!p) return;
    addItem(
      {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        imagen_principal: primary || p.imagen_principal || null,
      },
      parseClamp(qtyStr)
    );
  };

  if (error) return <div className="max-w-5xl mx-auto px-4 py-10 text-center">{error}</div>;
  if (!p) return <div className="max-w-5xl mx-auto px-4 py-10 text-center">Cargando…</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <div className="rounded-2xl overflow-hidden border aspect-square bg-neutral-100">
          {primary && <img src={primary} alt={p.nombre} className="w-full h-full object-cover" />}
        </div>

        {allImages.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {allImages.map((u, idx) => (
              <button
                key={idx}
                onClick={() => setSelIdx(idx)}
                className={"border rounded overflow-hidden aspect-square " + (selIdx === idx ? "ring-2 ring-black" : "")}
              >
                <img src={u} alt={p.nombre + " " + (idx + 1)} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{p.nombre}</h1>
        <div className="opacity-70 text-sm">{p.seller_nombre || p.seller?.nombre_fantasia || ""}</div>

        <div className="mt-3 text-3xl font-semibold">${fmtARS(p.precio)}</div>
        <p className="mt-4 whitespace-pre-wrap">{p.descripcion || ""}</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="inline-flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => step(-1)}
              className="px-4 py-2 text-lg disabled:opacity-50"
              disabled={sinStock || (typeof p.stock === "number" && parseClamp(qtyStr) <= 1)}
              aria-label="Reducir cantidad"
            >
              -
            </button>
            <input
              className="w-12 text-center outline-none select-all"
              value={qtyStr}
              onChange={(e) => setQtyStr(e.target.value)}
              inputMode="numeric"
              aria-label="Cantidad"
            />
            <button
              onClick={() => step(1)}
              className="px-4 py-2 text-lg disabled:opacity-50"
              disabled={sinStock || (typeof p.stock === "number" && parseClamp(qtyStr) >= p.stock)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <AddToCartButton onClick={addToCart} disabled={sinStock} />
        </div>
      </div>
    </div>
  );
}
