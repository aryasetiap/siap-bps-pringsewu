import React from "react";

const EmployeeBarangTable = ({
  barang,
  searchTerm,
  filterKategori,
  onSearchChange,
  onFilterKategoriChange,
  onAddItem,
}) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
      <input
        type="text"
        placeholder="Cari nama atau kode barang..."
        value={searchTerm}
        onChange={onSearchChange}
        className="mb-2 md:mb-0 md:mr-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={filterKategori}
        onChange={onFilterKategoriChange}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Semua Kategori</option>
        {/* Kategori bisa diambil dari props jika dinamis */}
        <option value="Alat Tulis Kantor">Alat Tulis Kantor</option>
        <option value="Consumables">Consumables</option>
        <option value="Perlengkapan">Perlengkapan</option>
        <option value="Elektronik">Elektronik</option>
      </select>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Kode
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stok
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {barang.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                Tidak ada barang ditemukan
              </td>
            </tr>
          ) : (
            barang.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">{item.kode}</td>
                <td className="px-6 py-4">{item.nama}</td>
                <td className="px-6 py-4">{item.kategori}</td>
                <td className="px-6 py-4">
                  {item.stok} {item.satuan}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onAddItem(item)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={item.stok <= 0}
                  >
                    Tambah
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeBarangTable;
