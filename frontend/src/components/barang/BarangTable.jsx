/**
 * BarangTable.jsx
 * 
 * Komponen tabel untuk menampilkan daftar barang pada aplikasi SIAP.
 * Digunakan untuk pengelolaan barang, termasuk aksi edit, tambah stok, hapus, dan aktivasi barang.
 * 
 * Parameter:
 * - data (Array<Object>): Data array barang yang akan ditampilkan.
 * - onEdit (Function): Fungsi callback ketika tombol edit barang diklik.
 * - onDelete (Function): Fungsi callback ketika tombol hapus barang diklik.
 * - onTambahStok (Function): Fungsi callback ketika tombol tambah stok diklik.
 * - onAktifkan (Function): Fungsi callback ketika tombol aktifkan barang diklik.
 * - getStatusColor (Function): Fungsi untuk mendapatkan warna status barang (tidak digunakan di sini, bisa dioptimalkan).
 * - getStatusText (Function): Fungsi untuk mendapatkan teks status barang (tidak digunakan di sini, bisa dioptimalkan).
 * 
 * Return:
 * - React.Element: Komponen tabel barang yang interaktif.
 */

import React from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * Komponen BarangTable
 * Menampilkan data barang dalam bentuk tabel beserta aksi pengelolaan barang.
 * 
 * Parameter:
 * - data (Array<Object>): Data barang yang akan ditampilkan.
 * - onEdit (Function): Callback untuk aksi edit barang.
 * - onDelete (Function): Callback untuk aksi hapus barang.
 * - onTambahStok (Function): Callback untuk aksi tambah stok barang.
 * - onAktifkan (Function): Callback untuk aksi aktivasi barang.
 * - getStatusColor (Function): Fungsi untuk mendapatkan warna status barang (opsional, tidak digunakan).
 * - getStatusText (Function): Fungsi untuk mendapatkan teks status barang (opsional, tidak digunakan).
 * 
 * Return:
 * - React.Element: Tabel barang dengan fitur aksi.
 */
const BarangTable = ({
  data,
  onEdit,
  onDelete,
  onTambahStok,
  onAktifkan,
  getStatusColor, // Belum digunakan, bisa dioptimalkan jika diperlukan
  getStatusText,  // Belum digunakan, bisa dioptimalkan jika diperlukan
}) => {
  /**
   * Fungsi renderBarisBarang
   * Membantu merender setiap baris data barang agar kode lebih modular dan mudah dibaca.
   * 
   * Parameter:
   * - item (Object): Data barang per baris.
   * - idx (number): Index baris barang.
   * 
   * Return:
   * - React.Element: Baris tabel barang.
   */
  const renderBarisBarang = (item, idx) => (
    <tr
      key={item.id}
      className={`transition hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {item.kode}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {item.foto && (
            <img
              src={item.foto}
              alt={item.nama}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
            />
          )}
          <div>
            <div className="text-sm font-bold text-gray-900">
              {item.nama}
            </div>
            <div className="text-xs text-gray-500">{item.satuan}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold text-xs">
          {item.kategori}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-semibold">
          {item.stok}{" "}
          <span className="text-xs text-gray-500">{item.satuan}</span>
        </div>
        <div className="text-xs text-gray-400">
          Min: {item.stokMinimum} {item.satuan}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.statusAktif
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {item.statusAktif ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.stok <= item.stokMinimum
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.stok <= item.stokMinimum ? "Kritis" : "Normal"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {item.statusAktif ? (
            <>
              {/* Tombol Edit Barang */}
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900 transition"
                title="Edit Barang"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              {/* Tombol Tambah Stok Barang */}
              <button
                onClick={() => onTambahStok(item)}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-900 transition"
                title="Tambah Stok"
              >
                <PlusCircleIcon className="h-5 w-5" />
              </button>
              {/* Tombol Hapus Barang */}
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-900 transition"
                title="Hapus Barang"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            /* Tombol Aktifkan Barang */
            <button
              onClick={() => onAktifkan(item.id)}
              className="p-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-900 transition"
              title="Aktifkan Barang"
            >
              Aktifkan
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Kode
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Nama Barang
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Status Barang
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Status Kritis
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  {/* Pesan jika tidak ada data barang */}
                  Tidak ada data barang.
                </td>
              </tr>
            ) : (
              data.map(renderBarisBarang)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarangTable;
