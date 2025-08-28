// src/pages/admin/AdminMultiplicador.jsx
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { toast, alert } from "../../utils/notify";

export default function AdminMultiplicador() {
  const [m, setM] = useState("1.50");
  const [recalc, setRecalc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("admin/config/pricing/");
        if (!mounted) return;
        setM(String(data?.markup_multiplier ?? "1.50"));
      } catch (e) {
        alert("Error", "No se pudo cargar el multiplicador", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("admin/config/pricing/update/", {
        markup_multiplier: String(m).trim(),
        recalc,
      });
      toast(`Guardado. M=${data?.markup_multiplier}`);
      if (recalc) toast(`Productos recalculados: ${data?.updated ?? 0}`);
    } catch (e) {
      const d = e?.response?.data;
      alert("No se pudo guardar", d?.error || "Error", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Configuración de Precios</h2>
      <p className="text-sm text-gray-600 mb-4">
        El <b>precio público</b> se calcula como <code>costo × M</code>.
      </p>

      <form onSubmit={onSave} className="grid gap-3">
        <label className="grid gap-1">
          <span>Multiplicador (M)</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={m}
            onChange={(e) => setM(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={recalc}
            onChange={(e) => setRecalc(e.target.checked)}
          />
          <span>Recalcular precios existentes ahora</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
