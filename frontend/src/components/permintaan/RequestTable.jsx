/**
 * File: RequestTable.jsx
 * Komponen utama untuk menampilkan tabel daftar permintaan barang pada aplikasi SIAP.
 * Berisi fitur detail, verifikasi, pagination, dan filter jumlah data per halaman.
 *
 * Konteks bisnis: Digunakan untuk pengelolaan permintaan barang, verifikasi status, dan monitoring proses permintaan.
 */

import React from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * Objek statusIcon
 *
 * Menyimpan ikon yang merepresentasikan status permintaan barang.
 * Digunakan untuk memperjelas status pada tampilan tabel.
 */
const statusIcon = {
  Menunggu: <ExclamationCircleIcon className="h-4 w-4 mr-1" />,
  Disetujui: <CheckIcon className="h-4 w-4 mr-1" />,
  "Disetujui Sebagian": <CheckCircleIcon className="h-4 w-4 mr-1" />,
  Ditolak: <XCircleIcon className="h-4 w-4 mr-1" />,
};

/**
 * Komponen RequestTable
 *
 * Komponen utama untuk menampilkan tabel permintaan barang beserta fitur pagination dan filter jumlah data per halaman.
 *
 * Parameter:
 * - permintaan (Array): Daftar data permintaan barang.
 * - getStatusColor (Function): Fungsi untuk mendapatkan warna status permintaan.
 * - formatDate (Function): Fungsi untuk memformat tanggal permintaan.
 * - onDetail (Function): Callback ketika tombol detail diklik.
 * - onVerifikasi (Function): Callback ketika tombol verifikasi diklik.
 * - page (Number): Nomor halaman saat ini.
 * - setPage (Function): Fungsi untuk mengubah halaman.
 * - limit (Number): Jumlah data per halaman.
 * - totalData (Number): Total jumlah data permintaan.
 * - onLimitChange (Function): Fungsi untuk mengubah jumlah data per halaman.
 *
 * Return:
 * - JSX: Komponen tabel permintaan barang beserta pagination dan filter limit.
 */
const RequestTable = ({
  permintaan,
  getStatusColor,
  formatDate,
  onDetail,
  onVerifikasi,
  page,
  setPage,
  limit,
  totalData,
  onLimitChange,
}) => {
  /**
   * Fungsi renderItemInfo
   *
   * Digunakan untuk menampilkan informasi singkat tentang item yang diminta pada setiap permintaan.
   * Menampilkan maksimal 2 item, jika lebih dari 2 akan ditampilkan "...".
   *
   * Parameter:
   * - items (Array): Daftar item pada permintaan.
   *
   * Return:
   * - String: Informasi singkat item permintaan.
   */
  const renderItemInfo = (items = []) => {
    const info = items
      .slice(0, 2)
      .map(
        (itm) =>
          `${itm.kodeBarang} - ${itm.namaBarang} (${itm.jumlahDiminta} ${itm.satuan})`
      )
      .join(", ");
    return items.length > 2 ? `${info} ...` : info;
  };

  /**
   * Fungsi renderTableRows
   *
   * Membantu merender baris-baris tabel permintaan barang.
   * Jika tidak ada data, akan menampilkan pesan kosong.
   *
   * Parameter:
   * - permintaan (Array): Daftar data permintaan barang.
   *
   * Return:
   * - JSX: Baris-baris tabel permintaan.
   */
  const renderTableRows = (permintaanList) => {
    if (permintaanList.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
            <DocumentTextIcon className="mx-auto h-14 w-14 text-gray-300 mb-4" />
            <p className="text-lg font-semibold">Tidak ada data permintaan</p>
            <p className="mt-1 text-sm">Coba ubah filter pencarian</p>
          </td>
        </tr>
      );
    }

    return permintaanList.map((permintaanItem) => (
      <tr
        key={permintaanItem.id}
        className="transition hover:bg-blue-50/60 group"
      >
        <td className="px-6 py-5 whitespace-normal break-words">
          <div className="text-base font-bold text-blue-700">
            {permintaanItem.nomorPermintaan}
          </div>
          <div className="text-xs text-gray-400">ID: {permintaanItem.id}</div>
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center">
            <img
              src={
                permintaanItem.fotoPemohon ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(permintaanItem.namaPemohon)
              }
              alt={permintaanItem.namaPemohon}
              className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm mr-3 bg-gray-100"
            />
            <div>
              <div className="text-base font-semibold text-gray-900">
                {permintaanItem.namaPemohon}
              </div>
              <div className="text-xs text-gray-500">
                {permintaanItem.unitKerja}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-5 whitespace-normal break-words">
          <div className="flex items-center text-base text-gray-900">
            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
            {formatDate(permintaanItem.tanggalPermintaan)}
          </div>
        </td>
        <td className="px-6 py-5 whitespace-normal break-words">
          <div className="text-base font-bold text-gray-900">
            {permintaanItem.totalItem} Item
          </div>
          <div className="text-xs text-gray-500">
            {renderItemInfo(permintaanItem.items)}
          </div>
        </td>
        <td className="px-6 py-5 whitespace-normal break-words">
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm align-middle ${getStatusColor(
              permintaanItem.status
            )}`}
          >
            {statusIcon[permintaanItem.status] || null}
            {permintaanItem.status}
          </span>
        </td>
        <td className="px-6 py-5 whitespace-normal break-words text-center">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => onDetail(permintaanItem)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-900 transition group-hover:scale-110"
              title="Lihat Detail"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            {permintaanItem.status === "Menunggu" && (
              <button
                onClick={() => onVerifikasi(permintaanItem)}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-900 transition group-hover:scale-110"
                title="Verifikasi"
              >
                <CheckCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  /**
   * Fungsi handleLimitChange
   *
   * Digunakan untuk mengubah jumlah data yang ditampilkan per halaman pada tabel permintaan.
   *
   * Parameter:
   * - e (Event): Event perubahan pada dropdown limit.
   *
   * Return:
   * - void
   */
  const handleLimitChange = (e) => {
    onLimitChange(Number(e.target.value));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300 whitespace-normal break-words">
                Nomor Permintaan
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
                Pemohon
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
                Tanggal
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
                Item
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
                Status
              </th>
              <th className="px-6 py-5 text-center text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {renderTableRows(permintaan)}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-4 pb-4 gap-2">
        <div className="text-sm text-gray-500">
          {/* Menampilkan range data yang sedang ditampilkan pada tabel */}
          Menampilkan {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, totalData)} dari {totalData} permintaan
        </div>
        <div className="flex items-center gap-4">
          {/* Dropdown untuk memilih jumlah data per halaman */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Tampilkan:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          {/* Tombol navigasi halaman */}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-blue-100 transition disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-blue-100 transition disabled:opacity-50"
              disabled={page * limit >= totalData}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestTable;
