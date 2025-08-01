import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
        <div className="flex items-center mb-4">
          <div className="bg-green-100 text-green-600 rounded-full p-2 mr-3 shadow">
            <PlusCircleIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Tambah Stok Barang
          </h3>
        </div>
        <div className="mb-4 p-4 bg-gray-50 rounded-xl flex items-center space-x-4">
          {barang.foto && (
            <img
              src={barang.foto}
              alt={barang.nama}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
            />
          )}
          <div>
            <div className="text-lg font-bold text-gray-900">{barang.nama}</div>
            <div className="text-xs text-gray-500">{barang.kode}</div>
            <div className="text-sm text-gray-600 mt-1">
              Stok Saat Ini:{" "}
              <span className="font-semibold text-gray-900">
                {barang.stok} {barang.satuan}
              </span>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Jumlah Penambahan
            </label>
            <input
              type="number"
              name="jumlahTambah"
              value={stokData.jumlahTambah}
              onChange={onChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Keterangan (Opsional)
            </label>
            <input
              type="text"
              name="keterangan"
              value={stokData.keterangan}
              onChange={onChange}
              placeholder="Misal: Pembelian, Sumbangan, dll"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          {stokData.jumlahTambah && (
            <div className="p-3 bg-green-50 rounded-lg mt-2">
              <p className="text-sm text-green-600 font-semibold">
                Stok Setelah Penambahan:
              </p>
              <p className="font-bold text-green-800 text-lg">
                {barang.stok + parseInt(stokData.jumlahTambah || 0)}{" "}
                {barang.satuan}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Menambah..." : "Tambah Stok"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarangStokModal;
