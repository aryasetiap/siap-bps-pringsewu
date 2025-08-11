/**
 * File: LaporanTable.jsx
 * Komponen ini digunakan untuk menampilkan tabel laporan penggunaan barang pada aplikasi SIAP.
 * Cocok digunakan untuk kebutuhan pengelolaan barang, permintaan, dan verifikasi di lingkungan SIAP.
 */

import React from "react";

/**
 * Komponen LaporanTable
 * Menampilkan tabel berisi data penggunaan barang.
 *
 * Parameter:
 * - data (Array<Object>): Data array berisi objek barang yang digunakan, setiap objek memiliki properti:
 *   - nama_barang (string): Nama barang yang digunakan.
 *   - total_digunakan (number): Jumlah barang yang digunakan.
 *   - satuan (string): Satuan barang.
 * - loading (boolean): Status pemuatan data, jika true maka akan menampilkan indikator loading.
 *
 * Return:
 * - JSX: Tabel laporan penggunaan barang atau pesan jika data kosong/loading.
 */
const LaporanTable = ({ data, loading }) => {
  // Render loading jika data sedang dimuat
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center text-blue-600">Memuat data...</div>
      </div>
    );
  }

  // Render tabel laporan penggunaan barang
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nama Barang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Total Digunakan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Satuan
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Jika data kosong, tampilkan pesan tidak ada data */}
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                Tidak ada data penggunaan barang
              </td>
            </tr>
          ) : (
            // Mapping data barang ke baris tabel
            data.map((barang, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{barang.nama_barang}</td>
                <td className="px-6 py-4">{barang.total_digunakan}</td>
                <td className="px-6 py-4">{barang.satuan}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanTable;
