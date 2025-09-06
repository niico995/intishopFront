import axios from "./axiosConfig";

export const getMiPerfil = () => axios.get("/sellers/mi-perfil/");
export const crearPerfil = (payload) => axios.post("/sellers/crear-perfil/", payload);
export const actualizarPerfil = (payload) => axios.put("/sellers/mi-perfil/", payload);
