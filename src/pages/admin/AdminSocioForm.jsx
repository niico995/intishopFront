
import { useState } from "react";
import { createSocio } from "../../api/adminService";
import { useNavigate } from "react-router-dom";
const DEFAULT_COMMISSION = { basico: 10.0, medio: 7.5, pro: 5.0 };

export default function AdminSocioForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    nombre_fantasia: "",
    cuit: "",
    telefono: "",
    celular: "",
    direccion_local: "",
    tipo_socio: "basico",
    comision: DEFAULT_COMMISSION["basico"],
    estado: "aprobado",
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === "tipo_socio") {
        next.comision = DEFAULT_COMMISSION[value] ?? next.comision;
      }
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password; // backend genera una random si no mandás
      await createSocio(payload);
      nav("/admin/socios");
    } catch (err) {
      console.error(err);
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
          ["email","Email"], ["password","Contraseña (opcional)"],
          ["nombre","Nombre"], ["apellido","Apellido"],
          ["nombre_fantasia","Nombre de fantasía"], ["cuit","CUIT"],
          ["telefono","Teléfono"], ["celular","Celular"],
          ["direccion_local","Dirección del local"],
        ].map(([name,label]) => (
          <div key={name}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              name={name} value={form[name] || ""} onChange={onChange}
              type={name === "password" ? "password" : "text"}
              className="border p-2 rounded w-full"
              required={name === "email"}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1">Tipo de socio</label>
          <select
            name="tipo_socio" value={form.tipo_socio} onChange={onChange}
            className="border p-2 rounded w-full"
          >
            <option value="basico">Básico</option>
            <option value="medio">Medio</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Comisión %</label>
          <input
            type="number" step="0.01" min="0" max="100"
            name="comision" value={form.comision ?? 0}
            onChange={onChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Estado</label>
          <select
            name="estado" value={form.estado} onChange={onChange}
            className="border p-2 rounded w-full"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button disabled={saving} className="bg-slate-900 text-white px-4 py-2 rounded">
            {saving ? "Creando..." : "Crear socio"}
          </button>
        </div>
      </form>
    </div>
  );
}