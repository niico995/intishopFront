import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Editor de producto con:
 *  - multiselect de categorías
 *  - campo "Nueva categoría" que crea (o reutiliza si ya existe) y la marca seleccionada
 *  - envío PATCH con categorias: [ids]
 *
 * Requiere: token JWT en localStorage (key "token") o adaptá a tu auth.
 */
export default function EditarProducto() {
  const { id } = useParams(); // /productos/editar/:id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // catálogo de categorías y selección (ids)
  const [cats, setCats] = useState([]);
  const [selectedCatIds, setSelectedCatIds] = useState([]);

  // campos del producto (ajustá nombres si hace falta)
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    costo: "",          // obligatorio
    precio_base: "",    // precio del socio
    stock: "",
    activo: true,
    proveedor: "",
    destacado: false,
  });

  const token = useMemo(() => localStorage.getItem("token") || "", []);

  useEffect(() => {
    let abort = false;

    async function loadAll() {
      setLoading(true);
      try {
        // 1) categorías catálogo
        const resCats = await fetch(`${API_BASE}/api/products/categorias/`);
        const dataCats = resCats.ok ? await resCats.json() : [];
        if (!abort) setCats(Array.isArray(dataCats) ? dataCats : []);

        // 2) producto
        const resProd = await fetch(`${API_BASE}/api/products/${id}/`);
        if (!resProd.ok) throw new Error("No se pudo cargar el producto");
        const p = await resProd.json();

        // mapear campos
        const categoriasDelProd = Array.isArray(p.categorias)
          ? p.categorias.map((x) => (typeof x === "object" ? x.id : x))
          : [];

        if (!abort) {
          setForm({
            nombre: p.nombre || "",
            descripcion: p.descripcion || "",
            costo: p.costo ?? "",
            precio_base: p.precio_base ?? p.precio ?? "",
            stock: p.stock ?? "",
            activo: p.activo ?? true,
            proveedor: p.proveedor ?? "",
            destacado: p.destacado ?? false,
          });
          setSelectedCatIds(categoriasDelProd);
        }
      } catch (e) {
        if (!abort) setError(e.message || "Error inesperado");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    loadAll();
    return () => {
      abort = true;
    };
  }, [id]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCat(id) {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleAddCategory(e) {
    e?.preventDefault?.();
    const nombre = prompt("Nombre de la nueva categoría:")?.trim();
    if (!nombre) return;

    try {
      const res = await fetch(`${API_BASE}/api/products/categorias/crear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) {
        alert("No se pudo crear la categoría");
        return;
      }
      const cat = await res.json(); // {id, nombre}
      // agregar al catálogo si no está
      setCats((prev) =>
        prev.find((c) => c.id === cat.id) ? prev : [...prev, cat]
      );
      // marcarla seleccionada
      setSelectedCatIds((prev) =>
        prev.includes(cat.id) ? prev : [...prev, cat.id]
      );
    } catch {
      alert("Error creando categoría");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validaciones mínimas
    if (!form.nombre?.trim()) return setError("Ingresá un nombre");
    if (form.costo === "" || form.costo === null) return setError("Costo requerido");
    if (form.precio_base === "" || form.precio_base === null) return setError("Precio del socio requerido");

    setSaving(true);
    try {
      // armamos payload
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        costo: Number(form.costo),
        precio_base: Number(form.precio_base),
        stock: Number.isNaN(Number(form.stock)) ? form.stock : Number(form.stock),
        activo: !!form.activo,
        proveedor: form.proveedor,
        destacado: !!form.destacado,
        categorias: selectedCatIds, // mandamos ids
      };

      const res = await fetch(`${API_BASE}/api/products/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al guardar: ${txt || res.status}`);
      }
      navigate("/mi-cuenta/productos"); // o donde corresponda
    } catch (e) {
      setError(e.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Editar producto</h1>

      {error && (
        <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={form.descripcion}
            onChange={(e) => updateField("descripcion", e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Costo (obligatorio)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2"
              value={form.costo}
              onChange={(e) => updateField("costo", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Precio socio</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2"
              value={form.precio_base}
              onChange={(e) => updateField("precio_base", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              step="1"
              className="w-full border rounded px-3 py-2"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.activo}
              onChange={(e) => updateField("activo", e.target.checked)}
            />
            Activo
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.destacado}
              onChange={(e) => updateField("destacado", e.target.checked)}
            />
            Destacado
          </label>
          <div>
            <label className="block text-sm font-medium">Proveedor</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.proveedor}
              onChange={(e) => updateField("proveedor", e.target.value)}
            />
          </div>
        </div>

        {/* Categorías */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Categorías</label>
            <button
              type="button"
              onClick={handleAddCategory}
              className="text-sm px-2 py-1 rounded bg-blue-600 text-white"
            >
              + Nueva categoría
            </button>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cats.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 border rounded px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCatIds.includes(c.id)}
                  onChange={() => toggleCat(c.id)}
                />
                <span>{c.nombre || c.name}</span>
              </label>
            ))}
            {cats.length === 0 && (
              <div className="text-sm text-gray-500">No hay categorías</div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
