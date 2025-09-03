/**
 * useAuth.js
 *
 * Hook ini digunakan untuk mengelola status autentikasi pengguna pada aplikasi SIAP,
 * termasuk peran pengguna (admin/pegawai), username, dan status loading.
 * Cocok digunakan pada aplikasi pengelolaan barang, permintaan, dan verifikasi di SIAP.
 *
 * Return:
 * - Object:
 *   - isAuthenticated (boolean): Status autentikasi pengguna.
 *   - userRole (string|null): Peran pengguna ('admin' atau 'pegawai').
 *   - username (string|null): Nama pengguna yang sedang login.
 *   - loading (boolean): Status loading saat mengambil data autentikasi.
 *   - logout (function): Fungsi untuk logout dan menghapus data autentikasi.
 *   - getHomePage (function): Fungsi untuk mendapatkan halaman utama sesuai peran.
 */

import { useEffect, useState } from "react";

/**
 * Mengambil data autentikasi dari localStorage.
 *
 * Return:
 * - Object:
 *   - token (string|null): Token autentikasi pengguna.
 *   - role (string|null): Peran pengguna ('admin' atau 'pegawai').
 *   - username (string|null): Nama pengguna yang sedang login.
 */
function getAuthData() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");
  return { token, role, username };
}

/**
 * Menghapus data autentikasi dari localStorage.
 *
 * Tidak menerima parameter.
 *
 * Return:
 * - void
 */
function clearAuthData() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");
}

/**
 * Hook utama untuk mengelola autentikasi pengguna SIAP.
 *
 * Fungsi ini digunakan untuk:
 * - Mengambil status autentikasi dari localStorage.
 * - Menyediakan fungsi logout.
 * - Menentukan halaman utama sesuai peran pengguna.
 *
 * Return:
 * - Object:
 *   - isAuthenticated (boolean): Status autentikasi pengguna.
 *   - userRole (string|null): Peran pengguna ('admin' atau 'pegawai').
 *   - username (string|null): Nama pengguna yang sedang login.
 *   - loading (boolean): Status loading saat mengambil data autentikasi.
 *   - logout (function): Fungsi untuk logout dan menghapus data autentikasi.
 *   - getHomePage (function): Fungsi untuk mendapatkan halaman utama sesuai peran.
 */
export function useAuth() {
  // State untuk status autentikasi
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State untuk peran pengguna ('admin' atau 'pegawai')
  const [userRole, setUserRole] = useState(null);
  // State untuk username pengguna
  const [username, setUsername] = useState(null);
  // State untuk status loading saat proses inisialisasi
  const [loading, setLoading] = useState(true);

  /**
   * Efek samping untuk mengambil data autentikasi dari localStorage saat komponen pertama kali dirender.
   * Data yang diambil: token autentikasi, peran pengguna, dan username.
   */
  useEffect(() => {
    const { token, role, username: user } = getAuthData();
    setIsAuthenticated(Boolean(token));
    setUserRole(role);
    setUsername(user);
    setLoading(false);
  }, []);

  /**
   * Fungsi untuk logout dan menghapus data autentikasi dari localStorage.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - void
   */
  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  /**
   * Fungsi untuk menentukan halaman utama yang sesuai dengan peran pengguna.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - string: Path halaman utama ('/login', '/admin/dashboard', atau '/pegawai/permintaan')
   */
  const getHomePage = () => {
    if (!isAuthenticated) return "/login";
    // Jika admin, arahkan ke dashboard admin
    // Jika pegawai, arahkan ke halaman permintaan barang
    return userRole === "admin" ? "/admin/dashboard" : "/pegawai/permintaan";
  };

  // Return seluruh state dan fungsi yang dibutuhkan untuk autentikasi SIAP
  return {
    isAuthenticated,
    userRole,
    username,
    loading,
    logout,
    getHomePage,
  };
}
