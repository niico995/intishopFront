// Helpers de API centralizados
import axiosInstance from "./axiosConfig";
import axiosAuth from "./axiosConfig"; // tu instancia con JWT

// ----- Público / Tienda -----
export const getHomeDestacados = (params) =>
  axiosInstance.get("/api/products/home/destacados/", { params });

export const getBannersPublicos = () =>
  axiosInstance.get("/api/products/banners/publico/");

export const listarPublicos = (params) =>
  axiosInstance.get("/api/products/publico/productos/", { params });

export const listarCompat = (params) =>
  axiosInstance.get("/api/products/tienda/productos/", { params });

export const getProductoPublico = (id) =>
  axiosInstance.get(`/api/products/tienda/producto/${id}/`);

// ----- Categorías -----
export const listarCategorias = () =>
  axiosInstance.get("/api/products/categorias/");

export const crearCategoria = (nombre) =>
  axiosAuth.post("/api/products/categorias/crear/", { nombre });

// ----- Socio (CRUD) -----
export const crearProducto = (payload) =>
  axiosAuth.post("/api/products/crear/", payload);

export const misProductos = (params) =>
  axiosAuth.get("/api/products/mis-productos/", { params });

export const getProductoSeller = (id) =>
  axiosAuth.get(`/api/products/producto/${id}/`);

export const actualizarProducto = (id, payload) =>
  axiosAuth.patch(`/api/products/producto/${id}/actualizar/`, payload);

export const eliminarProducto = (id) =>
  axiosAuth.delete(`/api/products/producto/${id}/eliminar/`);

// ----- Imágenes -----
export const uploadProductImage = (productId, file, { is_primary = false, sort_order = 0 } = {}) => {
  const form = new FormData();
  form.append("product_id", productId);
  form.append("file", file);
  form.append("is_primary", is_primary);
  form.append("sort_order", sort_order);
  return axiosAuth.post("/api/products/products/images/upload/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const listProductImages = (productId) =>
  axiosAuth.get(`/api/products/products/images/`, { params: { product_id: productId } });

export const setPrimaryImage = (imageId) =>
  axiosAuth.post(`/api/products/products/images/${imageId}/set-primary/`);

export const deleteProductImage = (imageId) =>
  axiosAuth.delete(`/api/products/products/images/${imageId}/eliminar/`);
