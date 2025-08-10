import React from "react";
import {
  DocumentIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const BuktiPermintaanPreview = ({ permintaan }) => {
  // Helper function untuk menentukan warna status
  const getStatusColor = (status) => {
    if (!status) return "bg-yellow-100 text-yellow-800";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("disetujui sebagian"))
      return "bg-blue-100 text-blue-800";
    if (statusLower.includes("disetujui")) return "bg-green-100 text-green-800";
    if (statusLower.includes("ditolak")) return "bg-red-100 text-red-800";
    if (statusLower.includes("menunggu"))
      return "bg-yellow-100 text-yellow-800";

    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      {/* Header dengan informasi umum permintaan */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center mb-3">
              <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">
                Bukti Permintaan {permintaan.nomorPermintaan}
              </h2>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              <span>
                Tanggal:{" "}
                {new Date(permintaan.tanggalPermintaan).toLocaleDateString(
                  "id-ID",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="h-4 w-4 mr-1.5" />
              <span>
                Pemohon:{" "}
                <span className="font-medium">{permintaan.pemohon?.nama}</span>{" "}
                ({permintaan.pemohon?.unitKerja})
              </span>
            </div>
          </div>
          <div className="mt-2 md:mt-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                permintaan.status
              )}`}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              {permintaan.status}
            </span>
          </div>
        </div>
        {permintaan.catatan && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-start">
              <PencilSquareIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Catatan:
                </p>
                <p className="text-sm text-gray-700">{permintaan.catatan}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabel item permintaan */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Barang
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Diminta
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Disetujui
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.namaBarang}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900 font-medium">
                    {item.jumlahDiminta}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {item.jumlahDisetujui !== null &&
                  item.jumlahDisetujui !== undefined ? (
                    <span
                      className={`text-sm font-medium ${
                        item.jumlahDisetujui === 0
                          ? "text-red-600"
                          : item.jumlahDisetujui < item.jumlahDiminta
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.jumlahDisetujui}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{item.satuan}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer informasi */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span>Total Item: {permintaan.items.length}</span>
          <span>SIAP BPS Pringsewu © {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default BuktiPermintaanPreview;
