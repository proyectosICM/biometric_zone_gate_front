import api from "../axiosConfig";

const endpoint = "/devices";

export const getDeviceById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching device by ID:", error);
    throw error;
  }
};

export const sendDeviceSettings = async (id, settingDTO) => {
  try {
    const response = await api.post(`${endpoint}/${id}/settings/send`, settingDTO);
    return response.data;
  } catch (error) {
    console.error("Error sending device settings:", error);
    throw error;
  }
};

export const createDevice = async (deviceData) => {
  try {
    const response = await api.post(`${endpoint}`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
};

export const updateDevice = async (id, deviceData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};

export const deleteDevice = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};
