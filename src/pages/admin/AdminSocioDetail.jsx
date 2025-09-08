// src/pages/admin/socios/AdminSocioDetail.jsx
import { useEffect, useState } from "react";
import { getSocio, patchSocio, toggleSocio } from "../../api/adminService";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminSocioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargar = async () => {
    try {
      const data = await getSocio(id);
      setForm(data);
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar el socio");
    }
  };
  useEffect(() => { cargar(); }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patchSocio(id, {
        nombre: form.nombre,
        apellido: form.apellido,
        cuit: form.cuit,
        nombre_fantasia: form.nombre_fantasia,
        telefono: form.telefono,
        celular: form.celular,
        direccion_local: form.direccion_local,
        tipo_socio: form.tipo_socio,
      });
      navigate("/admin/socios");
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div>Cargando…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Editar socio #{id}</h1>
        <button onClick={() => toggleSocio(id).then(cargar)} className="px-3 py-2 border rounded">
          {form.activo ? "Inactivar" : "Activar"}
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        {[
          ["nombre","Nombre"], ["apellido","Apellido"],
          ["cuit","CUIT"], ["nombre_fantasia","Nombre de fantasía"],
          ["telefono","Teléfono"], ["celular","Celular"],
          ["direccion_local","Dirección del local"],
        ].map(([name,label]) => (
          <div key={name}>
            <label className="block text-sm mb-1">{label}</label>
            <input name={name} value={form[name] || ""} onChange={onChange} className="border p-2 rounded w-full" />
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1">Tipo de socio</label>
          <select name="tipo_socio" value={form.tipo_socio || "basico"} onChange={onChange}
                  className="border p-2 rounded w-full">
            <option value="basico">Básico</option>
            <option value="medio">Medio</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button disabled={saving} className="bg-slate-900 text-white px-4 py-2 rounded">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
