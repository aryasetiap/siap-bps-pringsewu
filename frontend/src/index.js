/**
 * File utama aplikasi SIAP BPS Pringsewu.
 *
 * Fungsi:
 * - Melakukan inisialisasi dan rendering aplikasi utama ke dalam elemen root pada DOM.
 * - Mengaktifkan mode Strict React untuk membantu mendeteksi potensi masalah pada aplikasi.
 * - Menyediakan integrasi untuk pengukuran performa aplikasi.
 *
 * Konteks bisnis:
 * Aplikasi SIAP digunakan untuk pengelolaan barang, permintaan, dan verifikasi di lingkungan BPS Pringsewu.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/**
 * Inisialisasi root aplikasi.
 *
 * Parameter:
 * - Tidak ada parameter.
 *
 * Return:
 * - Tidak ada return value.
 *
 * Proses:
 * - Mengambil elemen dengan id 'root' dari DOM.
 * - Membuat root React untuk rendering aplikasi.
 */
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

/**
 * Melakukan rendering komponen utama aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada parameter.
 *
 * Return:
 * - Tidak ada return value.
 *
 * Proses:
 * - Merender komponen <App /> di dalam <React.StrictMode> untuk memastikan aplikasi berjalan sesuai best practice React.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Mengaktifkan pengukuran performa aplikasi SIAP.
 *
 * Fungsi ini dapat digunakan untuk mencatat performa aplikasi, misalnya waktu rendering,
 * yang berguna untuk analisis dan optimasi aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada parameter secara default, namun dapat menerima fungsi logging.
 *
 * Return:
 * - Tidak ada return value.
 */
reportWebVitals();

// Untuk mengukur performa aplikasi SIAP, Anda dapat mengaktifkan logging dengan cara:
// reportWebVitals(console.log);
// atau mengirim data ke endpoint analytics sesuai kebutuhan bisnis.
