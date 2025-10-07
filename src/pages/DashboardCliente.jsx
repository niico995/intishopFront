import { useNavigate } from "react-router-dom";
import RecargaCredito from "./RecargarCredito";
import CreditosDisponibles from "./CreditosDisponibles";

export default function DashboardCliente() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("last_recarga_monto");
      localStorage.clear();
    } catch {}
    navigate("/");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Panel del Cliente</h2>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Acciones rápidas: siempre arriba y visibles */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <button
          onClick={() => navigate("/cliente/perfil")}
          className="rounded-xl bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700"
        >
          Cargar/Ver mi perfil
        </button>

        <button
          onClick={() => navigate("/cliente/compras")}
          className="rounded-xl bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700"
        >
          Ver mis compras (marcar recibida)
        </button>

        {/* Si querés, podés sumar más acciones acá */}
      </div>

      {/* Contenido en grilla: en desktop se ve todo sin scroll */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recarga ocupa más ancho en md+ */}
        <section className="rounded-2xl bg-white p-5 shadow md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Recargar créditos</h3>
          <RecargaCredito />
        </section>

        <section className="rounded-2xl bg-white p-5 shadow">
          <h3 className="mb-4 text-lg font-semibold">Créditos disponibles</h3>
          <CreditosDisponibles />
        </section>
      </div>
    </div>
  );
}
