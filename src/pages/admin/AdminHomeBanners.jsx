import { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";

const SLOTS = [
  { value: "principal", label: "Principal (Hero)" },
  { value: "intermedio", label: "Intermedio" },
];

export default function AdminHomeBanners() {
  const [slot, setSlot] = useState("principal");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ file: null, titulo: "", link: "", orden: 0 });

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      // GET /api/admin/home-banners/?slot=principal|intermedio
      const { data } = await axios.get("admin/home-banners/", { params: { slot } });
      setBanners(data);
    } catch (e) {
      setErr("No se pudieron cargar los banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot]);

  const onUpload = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!form.file) {
      setErr("Seleccioná un archivo (.webp/.jpg/.png).");
      return;
    }

    const fd = new FormData();
    fd.append("file", form.file);
    fd.append("slot", slot);
    if (form.titulo) fd.append("titulo", form.titulo);
    if (form.link) fd.append("link", form.link);
    fd.append("orden", String(form.orden || 0));

    try {
      await axios.post("admin/home-banners/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ file: null, titulo: "", link: "", orden: 0 });
      setMsg("Banner subido.");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || "No se pudo subir el banner.");
    }
  };

  const onToggle = async (b) => {
    try {
      await axios.patch(`admin/home-banners/${b.id}/`, { activo: !b.activo });
      await load();
    } catch (e) {
      setErr("No se pudo cambiar el estado.");
    }
  };

  const onSaveMeta = async (b, fields) => {
    try {
      await axios.patch(`admin/home-banners/${b.id}/`, fields);
      await load();
    } catch (e) {
      setErr("No se pudo guardar.");
    }
  };

  const onDelete = async (b) => {
    if (!confirm("¿Eliminar banner?")) return;
    try {
      await axios.delete(`admin/home-banners/${b.id}/`);
      await load();
    } catch (e) {
      setErr("No se pudo eliminar.");
    }
  };

  const move = async (b, delta) => {
    const nuevo = Math.max(0, (b.orden || 0) + delta);
    await onSaveMeta(b, { orden: nuevo });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners del Home</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm">Bloque:</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Carga */}
      <form onSubmit={onUpload} className="border rounded-xl p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="file"
            accept=".webp,.jpg,.jpeg,.png"
            onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
          />
          <input
            type="text"
            placeholder="Título (opcional)"
            className="border rounded px-2 py-1"
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          />
          <input
            type="url"
            placeholder="Link (opcional)"
            className="border rounded px-2 py-1"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Orden"
            className="border rounded px-2 py-1"
            value={form.orden}
            onChange={(e) => setForm((f) => ({ ...f, orden: Number(e.target.value) }))}
          />
        </div>
        <p className="text-xs text-gray-500">
          Recomendado: relación <b>3:1</b> (ej. 1920×640). Peso &le; 400KB. Formatos: webp/jpg/png.
        </p>
        <button className="rounded px-4 py-2 border hover:bg-black hover:text-white">Subir banner</button>
      </form>

      {/* Mensajes */}
      {(msg || err) && (
        <div className={`${err ? "text-red-600" : "text-green-600"} text-sm`}>{err || msg}</div>
      )}

      {/* Lista */}
      {loading ? (
        <div>Cargando…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="border rounded-xl overflow-hidden">
              <div className="w-full aspect-[3/1] bg-gray-100">
                <img
                  src={b.imagen_url}
                  alt={b.titulo || "banner"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-3 space-y-2">
                <div className="grid md:grid-cols-2 gap-2">
                  <input
                    className="border rounded px-2 py-1"
                    defaultValue={b.titulo || ""}
                    placeholder="Título"
                    onBlur={(e) => {
                      if (e.target.value !== (b.titulo || ""))
                        onSaveMeta(b, { titulo: e.target.value });
                    }}
                  />
                  <input
                    className="border rounded px-2 py-1"
                    defaultValue={b.link || ""}
                    placeholder="https://..."
                    onBlur={(e) => {
                      if (e.target.value !== (b.link || "")) onSaveMeta(b, { link: e.target.value });
                    }}
                  />
                </div>
                <div className="text-sm text-gray-500">Orden: {b.orden} · Estado: {b.activo ? "Activo" : "Inactivo"}</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => onToggle(b)} className="px-3 py-1 border rounded">
                    {b.activo ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => move(b, -1)} className="px-3 py-1 border rounded">
                    ↑
                  </button>
                  <button onClick={() => move(b, +1)} className="px-3 py-1 border rounded">
                    ↓
                  </button>
                  <button onClick={() => onDelete(b)} className="px-3 py-1 border rounded text-red-600">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="text-sm text-gray-500">No hay banners en este bloque.</div>
          )}
        </div>
      )}
    </div>
  );
}
