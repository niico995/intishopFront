// import axios from "./axiosConfig";

// export const getCategorias = () => axios.get("/products/categorias/");
// export const getDestacados = () => axios.get("/products/home/destacados/");
// export const getProductosPorCategoria = (nombreOSlug) =>
//   axios.get(`/products/categoria/${encodeURIComponent(nombreOSlug)}/`);
// src/api/products.js
import axios from "./axiosConfig";

export const getCategorias = () => axios.get("products/categorias/");
export const getDestacados = () => axios.get("products/home/destacados/");
export const getProductosPorCategoria = (nombreOSlug) =>
  axios.get(`products/categoria/${encodeURIComponent(nombreOSlug)}/`);

export const buscarProductos = (q, page = 1) =>
  axios.get(`products/buscar/?q=${encodeURIComponent(q)}&page=${page}`);
