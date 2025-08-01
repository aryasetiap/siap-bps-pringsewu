import React from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const statusIcon = {
  Menunggu: <ExclamationCircleIcon className="h-4 w-4 mr-1" />,
  Disetujui: <CheckIcon className="h-4 w-4 mr-1" />,
  "Disetujui Sebagian": <CheckCircleIcon className="h-4 w-4 mr-1" />,
  Ditolak: <XCircleIcon className="h-4 w-4 mr-1" />,
};

const RequestTable = ({
  permintaan,
  getStatusColor,
  formatDate,
  onDetail,
  onVerifikasi,
  page,
  setPage,
  limit,
  totalData,
}) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
              Nomor Permintaan
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
              Pemohon
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
              Tanggal
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
              Item
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
              Status
            </th>
            <th className="px-6 py-5 text-center text-sm font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-300">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {permintaan.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                <DocumentTextIcon className="mx-auto h-14 w-14 text-gray-300 mb-4" />
                <p className="text-lg font-semibold">
                  Tidak ada data permintaan
                </p>
                <p className="mt-1 text-sm">Coba ubah filter pencarian</p>
              </td>
            </tr>
          ) : (
            permintaan.map((item) => (
              <tr
                key={item.id}
                className="transition hover:bg-blue-50/60 group"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-bold text-blue-700">
                    {item.nomorPermintaan}
                  </div>
                  <div className="text-xs text-gray-400">ID: {item.id}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <img
                      src={
                        item.fotoPemohon ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(item.namaPemohon)
                      }
                      alt={item.namaPemohon}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm mr-3 bg-gray-100"
                    />
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {item.namaPemohon}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.unitKerja}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center text-base text-gray-900">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {formatDate(item.tanggalPermintaan)}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-bold text-gray-900">
                    {item.totalItem} Item
                  </div>
                  <div className="text-xs text-gray-500">
                    {(item.items || [])
                      .slice(0, 2)
                      .map(
                        (itm) =>
                          `${itm.kodeBarang} - ${itm.namaBarang} (${itm.jumlahDiminta} ${itm.satuan})`
                      )
                      .join(", ")}
                    {item.items && item.items.length > 2 && " ..."}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm align-middle ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {statusIcon[item.status] || null}
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onDetail(item)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-900 transition group-hover:scale-110"
                      title="Lihat Detail"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {item.status === "Menunggu" && (
                      <button
                        onClick={() => onVerifikasi(item)}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-900 transition group-hover:scale-110"
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
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-4 pb-4 gap-2">
      <div className="text-sm text-gray-500">
        Menampilkan {(page - 1) * limit + 1} -{" "}
        {Math.min(page * limit, totalData)} dari {totalData} permintaan
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-blue-100 transition disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-blue-100 transition disabled:opacity-50"
          disabled={page * limit >= totalData}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);

export default RequestTable;
