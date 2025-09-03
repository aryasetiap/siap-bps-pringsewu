/**
 * ============================================
 * Komponen DashboardRecentRequests
 * --------------------------------------------
 * Komponen ini digunakan untuk menampilkan daftar permintaan barang terbaru
 * pada aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * Menampilkan informasi pemohon, tanggal permintaan, daftar barang yang diminta,
 * serta status permintaan.
 *
 * Parameter:
 * - requests (Array): Daftar objek permintaan barang yang akan ditampilkan.
 * - onDetail (Function): Fungsi callback yang dipanggil saat detail permintaan diakses.
 * - loading (Boolean): Status pemuatan data permintaan.
 *
 * Return:
 * - React Element: Komponen UI daftar permintaan terbaru.
 * ============================================
 */

import React from "react";
import { ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";

/**
 * ============================================
 * Fungsi statusColor
 * --------------------------------------------
 * Fungsi ini digunakan untuk menentukan kelas warna badge status permintaan
 * berdasarkan status permintaan barang.
 *
 * Parameter:
 * - status (String): Status permintaan barang (misal: "menunggu", "disetujui").
 *
 * Return:
 * - String: Kelas Tailwind CSS untuk warna background dan teks badge status.
 * ============================================
 */
const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "menunggu":
      return "bg-yellow-100 text-yellow-700";
    case "disetujui":
      return "bg-green-100 text-green-700";
    case "disetujui sebagian":
      return "bg-orange-100 text-orange-700";
    case "ditolak":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/**
 * ============================================
 * Fungsi getInitials
 * --------------------------------------------
 * Fungsi ini digunakan untuk mengambil inisial dari nama pemohon.
 * Inisial diambil dari huruf pertama setiap kata pada nama, maksimal 2 huruf.
 *
 * Parameter:
 * - name (String): Nama lengkap pemohon.
 *
 * Return:
 * - String: Inisial (maksimal 2 huruf) dari nama pemohon, atau "?" jika nama tidak tersedia.
 * ============================================
 */
const getInitials = (name) => {
  if (!name) return "?";
  // Ambil huruf pertama dari setiap kata, maksimal 2 huruf
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * ============================================
 * Komponen RecentRequestItem
 * --------------------------------------------
 * Komponen ini digunakan untuk menampilkan satu baris permintaan barang
 * pada daftar permintaan terbaru.
 *
 * Parameter:
 * - req (Object): Objek permintaan barang.
 * - onDetail (Function): Fungsi callback untuk detail permintaan.
 *
 * Return:
 * - React Element: Baris permintaan barang.
 * ============================================
 */
const RecentRequestItem = ({ req, onDetail }) => (
  <li
    key={req.id}
    className="relative flex items-stretch bg-white rounded-xl shadow group hover:bg-blue-50 transition cursor-pointer px-4 py-4"
    onClick={() => onDetail(req)}
  >
    {/* Avatar & Info Pemohon */}
    <div className="flex items-center space-x-4 flex-1">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
          {req.pemohon?.nama ? (
            getInitials(req.pemohon.nama)
          ) : (
            <UserCircleIcon className="w-8 h-8 text-blue-300" />
          )}
        </div>
      </div>
      <div>
        <div className="font-semibold text-gray-900">
          {req.pemohon?.nama || "-"}
          <span className="ml-2 text-xs text-gray-500">
            ({req.pemohon?.unit_kerja || "-"})
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <span>
            {req.tanggal_permintaan
              ? new Date(req.tanggal_permintaan).toLocaleDateString("id-ID")
              : ""}
          </span>
          <span className="mx-2">•</span>
          <span>
            {req.details.length} item:{" "}
            <span className="font-medium text-gray-700">
              {/* Tampilkan maksimal 2 nama barang, sisanya diganti ... */}
              {req.details
                .map((d) => d.barang?.nama_barang)
                .filter(Boolean)
                .slice(0, 2)
                .join(", ")}
              {req.details.length > 2 && " ..."}
            </span>
          </span>
        </div>
      </div>
    </div>
    {/* Badge Status Permintaan */}
    <span
      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColor(
        req.status
      )}`}
    >
      {req.status || "Menunggu"}
    </span>
    {/* Tombol Detail Permintaan */}
    <button
      className="absolute bottom-4 right-4 text-xs text-blue-600 underline opacity-0 group-hover:opacity-100 transition-opacity font-semibold"
      onClick={(e) => {
        e.stopPropagation();
        onDetail(req);
      }}
    >
      Detail
    </button>
  </li>
);

/**
 * ============================================
 * Komponen DashboardRecentRequests
 * --------------------------------------------
 * Komponen utama untuk menampilkan daftar permintaan barang terbaru,
 * loading state, dan pesan jika data kosong.
 *
 * Parameter:
 * - requests (Array): Daftar permintaan barang yang akan ditampilkan.
 * - onDetail (Function): Fungsi callback saat detail permintaan diakses.
 * - loading (Boolean): Status pemuatan data permintaan.
 *
 * Return:
 * - React Element: Komponen UI daftar permintaan terbaru.
 * ============================================
 */
const DashboardRecentRequests = ({ requests, onDetail, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-md mb-6">
    <h2 className="text-lg font-bold mb-4 flex items-center text-blue-700">
      <ClockIcon className="w-6 h-6 text-yellow-600 mr-2" />
      Permintaan Terbaru
    </h2>
    {loading ? (
      <p className="text-gray-500">Memuat data...</p>
    ) : requests.length === 0 ? (
      <p className="text-gray-500">Belum ada permintaan masuk.</p>
    ) : (
      <ul className="space-y-4">
        {requests.map((req) => (
          <RecentRequestItem key={req.id} req={req} onDetail={onDetail} />
        ))}
      </ul>
    )}
  </div>
);

export default DashboardRecentRequests;
