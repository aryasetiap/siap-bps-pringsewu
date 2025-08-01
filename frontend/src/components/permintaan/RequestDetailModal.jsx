import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RequestDetailModal = ({
  show,
  permintaan,
  getStatusColor,
  formatDate,
  onClose,
}) => {
  if (!show || !permintaan) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4 shadow">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Detail Permintaan #{permintaan.nomorPermintaan}
          </h3>
        </div>
        <div className="mb-4 flex items-center">
          <img
            src={permintaan.fotoPemohon}
            alt={permintaan.namaPemohon}
            className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow-sm mr-3"
          />
          <div>
            <div className="font-semibold text-lg text-gray-900">
              {permintaan.namaPemohon}
            </div>
            <div className="text-sm text-gray-500">{permintaan.unitKerja}</div>
          </div>
        </div>
        <div className="mb-2 flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm align-middle ${getStatusColor(
              permintaan.status
            )}`}
          >
            {permintaan.status}
          </span>
          <span className="text-gray-500">
            {formatDate(permintaan.tanggalPermintaan)}
          </span>
        </div>
        {permintaan.catatan && (
          <div className="mb-2 text-gray-700">
            <span className="font-semibold">Catatan: </span>
            {permintaan.catatan}
          </div>
        )}
        <div className="mt-6">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left text-xs font-bold text-blue-700">
                  Kode
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-blue-700">
                  Nama Barang
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-blue-700">
                  Kategori
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                  Jumlah Diminta
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                  Jumlah Disetujui
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                  Satuan
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                  Stok Tersedia
                </th>
              </tr>
            </thead>
            <tbody>
              {(permintaan.items || []).map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2">{item.kodeBarang}</td>
                  <td className="px-3 py-2">{item.namaBarang}</td>
                  <td className="px-3 py-2">{item.kategori}</td>
                  <td className="px-3 py-2 text-right">{item.jumlahDiminta}</td>
                  <td className="px-3 py-2 text-right">
                    {item.jumlahDisetujui}
                  </td>
                  <td className="px-3 py-2 text-right">{item.satuan}</td>
                  <td className="px-3 py-2 text-right">{item.stokTersedia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
