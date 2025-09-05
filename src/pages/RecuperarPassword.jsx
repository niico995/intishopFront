
import { useState } from "react";
import axios from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/password/reset/request/", { email });
      setEnviado(true);
      toast("Si el email existe, enviamos un código", "success");
    } catch (e) {
      toast("Error al enviar el código", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Recuperar contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" type="email" placeholder="Tu email"
               value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <button className="px-4 py-2 bg-black text-white rounded">Enviar código</button>
      </form>
      {enviado && <p className="mt-3 text-sm text-green-600">Revisá tu correo.</p>}
    </div>
  );
}
