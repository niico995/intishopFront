// src/pages/RecuperarPassword.jsx
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Ingresá tu email");
    setLoading(true);
    try {
      await axiosInstance.post("users/password/reset/request/", { email });
      toast.success("Si el correo existe, te enviamos un enlace.");
    } catch {
      // devolvemos el mismo mensaje para no revelar estado
      toast.success("Si el correo existe, te enviamos un enlace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Recuperar contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border rounded-lg p-3"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading}
          className="w-full rounded-lg p-3 bg-black text-white disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
    </div>
  );
}
