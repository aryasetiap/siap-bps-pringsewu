/**
 * userService.js
 *
 * Modul ini berisi kumpulan fungsi untuk mengelola data user pada aplikasi SIAP.
 * Fungsinya meliputi pembuatan user baru, pengambilan data user, pembaruan data user,
 * penghapusan user, serta pengelolaan profil user yang sedang login.
 *
 * Setiap fungsi menggunakan instance 'api' untuk berkomunikasi dengan backend melalui endpoint '/user'.
 *
 * Konteks bisnis: Digunakan untuk pengelolaan user, termasuk admin dan pegawai, serta verifikasi akses data.
 */

import api from "./api";

const API_URL = "/user";

/**
 * Membuat user baru oleh admin.
 *
 * Parameter:
 * - data (Object): Data user baru yang akan dibuat (misal: username, password, role, dll).
 *
 * Return:
 * - Promise: Response dari server berisi data user yang telah dibuat.
 */
export const createUser = (data) => api.post(API_URL, data);

/**
 * Mengambil daftar seluruh user (hanya untuk admin).
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Response dari server berisi array data user.
 */
export const getAllUsers = () => api.get(API_URL);

/**
 * Mengambil data user berdasarkan ID (hanya untuk admin).
 *
 * Parameter:
 * - id (string|number): ID unik dari user yang ingin diambil datanya.
 *
 * Return:
 * - Promise: Response dari server berisi data user sesuai ID.
 */
export const getUserById = (id) => api.get(`${API_URL}/${id}`);

/**
 * Memperbarui data user berdasarkan ID (hanya untuk admin).
 *
 * Parameter:
 * - id (string|number): ID unik dari user yang ingin diperbarui.
 * - data (Object): Data baru yang akan diperbarui pada user.
 *
 * Return:
 * - Promise: Response dari server berisi data user yang telah diperbarui.
 */
export const updateUser = (id, data) => api.patch(`${API_URL}/${id}`, data);

/**
 * Melakukan soft delete user berdasarkan ID (hanya untuk admin).
 * Soft delete berarti user tidak dihapus permanen, hanya dinonaktifkan.
 *
 * Parameter:
 * - id (string|number): ID unik dari user yang ingin dihapus.
 *
 * Return:
 * - Promise: Response dari server terkait status penghapusan.
 */
export const deleteUserById = (id) => api.delete(`${API_URL}/${id}`);

/**
 * Menghapus user berdasarkan username (khusus untuk testing/dev oleh admin).
 *
 * Parameter:
 * - username (string): Username dari user yang ingin dihapus.
 *
 * Return:
 * - Promise: Response dari server terkait status penghapusan.
 */
export const deleteUserByUsername = (username) =>
  api.delete(API_URL, { data: { username } });

/**
 * Mengambil profil user yang sedang login.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Response dari server berisi data profil user yang sedang login.
 */
export const getProfile = () => api.get(`${API_URL}/profile`);

/**
 * Memperbarui profil user yang sedang login.
 *
 * Parameter:
 * - data (Object): Data baru untuk profil user (misal: nama, email, dll).
 *
 * Return:
 * - Promise: Response dari server berisi data profil yang telah diperbarui.
 */
export const updateProfile = (data) => api.patch(`${API_URL}/profile`, data);

/**
 * Mengunggah atau memperbarui foto profil user yang sedang login.
 *
 * Parameter:
 * - formData (FormData): Data foto profil dalam format FormData.
 *
 * Return:
 * - Promise: Response dari server terkait status upload foto.
 */
export const updateProfilePhoto = (formData) =>
  api.patch(`${API_URL}/profile/foto`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Mengambil data khusus yang hanya dapat diakses oleh admin.
 * Biasanya digunakan untuk verifikasi hak akses atau data sensitif.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Response dari server berisi data khusus admin.
 */
export const getAdminOnlyData = () => api.get(`${API_URL}/admin-only`);

/**
 * Mengambil data khusus yang hanya dapat diakses oleh pegawai.
 * Digunakan untuk membatasi akses data sesuai peran user.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Response dari server berisi data khusus pegawai.
 */
export const getPegawaiOnlyData = () => api.get(`${API_URL}/pegawai-only`);
