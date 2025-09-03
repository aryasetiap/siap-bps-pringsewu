/**
 * EmployeeRequestDetailModal.jsx
 *
 * Komponen modal detail permintaan barang untuk aplikasi SIAP.
 * Digunakan untuk menampilkan detail permintaan barang, status, catatan, dan daftar barang yang diminta oleh pegawai.
 * Fitur: Tutup modal, unduh PDF permintaan (jika sudah diverifikasi).
 *
 * Parameter:
 * - show (boolean): Menentukan apakah modal ditampilkan.
 * - permintaan (object): Data permintaan barang yang akan ditampilkan.
 * - onClose (function): Fungsi untuk menutup modal.
 * - onDownloadPDF (function): Fungsi untuk mengunduh PDF permintaan.
 * - pdfLoading (boolean): Status loading saat proses unduh PDF.
 * - formatDate (function): Fungsi untuk memformat tanggal.
 *
 * Return:
 * - React Element: Modal detail permintaan barang.
 */

import React from "react";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

/**
 * Fungsi getStatusColorClass
 *
 * Fungsi ini digunakan untuk menentukan kelas warna Tailwind CSS berdasarkan status permintaan barang.
 *
 * Parameter:
 * - status (string): Status permintaan barang.
 *
 * Return:
 * - string: Kelas Tailwind CSS untuk warna status.
 */
function getStatusColorClass(status) {
  const lowerStatus = status?.toLowerCase();
  if (lowerStatus === "menunggu") return "bg-yellow-100 text-yellow-800";
  if (lowerStatus === "disetujui") return "bg-green-100 text-green-800";
  if (lowerStatus === "disetujui sebagian") return "bg-blue-100 text-blue-800";
  return "bg-red-100 text-red-800";
}

/**
 * Fungsi renderItemsRows
 *
 * Fungsi ini digunakan untuk merender baris-baris tabel daftar barang yang diminta dalam permintaan.
 *
 * Parameter:
 * - items (array): Daftar item permintaan barang.
 *
 * Return:
 * - React Element: Baris-baris tabel item permintaan.
 */
function renderItemsRows(items) {
  return items.map((item, index) => (
    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-4 py-2 text-sm font-mono">{item.kodeBarang}</td>
      <td className="px-4 py-2 font-medium text-gray-900">{item.namaBarang}</td>
      <td className="px-4 py-2 text-center">{item.jumlahDiminta}</td>
      <td className="px-4 py-2 text-center">
        {item.jumlahDisetujui !== null && item.jumlahDisetujui !== undefined
          ? item.jumlahDisetujui
          : "-"}
      </td>
      <td className="px-4 py-2 text-gray-500">{item.satuan}</td>
    </tr>
  ));
}

/**
 * Komponen EmployeeRequestDetailModal
 *
 * Komponen ini digunakan untuk menampilkan detail permintaan barang oleh pegawai dalam aplikasi SIAP.
 * Menampilkan informasi permintaan, status, catatan, daftar barang, serta tombol aksi seperti tutup dan unduh PDF.
 *
 * Parameter:
 * - show (boolean): Menentukan apakah modal ditampilkan.
 * - permintaan (object): Data permintaan barang.
 * - onClose (function): Fungsi untuk menutup modal.
 * - onDownloadPDF (function): Fungsi untuk mengunduh PDF permintaan.
 * - pdfLoading (boolean): Status loading unduh PDF.
 * - formatDate (function): Fungsi untuk memformat tanggal.
 *
 * Return:
 * - React Element: Modal detail permintaan barang.
 */
const EmployeeRequestDetailModal = ({
  show,
  permintaan,
  onClose,
  onDownloadPDF,
  pdfLoading,
  formatDate,
}) => {
  // Jika modal tidak ditampilkan atau data permintaan tidak tersedia, kembalikan null
  if (!show || !permintaan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fadeIn">
      <div className="relative top-20 mx-auto p-6 border border-gray-200 w-full max-w-2xl shadow-xl rounded-xl bg-white">
        {/* Header modal: Judul dan tombol tutup */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            Detail Permintaan {permintaan.nomorPermintaan}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Informasi permintaan barang */}
        <div className="bg-gray-50 p-4 rounded-lg mb-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Tanggal Pengajuan
              </div>
              <div className="font-medium text-gray-900">
                {formatDate(permintaan.tanggalPermintaan)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                    permintaan.status
                  )}`}
                >
                  {permintaan.status}
                </span>
              </div>
            </div>
            {permintaan.tanggalVerifikasi && (
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Tanggal Verifikasi
                </div>
                <div className="font-medium text-gray-900">
                  {formatDate(permintaan.tanggalVerifikasi)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Catatan permintaan barang */}
        <div className="mb-5">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Catatan Permintaan
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 min-h-[60px]">
            {permintaan.catatan || "Tidak ada catatan"}
          </div>
        </div>

        {/* Catatan admin jika status sudah diverifikasi */}
        {permintaan.status !== "Menunggu" && (
          <div className="mb-5">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Catatan Admin
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 min-h-[60px]">
              {permintaan.catatanAdmin || "Tidak ada catatan dari admin"}
            </div>
          </div>
        )}

        {/* Tabel daftar barang yang diminta */}
        <div className="mb-5">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Daftar Barang yang Diminta
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barang
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diminta
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disetujui
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderItemsRows(permintaan.items)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer modal: Tombol aksi */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Tutup
          </button>

          {/* Tombol unduh PDF hanya muncul jika status sudah diverifikasi */}
          {permintaan.status !== "Menunggu" && (
            <button
              onClick={() => onDownloadPDF(permintaan.id)}
              disabled={pdfLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
            >
              {pdfLoading ? (
                <>
                  {/* Loader animasi saat proses unduh PDF */}
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Unduh PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeRequestDetailModal;
