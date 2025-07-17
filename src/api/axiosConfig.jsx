import axios from "axios";

export const API_BASE_URL = "http://telemetriaperu.com:7079/api/v1/";

// Configuración base de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación
/*
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bk_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/
export default api;