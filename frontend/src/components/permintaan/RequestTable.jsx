import React from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const RequestTable = ({
  permintaan,
  getStatusColor,
  formatDate,
  onDetail,
  onVerifikasi,
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nomor Permintaan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Pemohon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permintaan.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">Tidak ada data permintaan</p>
                <p className="mt-1">Coba ubah filter pencarian</p>
              </td>
            </tr>
          ) : (
            permintaan.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">
                    {item.nomorPermintaan}
                  </div>
                  <div className="text-sm text-gray-500">ID: {item.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {item.pemohon.nama}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.pemohon.unitKerja}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {formatDate(item.tanggalPermintaan)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.totalItem} Item
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.items
                      .slice(0, 2)
                      .map((itm) => itm.namaBarang)
                      .join(", ")}
                    {item.items.length > 2 && "..."}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onDetail(item)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Lihat Detail"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {item.status === "Menunggu" && (
                      <button
                        onClick={() => onVerifikasi(item)}
                        className="text-green-600 hover:text-green-800"
                        title="Verifikasi"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
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

export default RequestTable;
