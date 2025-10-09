import api from "../axiosConfig";

const endpoint = "/access-logs";

export const getAllAccessLogs = async () => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error fetching access logs:", error);
        throw error;
    }
};

export const getAllAccessLogsPaginated = async (
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
        console.error("Error fetching paginated access logs:", error);
        throw error;
    }
};

export const getAccessLogById = async (id) => {
    try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching access log by ID:", error);
        throw error;
    }
};

export const createAccessLog = async (logData) => {
    try {
        const response = await api.post(endpoint, logData);
        return response.data;
    } catch (error) {
        console.error("Error creating access log:", error);
        throw error;
    }
};

export const deleteAccessLog = async (id) => {
    try {
        await api.delete(`${endpoint}/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting access log:", error);
        throw error;
    }
};

export const getLogsByUser = async (userId) => {
    try {
        const response = await api.get(`${endpoint}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs by user:", error);
        throw error;
    }
};

export const getLogsByUserPaginated = async (
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
        console.error("Error fetching paginated logs by user:", error);
        throw error;
    }
};

export const getLogsByDevice = async (deviceId) => {
    try {
        const response = await api.get(`${endpoint}/device/${deviceId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs by device:", error);
        throw error;
    }
};

export const getLogsByDevicePaginated = async (
    deviceId,
    page = 0,
    size = 10,
    sortBy = "",
    direction = "asc"
) => {
    try {
        const params = { page, size, direction };
        if (sortBy) params.sortBy = sortBy;

        const response = await api.get(`${endpoint}/device/${deviceId}/page`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated logs by device:", error);
        throw error;
    }
};

export const getLogsByCompany = async (companyId) => {
    try {
        const response = await api.get(`${endpoint}/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs by company:", error);
        throw error;
    }
};

export const getLogsByCompanyPaginated = async (
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
        console.error("Error fetching paginated logs by company:", error);
        throw error;
    }
};

export const getLogsByAction = async (action) => {
    try {
        const response = await api.get(`${endpoint}/action/${action}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs by action:", error);
        throw error;
    }
};

export const getLogsByActionPaginated = async (
    action,
    page = 0,
    size = 10,
    sortBy = "",
    direction = "asc"
) => {
    try {
        const params = { page, size, direction };
        if (sortBy) params.sortBy = sortBy;

        const response = await api.get(`${endpoint}/action/${action}/page`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated logs by action:", error);
        throw error;
    }
};
