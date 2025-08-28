// src/api/verCreditos.js
import api from './axiosConfig';

export async function obtenerCreditos() {
  const { data } = await api.get('gocuotas/ver-creditos/');
  return data?.creditos_disponibles;
}
