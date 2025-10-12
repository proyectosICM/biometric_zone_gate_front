import api from "../axiosConfig";

const endpoint = "/users";

const AUTH_API = "http://telemetriaperu.com:7071";


export const login = async ({ username, password }) => {
  const response = await api.post(`${AUTH_API}/login`, { username, password });
  return response.data;
};

export const getUserByUsername = async (username) => {
  try {
    const response = await api.get(`${endpoint}/username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getAllUsersPaginated = async (
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
        console.error("Error fetching paginated users:", error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post(endpoint, userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`${endpoint}/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        await api.delete(`${endpoint}/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await api.get(`${endpoint}/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

export const getUserByUsernameAndPassword = async (username, password) => {
    try {
        const response = await api.get(`${endpoint}/login`, {
            params: { username, password },
        });
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

export const getUsersByCompanyId = async (companyId) => {
    try {
        const response = await api.get(`${endpoint}/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users by company:", error);
        throw error;
    }
};

export const getUsersByCompanyIdPaged = async (
    companyId,
    page = 0,
    size = 10,
    sortBy = "",
    direction = "asc"
) => {
    try {
        const params = { page, size, direction };
        if (sortBy) params.sortBy = sortBy;

        const response = await api.get(`${endpoint}/company/${companyId}/page`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated users by company:", error);
        throw error;
    }
};
