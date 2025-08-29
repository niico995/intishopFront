// src/api/recargarCredito.js
import api from './axiosConfig';

/** Inicia una recarga con GoCuotas -> { message, checkout_url } */
export async function crearRecarga(monto, extras = {}) {
  const payload = { monto, ...extras };
  const { data } = await api.post('gocuotas/crear-recarga/', payload);
  return data;
}

/** Saldo disponible (string con 2 decimales) */
export async function verCreditos() {
  const { data } = await api.get('gocuotas/ver-creditos/');
  return data.creditos_disponibles;
}

/** Historial de recargas (array) */
export async function historialRecargas() {
  const { data } = await api.get('gocuotas/historial-recargas/');
  return data;
}

/** Confirmar compra usando créditos -> { message } */
export async function confirmarCompraConCredito(payload) {
  const { data } = await api.post('ventas/confirmar/', payload);
  return data;
}

/** Carga manual (si la usás para pruebas) */
export async function cargarCreditoManual(monto) {
  const { data } = await api.post('gocuotas/cargar-credito/', { monto });
  return data;
}
