import React from "react";

const EmployeeRequestForm = ({
  items,
  onItemChange,
  onRemoveItem,
  onSubmit,
  loading,
  catatan,
  onCatatanChange,
}) => (
  <div className="bg-white rounded-lg shadow p-6 mt-8">
    <h2 className="text-xl font-bold mb-4">Daftar Barang yang Diminta</h2>
    {items.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
        Belum ada barang yang ditambahkan. Pilih barang dari daftar di atas.
      </div>
    ) : (
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kode Barang
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Barang
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Satuan
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{item.kode}</td>
              <td className="px-4 py-2 font-medium">{item.nama}</td>
              <td className="px-4 py-2 text-center">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  {item.kategori || "-"}
                </span>
              </td>
              <td className="px-4 py-2 text-right">{item.stok}</td>
              <td className="px-4 py-2 text-center">
                <input
                  type="number"
                  min="1"
                  max={item.stok}
                  value={item.jumlah}
                  onChange={(e) => onItemChange(item.id, e.target.value)}
                  className={`w-20 px-2 py-1 border rounded text-center ${
                    parseInt(item.jumlah) > item.stok
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                {parseInt(item.jumlah) > item.stok && (
                  <p className="text-red-500 text-xs mt-1">
                    Melebihi stok tersedia!
                  </p>
                )}
              </td>
              <td className="px-4 py-2 text-center">{item.satuan}</td>
              <td className="px-4 py-2 text-center">
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Catatan (opsional)
      </label>
      <textarea
        value={catatan}
        onChange={onCatatanChange}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Catatan tambahan untuk permintaan"
      />
    </div>
    <div className="flex justify-end">
      <button
        onClick={onSubmit}
        disabled={loading || items.length === 0}
        className={`px-6 py-2 ${
          items.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-medium rounded-lg transition-colors`}
      >
        {loading ? "Memproses..." : "Kirim Permintaan"}
      </button>
    </div>
  </div>
);

export default EmployeeRequestForm;
