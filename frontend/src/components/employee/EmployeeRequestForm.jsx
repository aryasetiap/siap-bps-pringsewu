import React from "react";
import {
  TrashIcon,
  PaperAirplaneIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const EmployeeRequestForm = ({
  items,
  onItemChange,
  onRemoveItem,
  onSubmit,
  loading,
  catatan,
  onCatatanChange,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center space-x-3 mb-6">
      <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
      <h2 className="text-xl font-bold text-gray-900">
        Daftar Barang yang Diminta
      </h2>
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        {items.length} Item
      </span>
    </div>

    {items.length === 0 ? (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="flex justify-center mb-3">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300" />
        </div>
        Belum ada barang yang ditambahkan.
        <br />
        Pilih barang dari daftar di atas.
      </div>
    ) : (
      <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Barang
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Barang
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satuan
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 font-mono text-sm">{item.kode}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.nama}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    {item.kategori || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{item.stok}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center">
                    <input
                      type="number"
                      min="1"
                      max={item.stok}
                      value={item.jumlah}
                      onChange={(e) => onItemChange(item.id, e.target.value)}
                      className={`w-20 px-2 py-1 border rounded text-center ${
                        parseInt(item.jumlah) > item.stok
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      required
                    />
                  </div>
                  {parseInt(item.jumlah) > item.stok && (
                    <p className="text-red-500 text-xs mt-1">
                      Melebihi stok tersedia!
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-gray-500">
                  {item.satuan}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-full transition"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Catatan Permintaan (opsional)
      </label>
      <textarea
        value={catatan}
        onChange={onCatatanChange}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
        placeholder="Tambahkan catatan untuk permintaan Anda (tujuan penggunaan, kebutuhan khusus, dll.)"
      />
    </div>

    <div className="flex justify-end">
      <button
        onClick={onSubmit}
        disabled={loading || items.length === 0}
        className={`flex items-center px-6 py-2.5 ${
          items.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-medium rounded-lg transition shadow-sm`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Memproses...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Ajukan Permintaan
          </>
        )}
      </button>
    </div>
  </div>
);

export default EmployeeRequestForm;
