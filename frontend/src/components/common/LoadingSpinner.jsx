/**
 * File: LoadingSpinner.jsx
 * Komponen ini digunakan untuk menampilkan indikator loading (spinner) pada aplikasi SIAP.
 * Biasanya digunakan saat proses pengelolaan barang, permintaan, atau verifikasi data sedang berlangsung.
 * Komponen ini mendukung berbagai ukuran dan varian warna sesuai kebutuhan tampilan.
 */

import React from "react";

/**
 * Konfigurasi ukuran spinner.
 * Key: ukuran (sm, md, lg, xl)
 * Value: kelas Tailwind CSS untuk tinggi dan lebar spinner.
 */
const SPINNER_SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/**
 * Konfigurasi varian warna spinner.
 * Key: varian (primary, white, gray)
 * Value: kelas Tailwind CSS untuk warna border spinner.
 */
const SPINNER_VARIANTS = {
  primary: "border-blue-600",
  white: "border-white",
  gray: "border-gray-600",
};

/**
 * Komponen LoadingSpinner
 * Menampilkan animasi spinner sebagai indikator loading pada aplikasi SIAP.
 *
 * Parameter:
 * - size (string): Ukuran spinner, dapat berupa 'sm', 'md', 'lg', atau 'xl'. Default: 'md'.
 * - variant (string): Warna spinner, dapat berupa 'primary', 'white', atau 'gray'. Default: 'primary'.
 * - className (string): Kelas tambahan untuk styling custom. Default: ''.
 * - text (string): Teks yang ditampilkan di bawah spinner (opsional).
 *
 * Return:
 * - React.Element: Komponen spinner beserta teks (jika ada).
 */
const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  className = "",
  text,
}) => {
  // Validasi agar size dan variant selalu menggunakan value yang tersedia
  const spinnerSize = SPINNER_SIZES[size] || SPINNER_SIZES.md;
  const spinnerVariant = SPINNER_VARIANTS[variant] || SPINNER_VARIANTS.primary;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner animasi untuk menandakan proses loading */}
      <div
        className={`animate-spin rounded-full border-b-2 ${spinnerSize} ${spinnerVariant}`}
      ></div>
      {/* Teks opsional di bawah spinner, misal "Memuat data barang..." */}
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
