import axios from "./axiosConfig";

export const getCategorias = () => axios.get("/products/categorias/");
export const getDestacados = () => axios.get("/products/home/destacados/");
export const getProductosPorCategoria = (nombreOSlug) =>
  axios.get(`/products/categoria/${encodeURIComponent(nombreOSlug)}/`);
