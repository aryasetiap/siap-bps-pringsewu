import React from "react";

const BarangStokModal = ({
  show,
  barang,
  stokData,
  loading,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!show || !barang) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tambah Stok Barang
          </h3>
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Nama Barang:</p>
            <p className="font-medium">{barang.nama}</p>
            <p className="text-sm text-gray-600 mt-1">Stok Saat Ini:</p>
            <p className="font-medium">
              {barang.stok} {barang.satuan}
            </p>
            {stokData.jumlahTambah && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-600">
                  Stok Setelah Penambahan:
                </p>
                <p className="font-medium text-blue-800">
                  {barang.stok + parseInt(stokData.jumlahTambah || 0)}{" "}
                  {barang.satuan}
                </p>
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Penambahan
              </label>
              <input
                type="number"
                name="jumlahTambah"
                value={stokData.jumlahTambah}
                onChange={onChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keterangan (Opsional)
              </label>
              <input
                type="text"
                name="keterangan"
                value={stokData.keterangan}
                onChange={onChange}
                placeholder="Misal: Pembelian, Sumbangan, dll"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {stokData.jumlahTambah && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-600">
                  Stok Setelah Penambahan:
                </p>
                <p className="font-medium text-blue-800">
                  {barang.stok + parseInt(stokData.jumlahTambah || 0)}{" "}
                  {barang.satuan}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Menambah..." : "Tambah Stok"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BarangStokModal;
