// src/pages/socio/BannersSocio.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function BannersSocio() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const cargar = async () => {
    const { data } = await axiosInstance.get("sellers/banners/");
    setBanners(data);
  };

  useEffect(() => { cargar(); }, []);

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.includes("image/webp")) {
      alert("Solo imágenes .webp");
      e.target.value = "";
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      alert("Máximo 3MB");
      e.target.value = "";
      return;
    }
    setFile(f);
  };

  const subir = async (e) => {
    e.preventDefault();
    if (!file) return alert("Elegí un .webp");
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (titulo) fd.append("titulo", titulo);
      if (link) fd.append("link", link);

      await axiosInstance.post("sellers/banners/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null); setTitulo(""); setLink("");
      await cargar();
    } catch (err) {
      console.error(err);
      alert("No se pudo subir el banner");
    } finally {
      setSubiendo(false);
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar banner?")) return;
    await axiosInstance.delete(`sellers/banners/${id}/`);
    await cargar();
  };

  const toggleActivo = async (b) => {
    await axiosInstance.patch(`sellers/banners/${b.id}/`, { activo: !b.activo });
    await cargar();
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Banners del vendedor</h2>

      <form onSubmit={subir} className="space-y-3 border rounded p-3">
        <input type="file" accept="image/webp" onChange={onFile} />
        <input className="border p-2 w-full" placeholder="Título (opcional)"
               value={titulo} onChange={e => setTitulo(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Link (opcional)"
               value={link} onChange={e => setLink(e.target.value)} />
        <button disabled={subiendo} className="bg-black text-white px-4 py-2 rounded">
          {subiendo ? "Subiendo..." : "Subir banner"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {banners.map(b => (
          <div key={b.id} className="border rounded overflow-hidden">
            <img src={b.url} alt="" className="w-full h-40 object-cover" />
            <div className="p-2 text-sm">
              <div className="font-semibold truncate">{b.titulo || "Sin título"}</div>
              {b.link && <a href={b.link} className="text-blue-600 underline" target="_blank">Ver link</a>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => toggleActivo(b)}
                        className="px-3 py-1 border rounded">
                  {b.activo ? "Desactivar" : "Activar"}
                </button>
                <button onClick={() => borrar(b.id)}
                        className="px-3 py-1 border rounded text-red-600">
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p>No tenés banners aún.</p>}
      </div>
    </div>
  );
}
