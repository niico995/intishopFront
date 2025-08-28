// src/api/verCreditos.js
import api from './axiosConfig';

export async function obtenerCreditos() {
  try {
    const { data } = await api.get('clientes/ver-creditos/');
    return data?.creditos_disponibles; // string, ej. "2000.00"
  } catch (error) {
    console.error('Error al obtener créditos:', error.response?.data || error.message);
    throw error;
  }
}
