import axios from "axios";

const API_URL = "/api/barang";

export const getAllBarang = () => axios.get(API_URL);
export const getBarangById = (id) => axios.get(`${API_URL}/${id}`);
export const createBarang = (data) => axios.post(API_URL, data);
export const updateBarang = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteBarang = (id) => axios.delete(`${API_URL}/${id}`);
export const tambahStok = (id, data) =>
  axios.post(`${API_URL}/${id}/tambah-stok`, data);
