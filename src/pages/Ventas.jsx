import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

let api = axiosInstance()
export default function VentasVendedor() {
  const [ventas, setVentas] = useState([]);

  const cargar = async () => {
    const { data } = await api.get("/ventas/");
    setVentas(data);
  };
  useEffect(() => { cargar(); }, []);

  const entregar = async (id) => {
    try {
      await api.post(`/ventas/${id}/marcar_entregado/`);
      toast("Marcada como entregada", "success");
      cargar();
    } catch {
      toast("No se pudo marcar entregada", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Mis ventas</h2>
      <div className="grid gap-2">
        {ventas.map(v => (
          <div key={v.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{v.producto_nombre}</div>
              <div className="text-sm text-gray-600">
                Cant: {v.cantidad} • ${v.precio_unitario} • Estado: {v.estado}
              </div>
            </div>
            <button
              disabled={v.vendedor_entrego}
              onClick={() => entregar(v.id)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              {v.vendedor_entrego ? "Entregada" : "Marcar entregada"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
