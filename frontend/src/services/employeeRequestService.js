/**
 * employeeRequestService.js
 *
 * Modul ini berisi fungsi-fungsi untuk mengelola permintaan barang oleh pegawai
 * pada aplikasi SIAP. Fungsi-fungsi di bawah digunakan untuk membuat permintaan,
 * melihat riwayat, mendapatkan detail permintaan, dan mengunduh bukti permintaan
 * dalam format PDF.
 */

import api from "./api";

const API_URL = "/permintaan";

/**
 * Membuat permintaan barang baru oleh pegawai.
 *
 * Parameter:
 * - data (Object): Data permintaan barang yang akan diajukan, berisi informasi barang, jumlah, dan keterangan.
 *
 * Return:
 * - Promise: Hasil response dari server setelah permintaan diajukan.
 */
export const createPermintaan = (data) => {
  return api.post(API_URL, data);
};

/**
 * Mengambil riwayat permintaan barang yang pernah diajukan oleh pegawai.
 *
 * Parameter:
 * - Tidak ada parameter.
 *
 * Return:
 * - Promise: Daftar riwayat permintaan barang milik pegawai yang sedang login.
 */
export const getRiwayatPermintaan = () => {
  return api.get(`${API_URL}/riwayat`);
};

/**
 * Mengambil detail permintaan barang berdasarkan ID.
 *
 * Parameter:
 * - id (string | number): ID permintaan barang yang ingin diambil detailnya.
 *
 * Return:
 * - Promise: Detail permintaan barang. Pegawai hanya bisa melihat miliknya sendiri, admin bisa melihat semua.
 */
export const getPermintaanById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

/**
 * Mengunduh file PDF bukti permintaan barang berdasarkan ID permintaan.
 *
 * Parameter:
 * - id (string | number): ID permintaan barang yang ingin diunduh bukti PDF-nya.
 * - config (Object, opsional): Konfigurasi tambahan untuk request, misal header.
 *
 * Return:
 * - Promise: File PDF dalam bentuk blob sebagai bukti permintaan barang.
 */
export const getPermintaanPDF = (id, config = {}) => {
  // responseType: "blob" digunakan agar response berupa file PDF
  return api.get(`${API_URL}/${id}/pdf`, { responseType: "blob", ...config });
};
