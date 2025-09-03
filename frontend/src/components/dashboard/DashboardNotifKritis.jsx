/**
 * DashboardNotifKritis.jsx
 *
 * Komponen ini digunakan untuk menampilkan notifikasi stok kritis pada dashboard aplikasi SIAP.
 * Notifikasi ini membantu pengguna (petugas gudang/penanggung jawab) untuk mengetahui barang-barang
 * yang stoknya sudah berada di bawah ambang batas kritis, sehingga dapat segera dilakukan permintaan
 * atau verifikasi pengadaan barang.
 *
 * Parameter:
 * - items (Array<Object>): Daftar barang dengan stok kritis. Setiap objek berisi informasi barang.
 * - loading (Boolean): Status pemuatan data. Jika true, maka data sedang dimuat.
 *
 * Return:
 * - React Element: Komponen UI notifikasi stok kritis.
 */

import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/**
 * Fungsi renderListItem digunakan untuk merender satu item barang dengan stok kritis.
 *
 * Parameter:
 * - item (Object): Data barang yang stoknya kritis. Properti yang digunakan:
 *   - id (string|number): ID unik barang
 *   - nama_barang (string): Nama barang
 *   - kode_barang (string): Kode barang
 *   - satuan (string): Satuan barang
 *   - deskripsi (string): Deskripsi barang
 *   - stok (number): Jumlah stok saat ini
 *   - ambang_batas_kritis (number): Ambang batas stok kritis
 *
 * Return:
 * - React Element: Satu baris informasi barang dengan stok kritis.
 */
function renderListItem(item) {
  return (
    <li
      key={item.id}
      className="py-3 px-2 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-red-50 transition rounded-lg"
    >
      <div>
        {/* Nama barang dan kode barang */}
        <span className="font-semibold text-red-700">{item.nama_barang}</span>
        <span className="ml-2 text-xs text-gray-500">
          ({item.kode_barang}) | {item.satuan}
        </span>
        {/* Deskripsi barang */}
        <div className="text-xs text-gray-400">{item.deskripsi}</div>
      </div>
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        {/* Informasi stok saat ini */}
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold shadow">
          Stok: <span className="ml-1">{item.stok}</span>
        </span>
        {/* Ambang batas kritis */}
        <span className="text-xs text-gray-500">
          Minimum: {item.ambang_batas_kritis}
        </span>
      </div>
    </li>
  );
}

/**
 * Komponen utama notifikasi stok kritis.
 * Menampilkan daftar barang yang stoknya di bawah ambang batas kritis.
 *
 * Parameter:
 * - items (Array<Object>): Daftar barang dengan stok kritis.
 * - loading (Boolean): Status pemuatan data.
 *
 * Return:
 * - React Element: UI notifikasi stok kritis.
 */
function DashboardNotifKritis({ items, loading }) {
  /**
   * Bagian ini menangani kondisi tampilan:
   * - Jika loading, tampilkan pesan pemuatan.
   * - Jika tidak ada barang kritis, tampilkan pesan kosong.
   * - Jika ada barang kritis, tampilkan daftar barang.
   */
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-red-100">
      {/* Header notifikasi stok kritis */}
      <h2 className="text-lg font-bold mb-4 flex items-center text-red-700">
        <span className="bg-red-100 rounded-full p-2 mr-3 shadow">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </span>
        Notifikasi Stok Kritis
      </h2>
      {/* Kondisi loading, kosong, atau tampilkan daftar barang */}
      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">Tidak ada barang dengan stok kritis.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map(renderListItem)}
        </ul>
      )}
    </div>
  );
}

export default DashboardNotifKritis;
