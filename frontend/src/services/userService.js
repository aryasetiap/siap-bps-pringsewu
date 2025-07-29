import axios from "axios";

const API_URL = "/api/user";

export const getAllUsers = () => axios.get(API_URL);
export const createUser = (data) => axios.post(API_URL, data);
export const updateUser = (id, data) => axios.patch(`${API_URL}/${id}`, data);
export const toggleUserStatus = (id, status) =>
  axios.patch(`${API_URL}/${id}`, { status_aktif: status });
