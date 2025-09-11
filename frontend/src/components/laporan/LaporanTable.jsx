/**
 * File: LaporanTable.jsx
 * Komponen ini digunakan untuk menampilkan tabel laporan penggunaan barang pada aplikasi SIAP.
 * Cocok digunakan untuk kebutuhan pengelolaan barang, permintaan, dan verifikasi di lingkungan SIAP.
 */

import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

/**
 * Fungsi formatDate
 * Memformat string tanggal ke format Indonesia (DD/MM/YYYY).
 *
 * Parameter:
 * - dateString (string): Tanggal dalam format ISO atau string yang dapat diparse oleh Date.
 *
 * Return:
 * - (string): Tanggal yang sudah diformat sesuai lokal Indonesia.
 */
function formatDate(dateString) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

/**
 * Komponen LaporanTable
 * Menampilkan tabel berisi data penggunaan barang pada aplikasi SIAP.
 *
 * Parameter:
 * - data (Array<Object>): Array berisi objek barang yang digunakan, setiap objek memiliki properti:
 *   - nama_barang (string): Nama barang yang digunakan.
 *   - kode_barang (string): Kode barang yang digunakan.
 *   - total_digunakan (number): Jumlah barang yang digunakan.
 *   - satuan (string): Satuan barang.
 *   - tanggal_permintaan (string): Tanggal permintaan barang.
 * - loading (boolean): Status pemuatan data, jika true maka akan menampilkan indikator loading.
 *
 * Return:
 * - (JSX): Tabel laporan penggunaan barang, indikator loading, atau pesan jika data kosong.
 */
function LaporanTable({ data, loading }) {
  /**
   * Render indikator loading jika data sedang dimuat.
   */
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  /**
   * Render pesan empty state jika tidak ada data penggunaan barang.
   */
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <DocumentTextIcon className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Tidak ada data penggunaan barang
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Tidak ditemukan data penggunaan barang dalam periode yang dipilih.
          Coba ubah filter atau periode tanggal.
        </p>
      </div>
    );
  }

  /**
   * Render tabel laporan penggunaan barang.
   * Tabel ini menampilkan daftar barang beserta detail penggunaan dan tanggal permintaan.
   */
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                Nama Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Barang
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satuan
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Permintaan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((barang, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words">
                  <div className="text-sm font-medium text-gray-900">
                    {barang.nama_barang}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-mono">
                    {barang.kode_barang}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {barang.total_digunakan}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{barang.satuan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {formatDate(barang.tanggal_permintaan)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer tabel: Menampilkan total item penggunaan barang */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Menampilkan total <span className="font-medium">{data.length}</span>{" "}
          item penggunaan barang
        </div>
      </div>
    </div>
  );
}

export default LaporanTable;
