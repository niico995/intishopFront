import { useNavigate, Link } from "react-router-dom";

const DASHBOARD_PATH = "/dashboard-cliente"; // <-- cambialo si tu dashboard es otro

export default function PagoError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-2">No pudimos completar el pago</h1>
        <p className="mb-6">
          La operación fue cancelada o falló. Podés intentarlo de nuevo desde tu dashboard.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to={DASHBOARD_PATH}
            className="px-4 py-2 rounded-lg border"
          >
            Reintentar en el Dashboard
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg underline"
            type="button"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
