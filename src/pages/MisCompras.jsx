import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "../utils/notify";

let api = axiosInstance()

export default function MisCompras() {
  const [ventas, setVentas] = useState([]);

  const cargar = async () => {
    const { data } = await api.get("/ventas/");
    setVentas(data);
  };
  useEffect(() => { cargar(); }, []);

  const recibido = async (id) => {
    try {
      await api.post(`/ventas/${id}/marcar_recibido/`);
      toast("Marcada como recibida", "success");
      cargar();
    } catch (e) {
      toast(e?.response?.data?.error || "No se pudo marcar recibida", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Mis compras</h2>
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
              disabled={v.cliente_recibio}
              onClick={() => recibido(v.id)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              {v.cliente_recibio ? "Recibida" : "Marcar recibida"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
