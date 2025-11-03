// src/api/services/alertService.js
import api from "../axiosConfig";

const endpoint = "/alerts";

// ---------- BÁSICOS ----------
export const getAlertById = async (id) => {
  try {
    const { data } = await api.get(`${endpoint}/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching alert by ID:", error);
    throw error;
  }
};

export const getAllAlerts = async () => {
  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

export const getAllAlertsPaginated = async (
  page = 0,
  size = 10,
  sort = "createdAt",
  direction = "DESC"
) => {
  try {
    const params = { page, size, direction };
    if (sort) params.sort = sort; // El controller espera 'sort'
    const { data } = await api.get(`${endpoint}/page`, { params });
    return data;
  } catch (error) {
    console.error("Error fetching paginated alerts:", error);
    throw error;
  }
};

export const createAlert = async (alertData) => {
  try {
    const { data } = await api.post(endpoint, alertData);
    return data;
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
};

export const updateAlert = async (id, alertData) => {
  try {
    const { data } = await api.put(`${endpoint}/${id}`, alertData);
    return data;
  } catch (error) {
    console.error("Error updating alert:", error);
    throw error;
  }
};

export const deleteAlert = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw error;
  }
};

// ---------- POR EMPRESA ----------
export const getAlertsByCompanyId = async (companyId) => {
  try {
    const { data } = await api.get(`${endpoint}/company/${companyId}`);
    return data;
  } catch (error) {
    console.error("Error fetching alerts by company:", error);
    throw error;
  }
};

export const getAlertsByCompanyIdPaged = async (
  companyId,
  page = 0,
  size = 10,
  sort = "createdAt",
  direction = "DESC"
) => {
  try {
    const params = { page, size, direction };
    if (sort) params.sort = sort; // El controller espera 'sort'
    const { data } = await api.get(`${endpoint}/company/${companyId}/paged`, { params });
    return data;
  } catch (error) {
    console.error("Error fetching paginated alerts by company:", error);
    throw error;
  }
};

// ---------- HELPERS ÚTILES ----------
/** Devuelve las N alertas más recientes globales usando la paginación */
export const getRecentAlerts = async (limit = 5) => {
  const page = 0;
  const size = Math.max(1, limit);
  return getAllAlertsPaginated(page, size, "createdAt", "DESC");
};

/** Devuelve las N alertas más recientes de una compañía usando la paginación */
export const getRecentAlertsByCompany = async (companyId, limit = 5) => {
  const page = 0;
  const size = Math.max(1, limit);
  return getAlertsByCompanyIdPaged(companyId, page, size, "createdAt", "DESC");
};
