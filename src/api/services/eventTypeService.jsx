import api from "../axiosConfig";

const endpoint = "/event-types";

export const getAllEventTypes = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching event types:", error);
    throw error;
  }
};

export const getEventTypeById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event type with id ${id}:`, error);
    throw error;
  }
};

export const getEventTypeByCode = async (code) => {
  try {
    const response = await api.get(`${endpoint}/code/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event type with code ${code}:`, error);
    throw error;
  }
};

export const createEventType = async (eventType) => {
  try {
    const response = await api.post(endpoint, eventType);
    return response.data;
  } catch (error) {
    console.error("Error creating event type:", error);
    throw error;
  }
};

export const updateEventType = async (id, eventType) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, eventType);
    return response.data;
  } catch (error) {
    console.error(`Error updating event type with id ${id}:`, error);
    throw error;
  }
};

export const deleteEventType = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting event type with id ${id}:`, error);
    throw error;
  }
};

export const clearAllEventTypes = async () => {
  try {
    const response = await api.delete(`${endpoint}/clear`);
    return response.data;
  } catch (error) {
    console.error("Error clearing all event types:", error);
    throw error;
  }
};
