/**
 * authService.js
 *
 * Modul ini menyediakan service untuk autentikasi dan manajemen user pada aplikasi SIAP.
 * Digunakan untuk login, logout, verifikasi token, dan mengambil data user yang sedang login.
 *
 * Konteks bisnis: Digunakan dalam pengelolaan barang, permintaan, dan verifikasi user pada aplikasi SIAP BPS Pringsewu.
 */

import api from "./api";
import axios from "axios";

/**
 * Melakukan login user ke aplikasi SIAP.
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
 * Melakukan logout user dari aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Berisi response dari server setelah token user diinvalidasi.
 */
export const logout = () => {
  const token = localStorage.getItem("authToken");
  return axios.post(
    "/api/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/**
 * Memverifikasi apakah token autentikasi user masih valid.
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
 * Mengambil data user yang sedang login di aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada.
 *
 * Return:
 * - Promise: Berisi data user yang sedang login, seperti nama, peran, dan hak akses.
 */
export const getCurrentUser = () => {
  return api.get("/auth/me");
};
