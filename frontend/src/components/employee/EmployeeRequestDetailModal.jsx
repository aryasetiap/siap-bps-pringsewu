import React from "react";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const EmployeeRequestDetailModal = ({
  show,
  permintaan,
  onClose,
  onDownloadPDF,
  pdfLoading,
  formatDate,
}) => {
  if (!show || !permintaan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fadeIn">
      <div className="relative top-20 mx-auto p-6 border border-gray-200 w-full max-w-2xl shadow-xl rounded-xl bg-white">
        {/* Header dengan judul dan tombol close */}
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

        {/* Informasi permintaan */}
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
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    permintaan.status?.toLowerCase() === "menunggu"
                      ? "bg-yellow-100 text-yellow-800"
                      : permintaan.status?.toLowerCase() === "disetujui"
                      ? "bg-green-100 text-green-800"
                      : permintaan.status?.toLowerCase() ===
                        "disetujui sebagian"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
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

        {/* Catatan */}
        <div className="mb-5">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Catatan Permintaan
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 min-h-[60px]">
            {permintaan.catatan || "Tidak ada catatan"}
          </div>
        </div>

        {/* Catatan Admin jika ada */}
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

        {/* Tabel item permintaan */}
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
                {permintaan.items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 text-sm font-mono">
                      {item.kodeBarang}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {item.namaBarang}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.jumlahDiminta}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.jumlahDisetujui !== null &&
                      item.jumlahDisetujui !== undefined
                        ? item.jumlahDisetujui
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-500">{item.satuan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer dengan tombol-tombol aksi */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Tutup
          </button>

          {/* Tombol cetak PDF jika status bukan Menunggu */}
          {permintaan.status !== "Menunggu" && (
            <button
              onClick={() => onDownloadPDF(permintaan.id)}
              disabled={pdfLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
            >
              {pdfLoading ? (
                <>
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
