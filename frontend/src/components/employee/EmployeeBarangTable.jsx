/**
 * EmployeeBarangTable.jsx
 *
 * Komponen tabel barang untuk aplikasi SIAP (Sistem Informasi Administrasi Pegawai).
 * Digunakan untuk menampilkan daftar barang, melakukan pencarian, filter kategori,
 * dan menambah barang ke keranjang permintaan pegawai.
 *
 * Parameter:
 * - barang (Array): Daftar barang yang akan ditampilkan.
 * - searchTerm (string): Kata kunci pencarian barang.
 * - filterKategori (string): Kategori barang yang sedang difilter.
 * - kategoriOptions (Array): Pilihan kategori barang.
 * - onSearchChange (function): Handler perubahan input pencarian.
 * - onFilterKategoriChange (function): Handler perubahan filter kategori.
 * - onAddItem (function): Handler penambahan barang ke keranjang.
 * - keranjang (Array): Daftar barang yang sudah ditambahkan ke keranjang.
 * - loading (boolean): Status loading data barang.
 *
 * Return:
 * - React Element: Komponen tabel barang beserta fitur pencarian, filter, dan aksi tambah.
 */

import React from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

/**
 * Komponen EmployeeBarangTable
 * Menampilkan tabel barang beserta fitur pencarian, filter kategori, dan aksi tambah ke keranjang.
 */
const EmployeeBarangTable = ({
  barang,
  searchTerm,
  filterKategori,
  kategoriOptions,
  onSearchChange,
  onFilterKategoriChange,
  onAddItem,
  keranjang,
  loading,
}) => {
  /**
   * Fungsi untuk menentukan apakah barang sudah ada di keranjang.
   *
   * Parameter:
   * - item (Object): Data barang yang dicek.
   *
   * Return:
   * - boolean: True jika barang sudah ada di keranjang, false jika belum.
   */
  const isBarangInKeranjang = (item) =>
    keranjang?.some((cartItem) => cartItem.id === item.id);

  /**
   * Fungsi untuk menentukan apakah stok barang tersedia.
   *
   * Parameter:
   * - item (Object): Data barang yang dicek.
   *
   * Return:
   * - boolean: True jika stok > 0, false jika stok kosong.
   */
  const isStokTersedia = (item) => item.stok > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100 overflow-hidden">
      {/* Header dan Filter */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Input Pencarian Barang */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              value={searchTerm}
              onChange={onSearchChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white transition-all"
            />
          </div>
          {/* Filter Kategori Barang */}
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={filterKategori}
              onChange={onFilterKategoriChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white transition-all text-sm"
            >
              <option value="">Semua Kategori</option>
              {kategoriOptions.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Barang */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Barang
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satuan
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Loading State */}
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                  <div className="mt-2 text-gray-500">
                    Memuat data barang...
                  </div>
                </td>
              </tr>
            ) : barang.length === 0 ? (
              // Jika tidak ada barang ditemukan
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Tidak ada barang ditemukan
                </td>
              </tr>
            ) : (
              // Mapping data barang ke baris tabel
              barang.map((item) => {
                const inKeranjang = isBarangInKeranjang(item);
                const stokTersedia = isStokTersedia(item);

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      inKeranjang ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-sm">{item.kode}</td>
                    <td className="px-4 py-3 font-medium">{item.nama}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                        {item.kategori || "-"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        item.stok <= 5 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {item.stok}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {item.satuan}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {/* Tombol aksi tambah barang ke keranjang */}
                      <button
                        onClick={() => onAddItem(item)}
                        disabled={inKeranjang || !stokTersedia}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          inKeranjang
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : !stokTersedia
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                        }`}
                      >
                        {inKeranjang
                          ? "Ditambahkan"
                          : stokTersedia
                          ? "Tambah"
                          : "Stok Kosong"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeBarangTable;
