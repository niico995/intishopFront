
import { useState } from "react";
import axios from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function NuevaPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/password/reset/confirm/", { email, code, new_password: password });
      toast("Contraseña actualizada", "success");
    } catch (e) {
      toast(e?.response?.data?.error || "Error al actualizar", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Nueva contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" type="email" placeholder="Tu email"
               value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="Código recibido"
               value={code} onChange={(e)=>setCode(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="password" placeholder="Nueva contraseña"
               value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="px-4 py-2 bg-black text-white rounded">Guardar</button>
      </form>
    </div>
  );
}
