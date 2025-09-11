/**
 * EmployeeRequestHistoryTable.jsx
 *
 * Komponen tabel riwayat permintaan barang untuk aplikasi SIAP.
 * Digunakan untuk menampilkan daftar permintaan barang oleh pegawai,
 * termasuk detail, status, jumlah item, dan aksi seperti melihat detail atau mengunduh PDF.
 *
 * Parameter:
 * - permintaan (Array): Daftar objek permintaan barang.
 * - onDetail (Function): Fungsi callback ketika tombol detail diklik.
 * - onDownloadPDF (Function): Fungsi callback untuk mengunduh PDF permintaan.
 * - pdfLoading (String|Number): ID permintaan yang sedang diproses PDF-nya.
 * - getStatusColor (Function): Fungsi untuk mendapatkan kelas warna status.
 * - formatDate (Function): Fungsi untuk memformat tanggal permintaan.
 *
 * Return:
 * - JSX: Tabel riwayat permintaan barang.
 */

import React from "react";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";

/**
 * Komponen EmployeeRequestHistoryTable
 *
 * Menampilkan tabel riwayat permintaan barang pegawai,
 * termasuk aksi detail dan unduh PDF sesuai status permintaan.
 *
 * Parameter:
 * - permintaan (Array): Daftar permintaan barang.
 * - onDetail (Function): Handler untuk aksi detail permintaan.
 * - onDownloadPDF (Function): Handler untuk aksi unduh PDF permintaan.
 * - pdfLoading (String|Number): ID permintaan yang sedang loading PDF-nya.
 * - getStatusColor (Function): Fungsi untuk menentukan warna status.
 * - formatDate (Function): Fungsi untuk memformat tanggal.
 *
 * Return:
 * - JSX: Tabel riwayat permintaan barang.
 */
const EmployeeRequestHistoryTable = ({
  permintaan,
  onDetail,
  onDownloadPDF,
  pdfLoading,
  getStatusColor,
  formatDate,
}) => {
  /**
   * Fungsi renderBarisPermintaan
   *
   * Merender satu baris data permintaan barang pada tabel.
   * Menampilkan nomor permintaan, tanggal, status, total item, dan aksi.
   *
   * Parameter:
   * - item (Object): Data permintaan barang.
   * - index (Number): Index baris pada tabel.
   *
   * Return:
   * - JSX: Baris tabel permintaan barang.
   */
  const renderBarisPermintaan = (item, index) => (
    <tr
      key={item.id}
      className={`hover:bg-gray-50 transition-colors ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      <td className="px-4 py-3 whitespace-normal break-words">
        {item.nomorPermintaan || item.id}
      </td>
      <td className="px-4 py-3 text-gray-600">
        {formatDate(item.tanggalPermintaan)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-4 py-3 text-center">{(item.items || []).length}</td>
      <td className="px-4 py-3 text-center">
        <AksiPermintaan
          item={item}
          onDetail={onDetail}
          onDownloadPDF={onDownloadPDF}
          pdfLoading={pdfLoading}
        />
      </td>
    </tr>
  );

  /**
   * Fungsi renderIsiTabel
   *
   * Menentukan isi tabel berdasarkan data permintaan.
   * Jika tidak ada data, tampilkan pesan kosong.
   *
   * Return:
   * - JSX: Isi tabel permintaan barang.
   */
  const renderIsiTabel = () => {
    if (!permintaan || permintaan.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
            Tidak ada data permintaan
          </td>
        </tr>
      );
    }
    return permintaan.map(renderBarisPermintaan);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TabelHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {renderIsiTabel()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Komponen TabelHeader
 *
 * Menampilkan header kolom tabel permintaan barang.
 *
 * Return:
 * - JSX: Baris header tabel.
 */
function TabelHeader() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
          Nomor
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Tanggal
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Item
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Aksi
        </th>
      </tr>
    </thead>
  );
}

/**
 * Komponen AksiPermintaan
 *
 * Menampilkan tombol aksi untuk setiap permintaan barang:
 * - Tombol detail untuk melihat detail permintaan.
 * - Tombol unduh PDF jika status bukan 'Menunggu'.
 * - Indikator loading saat proses unduh PDF.
 *
 * Parameter:
 * - item (Object): Data permintaan barang.
 * - onDetail (Function): Handler klik tombol detail.
 * - onDownloadPDF (Function): Handler klik tombol unduh PDF.
 * - pdfLoading (String|Number): ID permintaan yang sedang loading PDF-nya.
 *
 * Return:
 * - JSX: Tombol aksi permintaan barang.
 */
function AksiPermintaan({ item, onDetail, onDownloadPDF, pdfLoading }) {
  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Tombol untuk melihat detail permintaan */}
      <button
        onClick={() => onDetail(item)}
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        title="Lihat Detail"
      >
        <EyeIcon className="h-4 w-4 text-blue-500 mr-1.5" />
        Detail
      </button>

      {/* Tombol Download PDF, hanya tampil jika status bukan 'Menunggu' */}
      {item.status !== "Menunggu" && (
        <button
          onClick={() => onDownloadPDF(item.id)}
          disabled={pdfLoading === item.id}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          title="Unduh PDF"
        >
          {pdfLoading === item.id ? (
            // Indikator loading saat proses unduh PDF
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-1.5"></div>
          ) : (
            <DocumentArrowDownIcon className="h-4 w-4 text-blue-500 mr-1.5" />
          )}
          PDF
        </button>
      )}
    </div>
  );
}

export default EmployeeRequestHistoryTable;
