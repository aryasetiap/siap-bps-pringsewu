/**
 * Hook useAuth untuk aplikasi SIAP.
 *
 * Fungsi ini digunakan untuk mengelola status autentikasi pengguna pada aplikasi SIAP,
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
 * useAuth
 *
 * Hook utama untuk mengelola autentikasi pengguna SIAP.
 * Mengambil data dari localStorage dan menyediakan fungsi logout serta penentuan halaman utama.
 *
 * Return:
 * - Object: { isAuthenticated, userRole, username, loading, logout, getHomePage }
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
   * useEffect
   *
   * Efek samping untuk mengambil data autentikasi dari localStorage saat komponen pertama kali dirender.
   * Data yang diambil: token autentikasi, peran pengguna, dan username.
   */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const user = localStorage.getItem("username");

    setIsAuthenticated(Boolean(token));
    setUserRole(role);
    setUsername(user);
    setLoading(false);
  }, []);

  /**
   * logout
   *
   * Fungsi ini digunakan untuk menghapus data autentikasi dari localStorage dan mengubah state menjadi logout.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - void
   */
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  /**
   * getHomePage
   *
   * Fungsi ini digunakan untuk menentukan halaman utama yang sesuai dengan peran pengguna.
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
