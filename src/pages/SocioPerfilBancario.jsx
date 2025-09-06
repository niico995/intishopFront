
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { toast, alert } from "../utils/notify";

export default function SocioPerfilBancario() {
  const [cbu, setCbu] = useState("");
  const [alias, setAlias] = useState("");
  const [comprobanteUrl, setComprobanteUrl] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("sellers/mi-perfil-socio/");
        setCbu(data?.cbu || "");
        setAlias(data?.alias || "");
        setComprobanteUrl(data?.cbu_comprobante_url || "");
      } catch {
        // sin perfil todavía está ok
      }
    })();
  }, []);

  const uploadComprobante = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("sellers/bank/upload/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setComprobanteUrl(data?.url || "");
    toast("Comprobante subido");
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (file) await uploadComprobante();
      await api.patch("sellers/bank/", {
        cbu: cbu.trim(),
        alias: alias.trim(),
        cbu_comprobante_url: comprobanteUrl,
      });
      toast("Datos bancarios guardados");
    } catch (e) {
      const d = e?.response?.data;
      alert("Error al guardar", d?.error || "Revisá los datos", "error");
    } finally {
      setSaving(false);
    }
  };

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
          />
        </label>
        <label className="grid gap-1">
          <span>Alias</span>
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="grid gap-1">
          <span>Comprobante (imagen)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg,image/avif,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {comprobanteUrl && (
            <a
              className="text-blue-600 underline text-sm mt-1"
              href={comprobanteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ver comprobante
            </a>
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
