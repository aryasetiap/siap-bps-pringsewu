/**
 * DashboardStats.jsx
 *
 * Komponen ini digunakan untuk menampilkan statistik utama pada dashboard aplikasi SIAP.
 * Statistik meliputi total barang, permintaan tertunda, barang kritis, dan total pengguna.
 * Komponen mendukung tampilan loading, visualisasi ikon, warna berbeda, dan penjelasan singkat tiap statistik.
 *
 * Konteks bisnis: SIAP adalah aplikasi pengelolaan barang, permintaan, dan verifikasi di lingkungan BPS Pringsewu.
 */

import React from "react";
import {
  CubeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

/**
 * Konfigurasi statistik dashboard SIAP.
 *
 * Setiap objek berisi:
 * - key: Kunci data statistik pada props stats.
 * - label: Nama statistik yang ditampilkan.
 * - color: Warna gradien background ikon.
 * - icon: Ikon visualisasi statistik.
 * - textClass: Warna teks nilai statistik.
 * - description: Penjelasan singkat statistik.
 */
const STAT_CONFIG = [
  {
    key: "totalBarang",
    label: "Total Barang",
    color: "from-blue-500 to-blue-300",
    icon: <CubeIcon className="w-9 h-9" />,
    textClass: "text-blue-700",
    description: "Total barang yang terdaftar dalam sistem SIAP.",
  },
  {
    key: "totalPermintaanTertunda",
    label: "Permintaan Tertunda",
    color: "from-yellow-400 to-yellow-200",
    icon: <ClipboardDocumentListIcon className="w-9 h-9" />,
    textClass: "text-yellow-700",
    description:
      "Jumlah permintaan barang yang belum diverifikasi atau diproses.",
  },
  {
    key: "totalBarangKritis",
    label: "Barang Kritis",
    color: "from-red-500 to-red-300",
    icon: <ExclamationTriangleIcon className="w-9 h-9" />,
    textClass: "text-red-700",
    description: "Barang yang stoknya sudah mencapai batas kritis.",
  },
  {
    key: "totalUser",
    label: "Total Pengguna",
    color: "from-green-500 to-green-300",
    icon: <UsersIcon className="w-9 h-9" />,
    textClass: "text-green-700",
    description: "Jumlah pengguna yang terdaftar di aplikasi SIAP.",
  },
];

/**
 * Komponen DashboardStats
 *
 * Fungsi ini digunakan untuk menampilkan statistik utama dashboard SIAP dalam bentuk grid card.
 *
 * Parameter:
 * - stats (Object): Data statistik dashboard, berisi total barang, permintaan tertunda, barang kritis, dan total pengguna.
 * - loading (boolean): Status loading data, jika true maka animasi loading ditampilkan.
 *
 * Return:
 * - JSX: Grid berisi card statistik dashboard SIAP.
 */
const DashboardStats = ({ stats, loading }) => {
  /**
   * Fungsi renderStatCard
   *
   * Fungsi ini digunakan untuk merender satu card statistik berdasarkan konfigurasi.
   *
   * Parameter:
   * - stat (Object): Konfigurasi statistik dari STAT_CONFIG.
   *
   * Return:
   * - JSX: Card statistik dengan ikon, label, dan nilai.
   */
  const renderStatCard = (stat) => (
    <div
      key={stat.label}
      className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center p-6 group transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {/* Ikon dengan background gradien untuk visualisasi statistik */}
      <div
        className={`mb-4 bg-gradient-to-br ${stat.color} rounded-full w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
      >
        <span className="text-white">{stat.icon}</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        {/* Label statistik */}
        <p className="text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">
          {stat.label}
        </p>
        {/* Nilai statistik, tampilkan animasi jika loading */}
        <p
          className={`text-4xl font-extrabold ${stat.textClass} tracking-tight`}
        >
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            stats[stat.key]
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {STAT_CONFIG.map(renderStatCard)}
    </div>
  );
};

export default DashboardStats;
