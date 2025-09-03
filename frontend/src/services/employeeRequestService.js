/**
 * employeeRequestService.js
 *
 * Modul ini menyediakan fungsi-fungsi untuk pengelolaan permintaan barang oleh pegawai
 * pada aplikasi SIAP. Fungsi-fungsi di bawah meliputi pembuatan permintaan baru,
 * pengambilan riwayat permintaan, pengambilan detail permintaan, dan pengunduhan bukti permintaan
 * dalam format PDF. Semua fungsi berinteraksi dengan endpoint API terkait permintaan barang.
 */

import api from "./api";

const API_URL = "/permintaan";

/**
 * Membuat permintaan barang baru oleh pegawai.
 *
 * Fungsi ini digunakan untuk mengirim data permintaan barang yang diajukan oleh pegawai
 * ke server SIAP. Data yang dikirim berisi informasi barang, jumlah, dan keterangan tambahan.
 *
 * Parameter:
 * - data (Object): Data permintaan barang yang akan diajukan, berisi informasi barang, jumlah, dan keterangan.
 *
 * Return:
 * - Promise: Response dari server setelah permintaan diajukan.
 */
export const createPermintaan = (data) => {
  return api.post(API_URL, data);
};

/**
 * Mengambil riwayat permintaan barang milik pegawai yang sedang login.
 *
 * Fungsi ini digunakan untuk mendapatkan daftar permintaan barang yang pernah diajukan oleh
 * pegawai. Data riwayat ini dapat digunakan untuk monitoring dan verifikasi status permintaan.
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
 * Mengambil detail permintaan barang berdasarkan ID permintaan.
 *
 * Fungsi ini digunakan untuk mendapatkan detail lengkap dari suatu permintaan barang,
 * baik oleh pegawai (hanya miliknya sendiri) maupun admin (semua permintaan).
 *
 * Parameter:
 * - id (string | number): ID permintaan barang yang ingin diambil detailnya.
 *
 * Return:
 * - Promise: Detail permintaan barang sesuai ID yang diberikan.
 */
export const getPermintaanById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

/**
 * Mengunduh file PDF bukti permintaan barang berdasarkan ID permintaan.
 *
 * Fungsi ini digunakan untuk mengunduh dokumen bukti permintaan barang dalam format PDF,
 * yang dapat digunakan sebagai arsip atau untuk proses verifikasi lebih lanjut.
 * Response berupa blob agar dapat langsung diolah sebagai file.
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
