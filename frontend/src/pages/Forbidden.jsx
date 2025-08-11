/**
 * File Forbidden.jsx
 *
 * Halaman ini digunakan untuk menampilkan pesan akses ditolak (403 Forbidden) pada aplikasi SIAP.
 * SIAP adalah aplikasi pengelolaan barang, permintaan, dan verifikasi di lingkungan BPS Pringsewu.
 * Jika user tidak memiliki izin, halaman ini akan muncul dan menawarkan opsi logout jika user sedang login.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldExclamationIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ErrorPage from "../components/common/ErrorPage";

/**
 * Komponen Forbidden
 *
 * Komponen ini menampilkan halaman error 403 Forbidden.
 * Jika user terautentikasi, tombol logout akan muncul untuk menghapus data autentikasi dan mengarahkan ke halaman login.
 *
 * Return:
 * - JSX: Tampilan halaman error 403 dengan opsi logout jika user terautentikasi.
 */
const Forbidden = () => {
  const navigate = useNavigate();

  // Mendapatkan status autentikasi user dari localStorage
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  /**
   * Fungsi handleLogout
   *
   * Fungsi ini digunakan untuk menghapus data autentikasi user dari localStorage dan mengarahkan ke halaman login.
   *
   * Parameter: Tidak ada
   *
   * Return: Tidak ada
   */
  const handleLogout = () => {
    // Hapus semua data autentikasi terkait user SIAP
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    // Redirect ke halaman login aplikasi SIAP
    navigate("/login");
  };

  return (
    <ErrorPage
      code="403"
      title="Akses Ditolak"
      message="Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali atau masuk dengan akun yang memiliki akses."
      icon={ShieldExclamationIcon}
      iconColor="text-white"
      iconBgColor="bg-yellow-500"
    >
      {/* Tampilkan tombol logout hanya jika user terautentikasi */}
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      )}
    </ErrorPage>
  );
};

export default Forbidden;
