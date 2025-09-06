import axiosInstance from '../api/axiosConfig';

const api = {
  products: {
    destacados: () => axiosInstance.get('/products/home/destacados/'),
    categorias:  () => axiosInstance.get('/products/categorias/'),
  },
  users: {
    me:    () => axiosInstance.get('/users/me/'),
    login: (data) => axiosInstance.post('/users/login/', data),
  },
  sellers: {
    miPerfil: () => axiosInstance.get('/sellers/mi-perfil/'),
  },
};

export default api;

// Exponer compat global para vistas viejas que usan window.api
if (typeof window !== 'undefined') {
  window.api = api;
}
