import api from "../axiosConfig";

const endpoint = "/device-user-access";

// ===============================
// CRUD BÁSICO
// ===============================

// Obtener todos (sin paginar)
export const getAllDeviceUserAccess = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching device-user-access list:", error);
    throw error;
  }
};

// Obtener paginados
export const getAllDeviceUserAccessPaged = async (page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;
    const response = await api.get(`${endpoint}/paged`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated device-user-access:", error);
    throw error;
  }
};

// Obtener por ID
export const getDeviceUserAccessById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching device-user-access with id ${id}:`, error);
    throw error;
  }
};

// Crear
export const createDeviceUserAccess = async (data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error creating device-user-access:", error);
    throw error;
  }
};

// Actualizar
export const updateDeviceUserAccess = async (id, data) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating device-user-access with id ${id}:`, error);
    throw error;
  }
};

// Eliminar
export const deleteDeviceUserAccess = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting device-user-access with id ${id}:`, error);
    throw error;
  }
};

// ===============================
// FILTROS PERSONALIZADOS
// ===============================

// Por usuario
export const getByUserId = async (userId) => {
  try {
    const response = await api.get(`${endpoint}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching by userId ${userId}:`, error);
    throw error;
  }
};

export const getByUserIdPaged = async (userId, page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;
    const response = await api.get(`${endpoint}/user/${userId}/paged`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching paged by userId ${userId}:`, error);
    throw error;
  }
};

// Por dispositivo
export const getByDeviceId = async (deviceId) => {
  try {
    const response = await api.get(`${endpoint}/device/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching by deviceId ${deviceId}:`, error);
    throw error;
  }
};

export const getByDeviceIdPaged = async (deviceId, page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;
    const response = await api.get(`${endpoint}/device/${deviceId}/paged`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching paged by deviceId ${deviceId}:`, error);
    throw error;
  }
};

// Por dispositivo habilitado
export const getByDeviceIdAndEnabledTrue = async (deviceId, page = 0, size = 10) => {
  try {
    const params = { page, size };
    const response = await api.get(`${endpoint}/device/${deviceId}/enabled`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching enabled by deviceId ${deviceId}:`, error);
    throw error;
  }
};

// Por grupo
export const getByGroupNumber = async (groupNumber) => {
  try {
    const response = await api.get(`${endpoint}/group/${groupNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching by groupNumber ${groupNumber}:`, error);
    throw error;
  }
};

export const getByGroupNumberPaged = async (groupNumber, page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;
    const response = await api.get(`${endpoint}/group/${groupNumber}/paged`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching paged by groupNumber ${groupNumber}:`, error);
    throw error;
  }
};

// Solo habilitados
export const getEnabled = async () => {
  try {
    const response = await api.get(`${endpoint}/enabled`);
    return response.data;
  } catch (error) {
    console.error("Error fetching enabled device-user-access:", error);
    throw error;
  }
};

export const getEnabledPaged = async (page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;
    const response = await api.get(`${endpoint}/enabled/paged`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated enabled device-user-access:", error);
    throw error;
  }
};

// Por usuario + dispositivo
export const getByUserAndDevice = async (userId, deviceId) => {
  try {
    const response = await api.get(`${endpoint}/user/${userId}/device/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching by user ${userId} and device ${deviceId}:`, error);
    throw error;
  }
};

// Por usuario + dispositivo habilitado
export const getByUserAndDeviceEnabled = async (userId, deviceId) => {
  try {
    const response = await api.get(`${endpoint}/user/${userId}/device/${deviceId}/enabled`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching enabled by user ${userId} and device ${deviceId}:`, error);
    throw error;
  }
};
