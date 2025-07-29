import axios from "axios";

const API_URL = "/api/permintaan";

export const getAllPermintaan = () => axios.get(API_URL);
export const getPermintaanById = (id) => axios.get(`${API_URL}/${id}`);
export const verifikasiPermintaan = (id, data) =>
  axios.patch(`${API_URL}/${id}/verifikasi`, data);
export const getRiwayatPermintaanPegawai = () =>
  axios.get("/api/permintaan/riwayat");
