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
  <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Daftar Barang yang Diminta</h2>
    {items.length === 0 ? (
      <p className="text-gray-500 mb-4">Belum ada barang yang dipilih.</p>
    ) : (
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Nama Barang
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Jumlah
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Satuan
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td className="px-4 py-2">{item.nama}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="1"
                  max={item.stok}
                  value={item.jumlah}
                  onChange={(e) => onItemChange(item.id, e.target.value)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                  required
                />
              </td>
              <td className="px-4 py-2">{item.satuan}</td>
              <td className="px-4 py-2 text-center">
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:underline"
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
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Catatan tambahan untuk permintaan"
      />
    </div>
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "Kirim Permintaan"}
      </button>
    </div>
  </form>
);

export default EmployeeRequestForm;
