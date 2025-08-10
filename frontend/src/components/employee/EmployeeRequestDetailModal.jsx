import React from "react";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline"; // Updated from XIcon, DocumentDownloadIcon

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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header dengan judul dan tombol close */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Detail Permintaan
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Informasi permintaan */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Nomor Permintaan</div>
              <div className="font-medium">{permintaan.nomorPermintaan}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tanggal Pengajuan</div>
              <div className="font-medium">
                {formatDate(permintaan.tanggalPermintaan)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium">{permintaan.status}</div>
            </div>
            {permintaan.tanggalVerifikasi && (
              <div>
                <div className="text-sm text-gray-500">Tanggal Verifikasi</div>
                <div className="font-medium">
                  {formatDate(permintaan.tanggalVerifikasi)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Catatan */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Catatan Permintaan</div>
          <div className="p-3 bg-gray-50 rounded border text-sm">
            {permintaan.catatan || "-"}
          </div>
        </div>

        {/* Catatan Admin jika ada */}
        {permintaan.status !== "Menunggu" && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Catatan Admin</div>
            <div className="p-3 bg-gray-50 rounded border text-sm">
              {permintaan.catatanAdmin || "-"}
            </div>
          </div>
        )}

        {/* Tabel item permintaan */}
        <div className="overflow-x-auto mb-4 border rounded">
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
              {permintaan.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm font-mono">
                    {item.kodeBarang}
                  </td>
                  <td className="px-4 py-2 font-medium">{item.namaBarang}</td>
                  <td className="px-4 py-2 text-center">
                    {item.jumlahDiminta}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {item.jumlahDisetujui !== null &&
                    item.jumlahDisetujui !== undefined
                      ? item.jumlahDisetujui
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{item.satuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer dengan tombol-tombol aksi */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Tutup
          </button>

          {/* Tombol cetak PDF jika status bukan Menunggu */}
          {permintaan.status !== "Menunggu" && (
            <button
              onClick={() => onDownloadPDF(permintaan.id)}
              disabled={pdfLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
