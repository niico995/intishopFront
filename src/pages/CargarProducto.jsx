import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosConfig";
let toast;
try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

const initialForm = {
  nombre: "",
  descripcion: "",
  precio_minorista: "",
  precio_mayorista: "",
  proveedor: "",
  stock: "",
  categorias: [],
  envio_modo: "unidad",       // "unidad" | "bulto"
  unidad_peso_kg: "",
  unidad_vol_dm3: "",
  bulto_unidades: "",
  bulto_peso_kg: "",
  bulto_vol_dm3: "",
};

export default function CargarProducto() {
  const [form, setForm] = useState(initialForm);
  const [cats, setCats] = useState([]);
  const [imagenes, setImagenes] = useState([]);      // File[]
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("products/categorias/");
        setCats(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        toast("No pude cargar categorías");
      }
    })();
  }, []);

  const previews = useMemo(
    () => imagenes.map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
    [imagenes]
  );

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
    setImagenes(files);
  };

  const validar = () => {
    if (!form.nombre?.trim()) return "Ingresá un nombre";
    if (!form.precio_minorista) return "Precio minorista requerido";
    if (!form.stock && form.stock !== 0) return "Stock requerido";
    if (!form.categorias?.length) return "Seleccioná al menos una categoría";

    if (form.envio_modo === "unidad") {
      if (form.unidad_peso_kg === "") return "Peso por unidad requerido";
      if (form.unidad_vol_dm3 === "") return "Volumen por unidad requerido";
    } else {
      if (!form.bulto_unidades) return "Unidades por bulto requerido";
      if (form.bulto_peso_kg === "") return "Peso por bulto requerido";
      if (form.bulto_vol_dm3 === "") return "Volumen por bulto requerido";
    }
    return null;
  };

  const crear = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) return toast(err);

    setSubiendo(true);
    try {
      const fd = new FormData();
      // Campos simples
      ["nombre","descripcion","precio_minorista","precio_mayorista","proveedor","stock","envio_modo",
       "unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
      ].forEach(k => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          fd.append(k, form[k]);
        }
      });
      // Categorías (múltiple)
      form.categorias.forEach(id => fd.append("categorias", id));

      // 1) Crear producto
      const { data: producto } = await axiosInstance.post("products/productos/", fd);

      // 2) Subir imágenes si hay
      if (imagenes.length) {
        const fdImg = new FormData();
        imagenes.forEach(f => fdImg.append("imagenes", f));
        await axiosInstance.post(`products/productos/${producto.id}/subir_imagenes/`, fdImg, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast("Producto creado con éxito");
      setForm(initialForm);
      setImagenes([]);
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo crear el producto");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Cargar producto</h1>

      <form onSubmit={crear} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Nombre *</span>
            <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Proveedor</span>
            <input className="border rounded px-3 py-2" name="proveedor" value={form.proveedor} onChange={onChange} />
          </label>

          <label className="md:col-span-2 flex flex-col">
            <span className="text-sm mb-1">Descripción</span>
            <textarea className="border rounded px-3 py-2" name="descripcion" value={form.descripcion} onChange={onChange} rows={3}/>
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio minorista *</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_minorista" value={form.precio_minorista} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio mayorista</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_mayorista" value={form.precio_mayorista} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Stock *</span>
            <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
          </label>

          <label className="flex flex-col md:col-span-1">
            <span className="text-sm mb-1">Categorías *</span>
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
                <span className="text-sm mb-1">Peso por unidad (kg) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_peso_kg" value={form.unidad_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por unidad (dm³) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_vol_dm3" value={form.unidad_vol_dm3} onChange={onChange} />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Unidades por bulto *</span>
                <input type="number" className="border rounded px-3 py-2" name="bulto_unidades" value={form.bulto_unidades} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Peso por bulto (kg) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_peso_kg" value={form.bulto_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por bulto (dm³) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_vol_dm3" value={form.bulto_vol_dm3} onChange={onChange} />
              </label>
            </div>
          )}
        </div>

        {/* IMÁGENES */}
        <div className="border rounded p-3 space-y-2">
          <div className="font-medium">Imágenes (jpg/png/webp, sin conversión)</div>
          <input type="file" accept="image/*" multiple onChange={onFiles}/>
          {previews?.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
              {previews.map(p => (
                <div key={p.url} className="aspect-square border rounded overflow-hidden">
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button disabled={subiendo} className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
            {subiendo ? "Guardando..." : "Crear producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
