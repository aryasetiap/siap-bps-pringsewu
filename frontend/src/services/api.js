/**
 * File ini berisi konfigurasi dan utilitas untuk komunikasi dengan API backend SIAP.
 * Digunakan untuk pengelolaan barang, permintaan, dan verifikasi pada aplikasi SIAP.
 *
 * Semua request menggunakan axios dengan interceptors untuk penanganan token dan error global.
 */

import axios from "axios";
import { toast } from "react-toastify";

/**
 * Membuat instance axios dengan konfigurasi default untuk komunikasi API SIAP.
 *
 * Return:
 * - axios instance: Instance axios yang sudah dikonfigurasi untuk komunikasi dengan backend SIAP
 */
const api = axios.create({
  baseURL: "/api", // Base URL API SIAP
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor request untuk menambahkan token autentikasi ke setiap request.
 *
 * Parameter:
 * - config (object): Konfigurasi request axios
 *
 * Return:
 * - object: Konfigurasi request yang sudah ditambahkan header Authorization jika token tersedia
 */
api.interceptors.request.use(
  /**
   * Fungsi ini digunakan untuk menambahkan header Authorization ke setiap request jika token tersedia.
   *
   * Parameter:
   * - config (object): Konfigurasi request axios
   *
   * Return:
   * - object: Konfigurasi request yang sudah ditambahkan header Authorization jika token tersedia
   */
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  /**
   * Fungsi ini digunakan untuk menangani error pada saat request sebelum dikirim ke server.
   *
   * Parameter:
   * - error (object): Error dari axios
   *
   * Return:
   * - Promise: Promise yang menolak error
   */
  (error) => Promise.reject(error)
);

/**
 * Interceptor response untuk penanganan error global pada aplikasi SIAP.
 * Menampilkan notifikasi error dan melakukan redirect sesuai status error.
 *
 * Parameter:
 * - response (object): Response dari server
 * - error (object): Error dari server atau jaringan
 *
 * Return:
 * - object: Response jika sukses, atau Promise.reject(error) jika gagal
 */
api.interceptors.response.use(
  /**
   * Fungsi ini digunakan untuk mengembalikan response jika request berhasil.
   *
   * Parameter:
   * - response (object): Response dari server
   *
   * Return:
   * - object: Response dari server
   */
  (response) => response,
  /**
   * Fungsi ini digunakan untuk menangani error response dari server secara global.
   * Menampilkan notifikasi error dan melakukan redirect sesuai status error.
   *
   * Parameter:
   * - error (object): Error dari server atau jaringan
   *
   * Return:
   * - Promise: Promise yang menolak error
   */
  (error) => {
    let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

    if (error.response) {
      const { status, data } = error.response;

      /**
       * Penanganan error berdasarkan status kode HTTP.
       * - 400/422: Validasi input barang/permintaan/verifikasi gagal
       * - 401: Token tidak valid/expired, sesi login berakhir
       * - 403: User tidak punya akses ke fitur tertentu
       * - 404: Data barang/permintaan/verifikasi tidak ditemukan
       * - 429: Terlalu banyak permintaan ke server
       * - 500: Error server
       */
      switch (status) {
        case 400:
        case 422:
          errorMessage =
            data?.message || "Data tidak valid. Periksa kembali input Anda.";
          break;
        case 401:
          errorMessage = "Sesi login telah berakhir. Silakan login kembali.";
          // Hapus data autentikasi dari localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("username");
          // Redirect ke halaman login jika belum di halaman login
          if (window.location.pathname !== "/login") {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
          break;
        case 403:
          errorMessage = "Anda tidak memiliki akses untuk operasi ini.";
          // Redirect ke halaman forbidden jika belum di halaman forbidden
          if (window.location.pathname !== "/forbidden") {
            setTimeout(() => {
              window.location.href = "/forbidden";
            }, 1500);
          }
          break;
        case 404:
          errorMessage = "Data tidak ditemukan.";
          break;
        case 429:
          errorMessage = "Terlalu banyak permintaan. Coba lagi nanti.";
          break;
        case 500:
          errorMessage =
            "Terjadi kesalahan pada server. Silakan hubungi administrator.";
          break;
        default:
          errorMessage = data?.message || errorMessage;
      }
    } else if (error.request) {
      // Jika request tidak mendapatkan respon (misal: masalah jaringan)
      errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
    }

    // Tampilkan notifikasi error menggunakan toast
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default api;
