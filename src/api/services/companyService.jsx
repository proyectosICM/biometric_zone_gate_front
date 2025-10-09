import api from "../axiosConfig";

const endpoint = "/companies";

export const getAllCompanies = async () => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }
};

export const getAllCompaniesPaginated = async (
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
        console.error("Error fetching paginated companies:", error);
        throw error;
    }
};

export const getCompanyById = async (id) => {
    try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company by ID:", error);
        throw error;
    }
};

export const createCompany = async (companyData) => {
    try {
        const response = await api.post(endpoint, companyData);
        return response.data;
    } catch (error) {
        console.error("Error creating company:", error);
        throw error;
    }
};

export const updateCompany = async (id, companyData) => {
    try {
        const response = await api.put(`${endpoint}/${id}`, companyData);
        return response.data;
    } catch (error) {
        console.error("Error updating company:", error);
        throw error;
    }
};

export const deleteCompany = async (id) => {
    try {
        await api.delete(`${endpoint}/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting company:", error);
        throw error;
    }
};