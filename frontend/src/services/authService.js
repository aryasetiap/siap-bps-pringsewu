/**
 * authService.js
 *
 * Modul ini menyediakan service untuk autentikasi dan manajemen user pada aplikasi SIAP BPS Pringsewu.
 * Digunakan untuk login, logout, verifikasi token, dan mengambil data user yang sedang login.
 *
 * Konteks bisnis:
 * - Pengelolaan barang
 * - Permintaan barang
 * - Verifikasi user pada aplikasi SIAP BPS Pringsewu
 */

import api from "./api";
import axios from "axios";

/**
 * Fungsi untuk melakukan login user ke aplikasi SIAP.
 *
 * Parameter:
 * - credentials (Object): Berisi data login user, seperti username dan password.
 *
 * Return:
 * - Promise: Berisi response dari server yang memuat token autentikasi dan informasi user.
 */
export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

/**
 * Fungsi untuk melakukan logout user dari aplikasi SIAP.
 * Token autentikasi user akan diinvalidasi oleh server.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Berisi response dari server setelah token user diinvalidasi.
 */
export const logout = () => {
  const token = localStorage.getItem("authToken");
  // Pastikan token tersedia sebelum melakukan request logout
  return axios.post(
    "/api/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/**
 * Fungsi untuk memverifikasi apakah token autentikasi user masih valid.
 * Digunakan untuk memastikan user masih memiliki akses ke fitur aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Berisi status validitas token dari server.
 */
export const verifyToken = () => {
  return api.get("/auth/verify");
};

/**
 * Fungsi untuk mengambil data user yang sedang login di aplikasi SIAP.
 * Data user meliputi nama, peran, dan hak akses yang digunakan dalam pengelolaan barang dan permintaan.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Berisi data user yang sedang login.
 */
export const getCurrentUser = () => {
  return api.get("/auth/me");
};
