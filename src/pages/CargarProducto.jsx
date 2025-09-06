import { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosConfig";
let toast;
try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

const initialForm = {
  nombre: "",
  descripcion: "",
  costo: "",            // base (se calcula si escribís precio_base)
  precio_base: "",      // precio final (si escribís aquí, costo = precio_base / M)
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
  const [subiendo, setSubiendo] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [multiplicador, setMultiplicador] = useState(1.5);
  const [lastEdited, setLastEdited] = useState(null); // "precio_base" | "costo"

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/admin/multiplicador/");
        const m = parseFloat(String(data?.multiplicador ?? "1.5").replace(",", "."));
        if (!Number.isNaN(m) && m > 0) setMultiplicador(m);
      } catch {}
    })();
    (async () => {
      try {
        const { data } = await axios.get("/products/categorias/");
        const arr = Array.isArray(data) ? data : (data?.results ?? []);
        setCategorias(arr);
      } catch {}
    })();
  }, []);

  // Cálculo bidireccional según el último campo editado
  useEffect(() => {
    if (lastEdited === "precio_base") {
      const pb = parseFloat(form.precio_base || ""); // final
      if (!Number.isNaN(pb) && multiplicador > 0) {
        const cost = pb / multiplicador;
        setForm((f) => ({ ...f, costo: cost ? cost.toFixed(2) : "" }));
      }
    } else if (lastEdited === "costo") {
      const c = parseFloat(form.costo || ""); // base
      if (!Number.isNaN(c) && multiplicador > 0) {
        const final = c * multiplicador;
        setForm((f) => ({ ...f, precio_base: final ? final.toFixed(2) : "" }));
      }
    }
  }, [form.precio_base, form.costo, multiplicador, lastEdited]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "precio_base" || name === "costo") setLastEdited(name);
  };

  const existingCatByName = (name) => categorias.find((c) => c?.nombre?.toLowerCase?.() === String(name).toLowerCase());

  const validar = () => {
    if (!form.nombre.trim()) return "Ingresá el nombre";
    if (!form.precio_base && !form.costo) return "Ingresá precio o costo";
    if (!form.stock) return "Ingresá el stock";
    return "";
  };

  const crear = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) return toast(err, "error");

    setSubiendo(true);
    try {
      const fd = new FormData();
      [ "nombre","descripcion","precio_base","costo","proveedor","stock","envio_modo",
        "unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
      ].forEach(k => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
      });

      // categorías por id
      (form.categorias || []).forEach((cid) => fd.append("categorias", cid));

      const { data } = await axios.post("/products/crear/", fd);
      toast("Producto creado", "success");
      setForm(initialForm);
    } catch (e2) {
      toast(e2?.response?.data?.error || "No se pudo crear el producto", "error");
      throw e2;
    } finally {
      setSubiendo(false);
    }
  };

  const addNewCategory = async () => {
    const name = newCatName.trim();
    if (!name) return toast("Ingresá el nombre de la categoría", "error");
    const ya = existingCatByName(name);
    if (ya?.id) {
      setForm((p) => ({ ...p, categorias: p.categorias.includes(ya.id) ? p.categorias : [...p.categorias, ya.id] }));
      setNewCatName("");
      return;
    }
    try {
      const { data } = await axios.post("/products/categorias/", { nombre: name });
      const nuevaId = data?.id;
      if (nuevaId) {
        setCategorias((prev) => [...prev, data]);
        setForm((p) => ({ ...p, categorias: [...p.categorias, nuevaId] }));
        setNewCatName("");
      }
    } catch (e) {
      toast(e?.response?.data?.error || "No se pudo crear la categoría", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Cargar producto</h1>

      <form onSubmit={crear} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Nombre *</span>
            <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio (final)</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_base" value={form.precio_base} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Costo (base)</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="costo" value={form.costo} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Stock *</span>
            <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm mb-1">Descripción</span>
          <textarea className="border rounded px-3 py-2" name="descripcion" value={form.descripcion} onChange={onChange} />
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Categorías</span>
            <div className="flex flex-wrap gap-2">
              {categorias.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setForm((p) => ({ ...p, categorias: p.categorias.includes(c.id) ? p.categorias.filter((x) => x !== c.id) : [...p.categorias, c.id] }))}
                  className={"px-3 py-1.5 rounded border text-sm " + (form.categorias.includes(c.id) ? "bg-black text-white" : "bg-white")}
                >
                  {c.nombre}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input className="border rounded px-3 py-2 flex-1" placeholder="Nueva categoría" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
              <button type="button" className="px-3 py-2 rounded border" onClick={addNewCategory}>Agregar</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">Envío</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm flex items-center gap-2">
                <input type="radio" name="envio_modo" value="unidad" checked={form.envio_modo === "unidad"} onChange={onChange} />
                Por unidad
              </label>
              <label className="text-sm flex items-center gap-2">
                <input type="radio" name="envio_modo" value="bulto" checked={form.envio_modo === "bulto"} onChange={onChange} />
                Por bulto
              </label>
            </div>
          </div>
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
