import api from "../axiosConfig";

const endpoint = "/devices";

// Obtener todos los dispositivos (sin paginar)
export const getAllDevices = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

// Obtener dispositivos paginados
export const getAllDevicesPaginated = async (page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;
    const response = await api.get(`${endpoint}/page`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated devices:", error);
    throw error;
  }
};

// Obtener dispositivo por ID
export const getDeviceById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching device with id ${id}:`, error);
    throw error;
  }
};

// Obtener dispositivo por nombre
export const getDeviceByName = async (name) => {
  try {
    const response = await api.get(`${endpoint}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching device with name ${name}:`, error);
    throw error;
  }
};

// Crear dispositivo
export const createDevice = async (device) => {
  try {
    const response = await api.post(endpoint, device);
    return response.data;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
};

// Actualizar dispositivo
export const updateDevice = async (id, device) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, device);
    return response.data;
  } catch (error) {
    console.error(`Error updating device with id ${id}:`, error);
    throw error;
  }
};

// Eliminar dispositivo
export const deleteDevice = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting device with id ${id}:`, error);
    throw error;
  }
};

// Sincronizar usuarios desde dispositivo
export const syncUsers = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}/sync-users`);
    return response.data;
  } catch (error) {
    console.error(`Error syncing users for device ${id}:`, error);
    throw error;
  }
};

// Enviar usuario a dispositivo
export const pushUser = async (id, user) => {
  try {
    const response = await api.post(`${endpoint}/${id}/push-user`, user);
    return response.data;
  } catch (error) {
    console.error(`Error pushing user to device ${id}:`, error);
    throw error;
  }
};

// Eliminar un usuario de un dispositivo
export const deleteUser = async (id, userId) => {
  try {
    const response = await api.delete(`${endpoint}/${id}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId} from device ${id}:`, error);
    throw error;
  }
};

// Limpiar todos los usuarios de un dispositivo
export const clearAllUsers = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}/users`);
    return response.data;
  } catch (error) {
    console.error(`Error clearing users from device ${id}:`, error);
    throw error;
  }
};

// Listar dispositivos de una empresa
export const listByCompany = async (companyId) => {
  try {
    const response = await api.get(`${endpoint}/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching devices for company ${companyId}:`, error);
    throw error;
  }
};

// Listar dispositivos de una empresa paginados
export const listByCompanyPaginated = async (companyId, page = 0, size = 10, sortBy, direction = "asc") => {
  try {
    const params = { page, size };
    if (sortBy) params.sortBy = sortBy;
    if (direction) params.direction = direction;

    const response = await api.get(`${endpoint}/company/${companyId}/page`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching paginated devices for company ${companyId}:`, error);
    throw error;
  }
};

export const cleanAdmins = async (id) => {
  try {
    const { data } = await api.post(`${endpoint}/${id}/clean-admins`);
    return data;
  } catch (error) {
    console.error("Error cleaning admins:", error);
    throw error;
  }
};

export const syncDeviceTimeNow = async (id) => {
  try {
    const { data } = await api.post(`${endpoint}/${id}/settime`);
    return data;
  } catch (error) {
    console.error("Error syncing device time (now):", error);
    throw error;
  }
};

export const syncDeviceTimeCustom = async (id, datetime) => {
  try {
    const params = new URLSearchParams({ datetime }).toString();
    const { data } = await api.post(`${endpoint}/${id}/settime/custom?${params}`);
    return data;
  } catch (error) {
    console.error("Error syncing device time (custom):", error);
    throw error;
  }
};

export const openDoor = async (id) => {
  try {
    const { data } = await api.post(`${endpoint}/${id}/open-door`);
    return data;
  } catch (error) {
    console.error("Error opening door:", error);
    throw error;
  }
};

export const getDeviceInfo = async (id) => {
  try {
    const { data } = await api.post(`${endpoint}/${id}/get-devinfo`);
    return data;
  } catch (error) {
    console.error("Error getting device info:", error);
    throw error;
  }
};

export const cleanDeviceLogs = async (id) => {
  try {
    const { data } = await api.post(`${endpoint}/${id}/clean-logs`);
    return data;
  } catch (error) {
    console.error("Error cleaning device logs:", error);
    throw error;
  }
};

export const getNewLogs = async (id) => {
  try {
    const { data } = await api.post(`${endpoint}/${id}/get-newlog`);
    return data;
  } catch (error) {
    console.error("Error getting new logs:", error);
    throw error;
  }
};