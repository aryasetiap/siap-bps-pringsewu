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
import { FunnelIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

/**
 * Komponen LaporanFilterForm
 *
 * Komponen ini digunakan untuk menampilkan form filter laporan pada aplikasi SIAP.
 * Pengguna dapat memfilter data laporan berdasarkan tanggal mulai, tanggal akhir, dan unit kerja.
 * Terdapat juga tombol untuk melakukan filter data dan ekspor laporan ke PDF.
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
  const [loadingUnitKerja, setLoadingUnitKerja] = useState(false);

  /**
   * Efek untuk mengambil daftar unit kerja dari API user.
   * Data unit kerja diambil dari seluruh user, kemudian diambil nilai uniknya.
   * Digunakan untuk filter laporan berdasarkan unit kerja.
   */
  useEffect(() => {
    fetchUnitKerja();
  }, []);

  /**
   * Fungsi fetchUnitKerja
   *
   * Fungsi ini digunakan untuk mengambil data user dari API dan mengekstrak daftar unit kerja unik.
   * Unit kerja digunakan sebagai filter laporan pada aplikasi SIAP.
   *
   * Parameter: Tidak ada.
   * Return: void
   */
  const fetchUnitKerja = async () => {
    setLoadingUnitKerja(true);
    try {
      const response = await getAllUsers();
      // Ekstrak unit kerja unik dari data user
      const uniqueUnitKerja = [
        ...new Set(
          response.data.map((user) => user.unit_kerja).filter(Boolean)
        ),
      ].sort();
      setUnitKerjaList(uniqueUnitKerja);
    } catch (error) {
      // Jika terjadi error saat pengambilan data, tampilkan di konsol
      console.error("Error fetching unit kerja list:", error);
    } finally {
      setLoadingUnitKerja(false);
    }
  };

  /**
   * Fungsi getToday
   *
   * Fungsi ini digunakan untuk mendapatkan tanggal hari ini dalam format ISO (YYYY-MM-DD).
   *
   * Parameter: Tidak ada.
   * Return:
   * - string: Tanggal hari ini dalam format ISO.
   */
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  /**
   * Fungsi getOneMonthAgo
   *
   * Fungsi ini digunakan untuk mendapatkan tanggal 30 hari yang lalu dari hari ini dalam format ISO (YYYY-MM-DD).
   *
   * Parameter: Tidak ada.
   * Return:
   * - string: Tanggal 30 hari yang lalu dalam format ISO.
   */
  const getOneMonthAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  };

  /**
   * Fungsi handleLast30Days
   *
   * Fungsi ini digunakan untuk mengatur rentang tanggal filter ke 30 hari terakhir.
   * Cocok digunakan untuk laporan pengelolaan barang, permintaan, dan verifikasi dalam periode 1 bulan terakhir.
   *
   * Parameter: Tidak ada.
   * Return: void
   */
  const handleLast30Days = () => {
    setStartDate(getOneMonthAgo());
    setEndDate(getToday());
  };

  /**
   * Fungsi handleThisMonth
   *
   * Fungsi ini digunakan untuk mengatur rentang tanggal filter ke bulan ini.
   * Cocok digunakan untuk laporan bulanan pengelolaan barang, permintaan, dan verifikasi.
   *
   * Parameter: Tidak ada.
   * Return: void
   */
  const handleThisMonth = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(getToday());
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center mb-4">
        <FunnelIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Filter Laporan</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Input tanggal mulai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            max={endDate || getToday()}
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            min={startDate}
            max={getToday()}
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loadingUnitKerja}
          >
            <option value="">Semua Unit Kerja</option>
            {unitKerjaList.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Preset tanggal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preset Tanggal
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleLast30Days}
              className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              30 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={handleThisMonth}
              className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Bulan Ini
            </button>
          </div>
        </div>
      </div>

      {/* Tombol aksi filter dan ekspor PDF */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end border-t pt-4 mt-2">
        <button
          onClick={onFilter}
          disabled={loading || !startDate || !endDate}
          className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Memproses...
            </>
          ) : (
            <>
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter Data
            </>
          )}
        </button>
        <button
          onClick={onExportPDF}
          disabled={loading || !startDate || !endDate}
          className="flex items-center justify-center py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          Ekspor PDF
        </button>
      </div>
    </div>
  );
};

export default LaporanFilterForm;
