import axios from "axios";

export const API_BASE_URL = "http://telemetriaperu.com:7788/api";
export const AUTH_API = "http://telemetriaperu.com:7788";

//export const API_BASE_URL = "http://localhost:7070/api";

// Configuración base de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bzg_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;