/**
 * File: ErrorPage.jsx
 * Komponen halaman error untuk aplikasi SIAP BPS Pringsewu.
 * Menampilkan pesan error, kode error, dan navigasi ke halaman sebelumnya atau beranda.
 * Digunakan untuk menangani error pada pengelolaan barang, permintaan, dan verifikasi aset/persediaan.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

/**
 * Fungsi getHomePage
 * ----------------------------------------
 * Fungsi ini digunakan untuk menentukan path halaman beranda yang sesuai
 * berdasarkan role pengguna dan status autentikasi pada aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada
 *
 * Return:
 * - string: Path halaman beranda sesuai role ('/admin/dashboard' atau '/pegawai/permintaan').
 *           Jika belum login, akan diarahkan ke '/login'.
 */
function getHomePage() {
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) return "/login";
  return userRole === "admin" ? "/admin/dashboard" : "/pegawai/permintaan";
}

/**
 * Fungsi handleGoBack
 * ----------------------------------------
 * Fungsi ini digunakan untuk mengembalikan pengguna ke halaman sebelumnya.
 * Cocok digunakan saat pengguna ingin membatalkan aksi atau kembali dari halaman error.
 *
 * Parameter:
 * - navigate (function): Fungsi navigasi dari react-router-dom.
 *
 * Return:
 * - void: Tidak mengembalikan nilai.
 */
function handleGoBack(navigate) {
  navigate(-1);
}

/**
 * Komponen ErrorPage
 * ----------------------------------------
 * Komponen ini digunakan untuk menampilkan halaman error pada aplikasi SIAP,
 * seperti gagal verifikasi, permintaan tidak ditemukan, atau akses tidak diizinkan.
 * Menampilkan kode error, judul, pesan, ikon, dan navigasi ke halaman sebelumnya atau beranda.
 *
 * Parameter:
 * - code (string): Kode error yang ditampilkan (misal: 404, 403).
 * - title (string): Judul error yang menjelaskan jenis error.
 * - message (string): Pesan detail error untuk pengguna.
 * - icon (React.Component): Komponen ikon yang ditampilkan.
 * - iconColor (string): Kelas warna ikon.
 * - iconBgColor (string): Kelas warna latar belakang ikon.
 * - children (React.Node): Komponen tambahan yang ingin ditampilkan (opsional).
 *
 * Return:
 * - React.Element: Tampilan halaman error.
 */
function ErrorPage({
  code,
  title,
  message,
  icon: Icon,
  iconColor,
  iconBgColor,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
        {/* Header gradien dengan logo dan kode error */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
          <div
            className={`${iconBgColor} rounded-full p-5 w-24 h-24 mx-auto mb-4 shadow-lg flex items-center justify-center`}
          >
            {/* Ikon error sesuai jenis error */}
            <Icon className={`h-14 w-14 ${iconColor}`} />
          </div>
          <h1 className="text-5xl font-extrabold mb-2">{code}</h1>
        </div>

        {/* Konten utama error */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {title}
          </h2>
          <p className="text-gray-600 text-center mb-8">{message}</p>

          {/* Navigasi aksi: kembali atau ke beranda */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleGoBack(navigate)}
              className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Kembali
            </button>

            <Link
              to={getHomePage()}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-colors"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Ke Beranda
            </Link>

            {/* Komponen tambahan jika diperlukan */}
            {children}
          </div>

          {/* Footer aplikasi SIAP */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>BPS Kabupaten Pringsewu</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Sistem Aplikasi Pengelolaan Aset &
              Persediaan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
