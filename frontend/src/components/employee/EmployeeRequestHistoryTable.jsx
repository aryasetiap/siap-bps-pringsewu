import React from "react";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline"; // Updated from DocumentDownloadIcon

const EmployeeRequestHistoryTable = ({
  permintaan,
  onDetail,
  onDownloadPDF,
  pdfLoading,
  getStatusColor,
  formatDate,
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
        <tbody className="bg-white divide-y divide-gray-200">
          {permintaan.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                Tidak ada data permintaan
              </td>
            </tr>
          ) : (
            permintaan.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">
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
                <td className="px-4 py-3 text-center">
                  {(item.items || []).length}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => onDetail(item)}
                      className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Lihat Detail"
                    >
                      <EyeIcon className="h-4 w-4 text-blue-500 mr-1" />
                      Detail
                    </button>

                    {/* Tombol Download PDF, hanya tampil jika status bukan 'Menunggu' */}
                    {item.status !== "Menunggu" && (
                      <button
                        onClick={() => onDownloadPDF(item.id)}
                        disabled={pdfLoading === item.id}
                        className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        title="Unduh PDF"
                      >
                        {pdfLoading === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-1"></div>
                        ) : (
                          <DocumentArrowDownIcon className="h-4 w-4 text-blue-500 mr-1" />
                        )}
                        PDF
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeRequestHistoryTable;
