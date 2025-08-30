import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
let toast;
try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

export default function EditarProducto() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [cats, setCats] = useState([]);
  const [nuevasImgs, setNuevasImgs] = useState([]);  // File[]
  const [guardando, setGuardando] = useState(false);
  const [subiendoImgs, setSubiendoImgs] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axiosInstance.get(`products/productos/${id}/`),
          axiosInstance.get("products/categorias/"),
        ]);
        const p = pRes.data;
        setForm({
          id: p.id,
          nombre: p.nombre || "",
          descripcion: p.descripcion || "",
          precio_minorista: p.precio_minorista ?? "",
          precio_mayorista: p.precio_mayorista ?? "",
          proveedor: p.proveedor || "",
          stock: p.stock ?? "",
          categorias: p.categorias || [],
          envio_modo: p.envio_modo || "unidad",
          unidad_peso_kg: p.unidad_peso_kg ?? "",
          unidad_vol_dm3: p.unidad_vol_dm3 ?? "",
          bulto_unidades: p.bulto_unidades ?? "",
          bulto_peso_kg: p.bulto_peso_kg ?? "",
          bulto_vol_dm3: p.bulto_vol_dm3 ?? "",
          imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
          slug: p.slug,
        });
        setCats(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        console.error(e);
        toast("No pude cargar el producto");
      }
    })();
  }, [id]);

  const previews = useMemo(
    () => nuevasImgs.map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
    [nuevasImgs]
  );

  if (!form) return <div className="p-4">Cargando…</div>;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSelectCats = (e) => {
    const values = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setForm(p => ({ ...p, categorias: values }));
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setNuevasImgs(files);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const fd = new FormData();
      // En PATCH mandamos SOLO lo editable (pero podés enviar todo)
      ["nombre","descripcion","precio_minorista","precio_mayorista","proveedor","stock",
       "envio_modo","unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
      ].forEach(k => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          fd.append(k, form[k]);
        }
      });
      form.categorias.forEach(id => fd.append("categorias", id));
      await axiosInstance.patch(`products/productos/${id}/`, fd);
      toast("Producto actualizado");
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo actualizar");
    } finally {
      setGuardando(false);
    }
  };

  const subirImagenes = async () => {
    if (!nuevasImgs.length) return toast("No seleccionaste imágenes");
    setSubiendoImgs(true);
    try {
      const fdImg = new FormData();
      nuevasImgs.forEach(f => fdImg.append("imagenes", f));
      const { data } = await axiosInstance.post(`products/productos/${id}/subir_imagenes/`, fdImg, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // refrescar lista local
      setForm(p => ({ ...p, imagenes: [...p.imagenes, ...data] }));
      setNuevasImgs([]);
      toast("Imágenes subidas");
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo subir imágenes");
    } finally {
      setSubiendoImgs(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Editar producto #{id}</h1>

      <form onSubmit={guardar} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Nombre</span>
            <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Proveedor</span>
            <input className="border rounded px-3 py-2" name="proveedor" value={form.proveedor} onChange={onChange} />
          </label>

          <label className="md:col-span-2 flex flex-col">
            <span className="text-sm mb-1">Descripción</span>
            <textarea className="border rounded px-3 py-2" rows={3} name="descripcion" value={form.descripcion} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio minorista</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_minorista" value={form.precio_minorista} onChange={onChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio mayorista</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_mayorista" value={form.precio_mayorista} onChange={onChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Stock</span>
            <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
          </label>

          <label className="flex flex-col md:col-span-1">
            <span className="text-sm mb-1">Categorías</span>
            <select multiple className="border rounded px-3 py-2 h-40" value={form.categorias} onChange={onSelectCats}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <span className="text-xs text-gray-500 mt-1">Ctrl/Cmd + click para seleccionar varias</span>
          </label>
        </div>

        {/* ENVÍO */}
        <div className="border rounded p-3 space-y-3">
          <div className="font-medium">Envío</div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="envio_modo" value="unidad" checked={form.envio_modo==="unidad"} onChange={onChange}/>
              Por unidad
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="envio_modo" value="bulto" checked={form.envio_modo==="bulto"} onChange={onChange}/>
              Por bulto
            </label>
          </div>

          {form.envio_modo === "unidad" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Peso por unidad (kg)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_peso_kg" value={form.unidad_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por unidad (dm³)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_vol_dm3" value={form.unidad_vol_dm3} onChange={onChange} />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Unidades por bulto</span>
                <input type="number" className="border rounded px-3 py-2" name="bulto_unidades" value={form.bulto_unidades} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Peso por bulto (kg)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_peso_kg" value={form.bulto_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por bulto (dm³)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_vol_dm3" value={form.bulto_vol_dm3} onChange={onChange} />
              </label>
            </div>
          )}
        </div>

        {/* IMÁGENES ACTUALES */}
        {!!form.imagenes?.length && (
          <div className="border rounded p-3">
            <div className="font-medium mb-2">Imágenes actuales</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {form.imagenes.map(img => (
                <div key={img.id} className="aspect-square border rounded overflow-hidden">
                  <img src={img.url} alt={`img-${img.id}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUEVAS IMÁGENES */}
        <div className="border rounded p-3 space-y-2">
          <div className="font-medium">Agregar imágenes (jpg/png/webp)</div>
          <input type="file" accept="image/*" multiple onChange={onFiles} />
          {previews?.length > 0 && (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                {previews.map(p => (
                  <div key={p.url} className="aspect-square border rounded overflow-hidden">
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
              <button type="button" disabled={subiendoImgs} onClick={subirImagenes}
                className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
                {subiendoImgs ? "Subiendo..." : "Subir nuevas imágenes"}
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button disabled={guardando} className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
