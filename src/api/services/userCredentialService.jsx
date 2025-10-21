import api from "../axiosConfig";

const endpoint = "/credentials";

// 🔹 Obtener todas las credenciales
export const getAllCredentials = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    throw error;
  }
};

// 🔹 Obtener credenciales paginadas
export const getAllCredentialsPaginated = async (
  page = 0,
  size = 10,
  sortBy = "",
  direction = "asc"
) => {
  try {
    const params = { page, size, direction };
    if (sortBy) params.sortBy = sortBy;

    const response = await api.get(`${endpoint}/page`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated credentials:", error);
    throw error;
  }
};

// 🔹 Obtener una credencial por ID
export const getCredentialById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credential by ID:", error);
    throw error;
  }
};

// 🔹 Crear una nueva credencial
export const createCredential = async (credentialData) => {
  try {
    const response = await api.post(endpoint, credentialData);
    return response.data;
  } catch (error) {
    console.error("Error creating credential:", error);
    throw error;
  }
};

// 🔹 Actualizar una credencial existente
export const updateCredential = async (id, credentialData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, credentialData);
    return response.data;
  } catch (error) {
    console.error("Error updating credential:", error);
    throw error;
  }
};

// 🔹 Eliminar una credencial
export const deleteCredential = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting credential:", error);
    throw error;
  }
};

// 🔹 Obtener todas las credenciales de un usuario por ID
export const getCredentialsByUserId = async (userId) => {
  try {
    const response = await api.get(`${endpoint}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credentials by userId:", error);
    throw error;
  }
};

// 🔹 Obtener credenciales de un usuario paginadas
export const getCredentialsByUserIdPaged = async (
  userId,
  page = 0,
  size = 10,
  sortBy = "",
  direction = "asc"
) => {
  try {
    const params = { page, size, direction };
    if (sortBy) params.sortBy = sortBy;

    const response = await api.get(`${endpoint}/user/${userId}/page`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated credentials by userId:", error);
    throw error;
  }
};
