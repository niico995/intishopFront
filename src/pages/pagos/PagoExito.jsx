// src/pages/pagos/PagoExito.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PagoExito() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState("");

  useEffect(() => {
    try {
      const v = localStorage.getItem("last_recarga_monto") || "";
      setMonto(v);
      localStorage.removeItem("last_recarga_monto");
    } catch {}
    const t = setTimeout(() => navigate('/'), 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-2">¡Pago exitoso!</h1>
        {monto && <p className="mb-4">Recarga realizada por <b>${monto}</b>. Tu saldo se actualizará en breve.</p>}
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/" className="px-4 py-2 rounded-lg bg-black text-white">Inicio</Link>
          <Link to="/cliente/recargar-credito" className="px-4 py-2 rounded-lg border">Nueva recarga</Link>
        </div>
        <p className="text-xs text-gray-500 mt-4">Redirigiendo al inicio en 4 segundos…</p>
      </div>
    </div>
  );
}
