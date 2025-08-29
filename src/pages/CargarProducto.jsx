import { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function CargarProducto() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    costo: "",
    costo_envio: "",
    stock: "",
    categorias: [], // IDs
  });
  const [categorias, setCategorias] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Precio calculado local (solo display)
  const precioCalculado = useMemo(() => {
    const c = parseFloat((formData.costo || "0").toString().replace(",", "."));
    if (isNaN(c)) return "0.00";
    return (c * 1.5).toFixed(2);
  }, [formData.costo]);

  useEffect(() => {
    const getCategorias = async () => {
      setLoadingCats(true);
      try {
        const res = await axios.get("products/categorias/");
        setCategorias(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast("Error al cargar las categorías", "error");
      } finally {
        setLoadingCats(false);
      }
    };
    getCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "costo" || name === "costo_envio") {
      val = value.replace(",", ".");
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleCategorias = (e) => {
    const opts = Array.from(e.target.selectedOptions);
    const values = opts.map((o) => Number(o.value));
    setFormData((prev) => ({ ...prev, categorias: values }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        nombre: formData.nombre?.trim(),
        descripcion: formData.descripcion?.trim(),
        costo: Number(formData.costo || 0).toFixed(2),
        // precio NO se envía: lo calcula el backend como costo × 1.50
        costo_envio: Number(formData.costo_envio || 0).toFixed(2),
        stock: Number(formData.stock || 0),
        categorias: formData.categorias,
      };

      await axios.post("products/crear/", payload);
      toast("Producto creado con éxito", "success");

      setFormData({
        nombre: "",
        descripcion: "",
        costo: "",
        costo_envio: "",
        stock: "",
        categorias: [],
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "No se pudo crear el producto";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-3">Cargar producto</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
            inputMode="text"
            placeholder="Ej.: Filtro de aceite XYZ"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full min-h-28"
            required
            placeholder="Detalles, compatibilidades, etc."
          />
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Costo (ingresá vos)</label>
            <input
              name="costo"
              type="number"
              step="0.01"
              value={formData.costo}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
              inputMode="decimal"
              placeholder="0.00"
            />
            <p className="text-[11px] text-gray-500">
              El sistema calcula automáticamente el <b>precio de venta</b> como <b>costo × 1.5</b>.
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Precio (auto)</label>
            <input
              value={precioCalculado}
              className="border rounded px-3 py-2 w-full bg-gray-50"
              readOnly
              tabIndex={-1}
            />
            <p className="text-[11px] text-gray-500">Este es el precio final que verá el cliente.</p>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Costo de envío</label>
            <input
              name="costo_envio"
              type="number"
              step="0.01"
              value={formData.costo_envio}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              inputMode="decimal"
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Categorías</label>
          <select
            multiple
            value={formData.categorias}
            onChange={handleCategorias}
            className="border rounded px-3 py-2 w-full"
          >
            {loadingCats ? (
              <option>Cargando…</option>
            ) : categorias.length === 0 ? (
              <option disabled>No hay categorías</option>
            ) : (
              categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))
            )}
          </select>
          <p className="text-[11px] text-gray-500">
            En móvil: tocá y arrastrá para seleccionar varias (o mantené presionado).
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 border rounded w-full sm:w-auto hover:bg-gray-50 disabled:opacity-50"
        >
          {submitting ? "Guardando…" : "Guardar producto"}
        </button>
      </form>
    </div>
  );
}
