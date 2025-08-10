import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const EmployeeBarangTable = ({
  barang,
  searchTerm,
  filterKategori,
  kategoriOptions,
  onSearchChange,
  onFilterKategoriChange,
  onAddItem,
  keranjang, // tambahkan prop ini
  loading,
}) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau kode barang..."
            value={searchTerm}
            onChange={onSearchChange}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={filterKategori}
            onChange={onFilterKategoriChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kode
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Barang
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Satuan
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div className="mt-2 text-gray-500">Memuat data barang...</div>
              </td>
            </tr>
          ) : barang.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                Tidak ada barang ditemukan
              </td>
            </tr>
          ) : (
            barang.map((item) => {
              // Cek apakah barang sudah ada di keranjang
              const isInCart = keranjang?.some(
                (cartItem) => cartItem.id === item.id
              );

              return (
                <tr key={item.id} className={isInCart ? "bg-blue-50" : ""}>
                  <td className="px-4 py-3">{item.kode}</td>
                  <td className="px-4 py-3 font-medium">{item.nama}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {item.kategori || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{item.stok}</td>
                  <td className="px-4 py-3 text-center">{item.satuan}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onAddItem(item)}
                      disabled={isInCart || item.stok < 1}
                      className={`px-3 py-1 rounded-lg ${
                        isInCart
                          ? "bg-green-100 text-green-700 cursor-default"
                          : item.stok < 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isInCart ? "Ditambahkan" : "Tambah"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeBarangTable;
