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
  }, []);

  useEffect(() => {
    const t = setTimeout(() => navigate("/carrito"), 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-700">
          {monto ? (
            <>
              Se acreditarán <b>{Number(monto).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</b>{" "}
              créditos en tu cuenta.
            </>
          ) : (
            <>Se acreditarán tus créditos en cuanto GoCuotas confirme el pago.</>
          )}
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/carrito" className="px-4 py-2 rounded-lg bg-black text-white">
            Ir al carrito
          </Link>
          <Link to="/" className="px-4 py-2 rounded-lg border">
            Inicio
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-4">Redirigiendo al carrito en 4 segundos…</p>
      </div>
    </div>
  );
}
