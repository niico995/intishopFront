
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { toast } from "../../utils/notify";

export default function AdminMultiplicador() {
  const [valor, setValor] = useState("1,50");
  const [recalc, setRecalc] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("admin/multiplicador/");
      // mostrar con coma para AR
      const v = String(data?.multiplicador ?? "1.50").replace(".", ",");
      setValor(v);
    } catch (e) {
      alert("Error\n\nNo se pudo cargar el multiplicador");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const guardar = async () => {
    setLoading(true);
    try {
      const payload = {
        multiplicador: String(valor).trim().replace(",", "."), // backend acepta punto
        recalcular: recalc,
      };
      await api.put("admin/multiplicador/", payload);
      toast("Guardado", "success");
      await load();
    } catch (e) {
      toast(e?.response?.data?.error || "No se pudo guardar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Configuración de Precios</h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        El <b>precio público</b> se calcula como <code>costo × M</code>.
      </p>

      <label className="block text-sm mb-1">Multiplicador (M)</label>
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="1,50"
      />

      <label className="inline-flex items-center gap-2 mb-4">
        <input type="checkbox" checked={recalc} onChange={(e) => setRecalc(e.target.checked)} />
        Recalcular precios existentes ahora
      </label>

      <div>
        <button
          disabled={loading}
          onClick={guardar}
          className="px-4 py-2 rounded bg-blue-700 text-white disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
