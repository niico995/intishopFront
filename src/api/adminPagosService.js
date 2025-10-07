// src/api/adminPagosService.js
import api from "./axiosConfig";

// Lista pendientes agrupados por seller (con items)
export const getPendientesResumen = async (params = {}) => {
  const { seller_id, desde, hasta } = params;
  const { data } = await api.get("ventas/admin/pagos/pendientes-resumen/", {
    params: { seller_id, desde, hasta },
  });
  return data;
};

// Marcar pagados por selección de IDs
export const marcarSeleccionPagada = async ({ seller_id, ids, referencia }) => {
  const { data } = await api.post("ventas/admin/pagos/marcar-seleccion/", {
    seller_id,
    ids,
    referencia: referencia || "",
  });
  return data;
};

// Marcar pagados hasta una fecha (incluida)
export const marcarHastaFechaPagada = async ({ seller_id, hasta_fecha, referencia }) => {
  const { data } = await api.post("ventas/admin/pagos/marcar-hasta-fecha/", {
    seller_id,
    hasta_fecha,
    referencia: referencia || "",
  });
  return data;
};
