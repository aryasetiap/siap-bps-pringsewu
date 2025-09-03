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
 * Fungsi: getSpinnerSize
 * Fungsi ini digunakan untuk mengambil kelas Tailwind CSS sesuai ukuran spinner yang dipilih.
 *
 * Parameter:
 * - size (string): Ukuran spinner ('sm', 'md', 'lg', 'xl')
 *
 * Return:
 * - string: Kelas Tailwind CSS untuk ukuran spinner
 */
function getSpinnerSize(size) {
  return SPINNER_SIZES[size] || SPINNER_SIZES.md;
}

/**
 * Fungsi: getSpinnerVariant
 * Fungsi ini digunakan untuk mengambil kelas Tailwind CSS sesuai varian warna spinner yang dipilih.
 *
 * Parameter:
 * - variant (string): Varian warna spinner ('primary', 'white', 'gray')
 *
 * Return:
 * - string: Kelas Tailwind CSS untuk warna spinner
 */
function getSpinnerVariant(variant) {
  return SPINNER_VARIANTS[variant] || SPINNER_VARIANTS.primary;
}

/**
 * Komponen: LoadingSpinner
 * Komponen ini digunakan untuk menampilkan animasi spinner sebagai indikator loading pada aplikasi SIAP.
 * Sering digunakan pada proses pengelolaan barang, permintaan, atau verifikasi data.
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
  // Ambil kelas Tailwind CSS sesuai ukuran dan varian spinner
  const spinnerSizeClass = getSpinnerSize(size);
  const spinnerVariantClass = getSpinnerVariant(variant);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner animasi untuk menandakan proses loading pada aplikasi SIAP */}
      <div
        className={`animate-spin rounded-full border-b-2 ${spinnerSizeClass} ${spinnerVariantClass}`}
      ></div>
      {/* Teks opsional di bawah spinner, misal "Memuat data barang..." */}
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
