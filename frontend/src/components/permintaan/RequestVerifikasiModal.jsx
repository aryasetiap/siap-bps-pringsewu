import React from "react";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const RequestVerifikasiModal = ({
  show,
  permintaan,
  verifikasiData,
  loading,
  onChange,
  onItemChange,
  onKeputusanChange,
  onClose,
  onSubmit,
  getRowBackgroundColor,
}) => {
  if (!show || !permintaan) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center mb-6">
          <div className="bg-green-100 text-green-600 rounded-full p-3 mr-4 shadow">
            <CheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Verifikasi Permintaan #{permintaan.nomorPermintaan}
          </h3>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Keputusan Verifikasi
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
                  verifikasiData.keputusan === "setuju"
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => onKeputusanChange("setuju")}
                disabled={loading}
              >
                <CheckIcon className="h-6 w-6 mr-2" />
                Setujui Semua
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
                  verifikasiData.keputusan === "sebagian"
                    ? "bg-yellow-500 text-white shadow"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => onKeputusanChange("sebagian")}
                disabled={loading}
              >
                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                Setujui Sebagian
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
                  verifikasiData.keputusan === "tolak"
                    ? "bg-red-600 text-white shadow"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => onKeputusanChange("tolak")}
                disabled={loading}
              >
                <XMarkIcon className="h-6 w-5 mr-6" />
                Tolak Semua
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mb-6">
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
                    Diminta
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Disetujui
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Satuan
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Stok
                  </th>
                </tr>
              </thead>
              <tbody>
                {(verifikasiData.items || []).map((item, idx) => (
                  <tr
                    key={item.id}
                    className={
                      getRowBackgroundColor(item) +
                      (idx % 2 === 0 ? " bg-white" : " bg-gray-50")
                    }
                  >
                    <td className="px-3 py-2">{item.kodeBarang}</td>
                    <td className="px-3 py-2">{item.namaBarang}</td>
                    <td className="px-3 py-2">{item.kategori}</td>
                    <td className="px-3 py-2 text-right">
                      {item.jumlahDiminta}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min={0}
                        max={item.jumlahDiminta}
                        value={item.jumlahDisetujui}
                        onChange={(e) => onItemChange(item.id, e.target.value)}
                        className="w-16 border rounded px-2 py-1"
                        disabled={
                          loading ||
                          verifikasiData.keputusan === "setuju" ||
                          verifikasiData.keputusan === "tolak"
                        }
                      />
                    </td>
                    <td className="px-3 py-2 text-right">{item.satuan}</td>
                    <td className="px-3 py-2 text-right">
                      {item.stokTersedia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Catatan Verifikasi
            </label>
            <textarea
              name="catatanVerifikasi"
              value={verifikasiData.catatanVerifikasi}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              disabled={loading}
              placeholder="Catatan opsional..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Memproses..." : "Verifikasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestVerifikasiModal;
