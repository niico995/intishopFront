// src/pages/NuevaPassword.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function NuevaPassword() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get("token");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Falta el token.");
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Token inválido.");
    if (!pwd || pwd.length < 8) return toast.error("Mínimo 8 caracteres.");
    setLoading(true);
    try {
      await axiosInstance.post("users/password/reset/confirm/", {
        token,
        new_password: pwd,
      });
      toast.success("Listo. Iniciá sesión con tu nueva contraseña.");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.error || "No se pudo actualizar.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Nueva contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full border rounded-lg p-3"
          placeholder="Nueva contraseña (mín. 8)"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button
          disabled={loading}
          className="w-full rounded-lg p-3 bg-black text-white disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar y continuar"}
        </button>
      </form>
    </div>
  );
}
