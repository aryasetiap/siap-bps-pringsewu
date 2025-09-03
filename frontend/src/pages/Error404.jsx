/**
 * File: Error404.jsx
 *
 * Komponen halaman error 404 untuk aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * Digunakan untuk menampilkan pesan ketika halaman yang diakses tidak ditemukan.
 *
 * Komponen ini memanfaatkan ErrorPage sebagai tampilan utama.
 */

/**
 * Import React dan komponen serta ikon yang diperlukan.
 */
import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ErrorPage from "../components/common/ErrorPage";

/**
 * Komponen Error404
 *
 * Fungsi ini digunakan untuk menampilkan halaman error 404 pada aplikasi SIAP.
 * Halaman ini muncul ketika pengguna mengakses URL yang tidak tersedia atau telah dipindahkan.
 *
 * Parameter:
 * - Tidak ada parameter yang diterima.
 *
 * Return:
 * - JSX: Komponen ErrorPage yang menampilkan pesan error 404 beserta ikon dan detailnya.
 */
const Error404 = () => {
  return (
    <ErrorPage
      code="404"
      title="Halaman Tidak Ditemukan"
      message="Halaman yang Anda cari tidak tersedia atau telah dipindahkan ke URL baru."
      icon={ExclamationTriangleIcon}
      iconColor="text-white"
      iconBgColor="bg-red-500"
    />
  );
};

export default Error404;
