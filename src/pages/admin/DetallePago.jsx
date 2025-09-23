import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import axiosAuth from "../../api/axiosAuth";

export default function DetallePagos() {
  const { id } = useParams(); // socio_id
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await axiosAuth.get(`admin/pagos/socio/${id}/`);
        setPagos(res.data);
      } catch (err) {
        console.error('❌ Error al cargar detalle:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Cargando detalle de pagos...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Pagos del Socio #{id}</h2>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-2 py-1">Producto</th>
            <th className="border px-2 py-1">Fecha venta</th>
            <th className="border px-2 py-1">Fecha pago</th>
            <th className="border px-2 py-1">Monto</th>
            <th className="border px-2 py-1">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.producto}</td>
              <td className="border px-2 py-1">{p.fecha_venta}</td>
              <td className="border px-2 py-1">{p.fecha_pago}</td>
              <td className="border px-2 py-1">${parseFloat(p.monto).toFixed(2)}</td>
              <td className={`border px-2 py-1 ${p.estado === 'pagado' ? 'text-green-600' : 'text-red-600'}`}>
                {p.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
