// src/pages/SocioPerfilBancario.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { toast, alert } from "../utils/notify";

export default function SocioPerfilBancario() {
  const [cbu, setCbu] = useState("");
  const [alias, setAlias] = useState("");
  const [comprobanteUrl, setComprobanteUrl] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const hydrate = (data) => {
    setCbu(data?.cbu || "");
    setAlias(data?.alias || "");
    setComprobanteUrl(data?.cbu_comprobante_url || "");
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("sellers/mi-perfil/"); // ← ruta real según tu urls.py
      hydrate(data);
    } catch (e) {
      const st = e?.response?.status;
      if (st === 401) {
        alert("Sesión", "Iniciá sesión para ver tu perfil.", "warning");
      } else if (st === 404) {
        console.warn("Perfil de socio inexistente todavía.");
      } else {
        alert("No se pudo cargar", "Intentá de nuevo más tarde.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Sube la imagen y devuelve la URL absoluta SIN depender de setState
  const uploadComprobante = async () => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("sellers/bank/upload/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.url || null;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1) subimos imagen si corresponde y usamos variable local
      let finalUrl = comprobanteUrl;
      if (file) {
        const uploadedUrl = await uploadComprobante();
        if (uploadedUrl) {
          finalUrl = uploadedUrl;
          setComprobanteUrl(uploadedUrl); // actualización visual
        }
      }

      // 2) PATCH bancario (el back debe devolver el perfil actualizado)
      const { data: updated } = await api.patch("sellers/bank/", {
        cbu: cbu.trim(),
        alias: alias.trim(),
        cbu_comprobante_url: finalUrl || "",
      });

      // 3) pisamos con la respuesta y refrescamos desde GET para quedar 100% en sync
      hydrate(updated);
      setFile(null);
      await load();

      toast("Datos bancarios guardados");
    } catch (e) {
      const d = e?.response?.data;
      const msg =
        (d?.cbu && Array.isArray(d.cbu) && d.cbu[0]) ||
        d?.error ||
        "Revisá los datos";
      alert("Error al guardar", msg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-2">Datos Bancarios</h2>
        <div className="text-sm text-gray-500">Cargando…</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Datos Bancarios</h2>
      <form onSubmit={onSave} className="grid gap-3">
        <label className="grid gap-1">
          <span>CBU (22 dígitos)</span>
          <input
            value={cbu}
            onChange={(e) => setCbu(e.target.value.replace(/\D+/g, ""))}
            maxLength={22}
            className="border rounded px-3 py-2"
            required
            disabled={saving}
          />
        </label>

        <label className="grid gap-1">
          <span>Alias</span>
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={saving}
          />
        </label>

        <label className="grid gap-1">
          <span>Comprobante (imagen)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={saving}
          />
          {comprobanteUrl && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={comprobanteUrl}
                alt="Comprobante"
                className="h-16 w-16 object-cover rounded border"
              />
              <a
                className="text-blue-600 underline text-sm"
                href={comprobanteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver comprobante en pestaña nueva
              </a>
            </div>
          )}
        </label>

        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving ? "bg-gray-500" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
