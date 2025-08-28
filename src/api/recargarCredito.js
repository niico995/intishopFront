import api from './axiosConfig';

/** Inicia una recarga con GoCuotas */
export async function crearRecarga(monto, extras = {}) {
  const payload = { monto, ...extras };
  const { data } = await api.post('clientes/crear-recarga/', payload);
  return data; // { message, checkout_url }
}

/** Devuelve el saldo disponible (string) */
export async function verCreditos() {
  const { data } = await api.get('clientes/ver-creditos/');
  return data.creditos_disponibles;
}

/** Historial de recargas del cliente */
export async function historialRecargas() {
  const { data } = await api.get('clientes/historial-recargas/');
  return data;
}

/** Confirmar compra usando créditos */
export async function confirmarCompraConCredito(payload) {
  const { data } = await api.post('clientes/compras/confirmar/', payload);
  return data; // { message }
}

/** Carga manual de créditos (para pruebas) */
export async function cargarCreditoManual(monto) {
  const { data } = await api.post('clientes/cargar-credito/', { monto });
  return data;
}
