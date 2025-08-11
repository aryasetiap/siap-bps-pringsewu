/**
 * File: LaporanFilterForm.jsx
 * Komponen ini digunakan untuk menampilkan form filter laporan pada aplikasi SIAP.
 * Form ini memungkinkan pengguna untuk memfilter data laporan berdasarkan tanggal mulai, tanggal akhir, dan unit kerja.
 * Komponen ini juga menyediakan tombol untuk melakukan filter data dan ekspor laporan ke PDF.
 *
 * Konteks bisnis: Digunakan dalam proses pengelolaan barang, permintaan, dan verifikasi di lingkungan SIAP BPS Pringsewu.
 */

import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/userService";

/**
 * Komponen LaporanFilterForm
 *
 * Parameter:
 * - startDate (string): Tanggal mulai filter laporan.
 * - endDate (string): Tanggal akhir filter laporan.
 * - unitKerja (string): Unit kerja yang dipilih untuk filter.
 * - setStartDate (function): Fungsi untuk mengubah nilai tanggal mulai.
 * - setEndDate (function): Fungsi untuk mengubah nilai tanggal akhir.
 * - setUnitKerja (function): Fungsi untuk mengubah unit kerja yang dipilih.
 * - onFilter (function): Fungsi yang dipanggil saat tombol filter ditekan.
 * - onExportPDF (function): Fungsi yang dipanggil saat tombol ekspor PDF ditekan.
 * - loading (boolean): Status loading untuk tombol aksi.
 *
 * Return:
 * - React Element: Form filter laporan.
 */
const LaporanFilterForm = ({
  startDate,
  endDate,
  unitKerja,
  setStartDate,
  setEndDate,
  setUnitKerja,
  onFilter,
  onExportPDF,
  loading,
}) => {
  // State untuk menyimpan daftar unit kerja unik
  const [unitKerjaList, setUnitKerjaList] = useState([]);

  /**
   * Efek untuk mengambil daftar unit kerja dari API user.
   * Data unit kerja diambil dari seluruh user, kemudian diambil nilai uniknya.
   * Digunakan untuk filter laporan berdasarkan unit kerja.
   */
  useEffect(() => {
    /**
     * Fungsi fetchUnitKerja
     *
     * Tujuan: Mengambil data user dari API dan mengekstrak daftar unit kerja unik.
     *
     * Parameter: Tidak ada.
     * Return: void
     */
    const fetchUnitKerja = async () => {
      try {
        // Ambil data user dari API
        const response = await getAllUsers();
        // Ekstrak unit kerja unik dari data user
        const uniqueUnitKerja = [
          ...new Set(response.data.map((user) => user.unit_kerja)),
        ];
        setUnitKerjaList(uniqueUnitKerja);
      } catch (error) {
        // Jika terjadi error saat pengambilan data, tampilkan di konsol
        console.error("Error fetching unit kerja list:", error);
      }
    };

    fetchUnitKerja();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input tanggal mulai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Input tanggal akhir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Dropdown unit kerja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Kerja
          </label>
          <select
            value={unitKerja || ""}
            onChange={(e) => setUnitKerja(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Semua Unit Kerja</option>
            {unitKerjaList.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Tombol aksi filter dan ekspor PDF */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
        <button
          onClick={onFilter}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Filter Data"}
        </button>
        <button
          onClick={onExportPDF}
          disabled={loading || !startDate || !endDate}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Ekspor PDF
        </button>
      </div>
    </div>
  );
};

export default LaporanFilterForm;
