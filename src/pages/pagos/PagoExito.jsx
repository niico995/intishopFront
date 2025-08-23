import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const DASHBOARD_PATH = "/dashboard-cliente"; // <-- cambialo si tu dashboard es otro

export default function PagoExito() {
  const navigate = useNavigate();

  // Redirección opcional automática al dashboard (5s)
  useEffect(() => {
    const t = setTimeout(() => navigate(DASHBOARD_PATH), 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-2">¡Pago recibido! 🎉</h1>
        <p className="mb-6">
          Tu recarga fue procesada correctamente. En unos segundos te llevamos al dashboard.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to={DASHBOARD_PATH}
            className="px-4 py-2 rounded-lg border"
          >
            Ir al Dashboard
          </Link>
          <Link to="/" className="px-4 py-2 rounded-lg underline">
            Inicio
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-4">Redirigiendo en 5 segundos…</p>
      </div>
    </div>
  );
}
