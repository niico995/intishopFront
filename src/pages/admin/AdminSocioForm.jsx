// src/pages/admin/socios/AdminSocioForm.jsx
import { useState } from "react";
import { createSocio } from "../../api/adminService";
import { useNavigate } from "react-router-dom";

export default function AdminSocioForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    cuit: "",
    nombre_fantasia: "",
    telefono: "",
    celular: "",
    direccion_local: "",
    tipo_socio: "basico",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSocio(form);
      navigate("/admin/socios");
    } catch (e) {
      console.error(e);
      alert("No se pudo crear el socio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Nuevo socio</h1>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        {[
          ["email","Email"], ["password","Contraseña"],
          ["nombre","Nombre"], ["apellido","Apellido"],
          ["cuit","CUIT"], ["nombre_fantasia","Nombre de fantasía"],
          ["telefono","Teléfono"], ["celular","Celular"],
          ["direccion_local","Dirección del local"],
        ].map(([name,label]) => (
          <div key={name}>
            <label className="block text-sm mb-1">{label}</label>
            <input name={name} value={form[name]} onChange={onChange}
              className="border p-2 rounded w-full" required={name!=="telefono" && name!=="celular"} />
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">Tipo de socio</label>
          <select name="tipo_socio" value={form.tipo_socio} onChange={onChange} className="border p-2 rounded w-full">
            <option value="basico">Básico</option>
            <option value="medio">Medio</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button disabled={saving} className="bg-slate-900 text-white px-4 py-2 rounded">
            {saving ? "Guardando..." : "Crear socio"}
          </button>
        </div>
      </form>
    </div>
  );
}
