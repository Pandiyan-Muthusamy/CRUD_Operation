import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const fetchUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUser = async (userData) => {
  return await axios.post(API_URL, userData);
};

export const updateUser = async (id, userData) => {
  return await axios.put(`${API_URL}/${id}`, userData);
};

export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
