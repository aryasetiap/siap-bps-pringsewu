import api from "./api";

const API_URL = "/user";

// 1. Membuat User Baru (Admin)
export const createUser = (data) => api.post(API_URL, data);

// 2. Mengambil Daftar Seluruh User (Admin)
export const getAllUsers = () => api.get(API_URL);

// 3. Mengambil Data User Berdasarkan ID (Admin)
export const getUserById = (id) => api.get(`${API_URL}/${id}`);

// 4. Memperbarui Data User Berdasarkan ID (Admin)
export const updateUser = (id, data) => api.patch(`${API_URL}/${id}`, data);

// 5. Soft Delete User Berdasarkan ID (Admin)
export const deleteUserById = (id) => api.delete(`${API_URL}/${id}`);

// 6. Menghapus User Berdasarkan Username (Admin, untuk testing/dev)
export const deleteUserByUsername = (username) =>
  api.delete(API_URL, { data: { username } });

// 7. Mengambil Profil User yang Sedang Login
export const getProfile = () => api.get(`${API_URL}/profile`);

// 8. Memperbarui Profil User yang Sedang Login
export const updateProfile = (data) => api.patch(`${API_URL}/profile`, data);

// 9. Upload/Update Foto Profil User yang Sedang Login
export const updateProfilePhoto = (formData) =>
  api.patch(`${API_URL}/profile/foto`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 10. Endpoint Khusus Role
export const getAdminOnlyData = () => api.get(`${API_URL}/admin-only`);
export const getPegawaiOnlyData = () => api.get(`${API_URL}/pegawai-only`);
