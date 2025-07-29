import React from "react";

const BarangFormModal = ({
  show,
  mode,
  formData,
  kategoriOptions,
  satuanOptions,
  loading,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {mode === "add" ? "Tambah Barang Baru" : "Edit Barang"}
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Barang
              </label>
              <input
                type="text"
                name="kode"
                value={formData.kode}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satuan
              </label>
              <select
                name="satuan"
                value={formData.satuan}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Satuan</option>
                {satuanOptions.map((satuan) => (
                  <option key={satuan} value={satuan}>
                    {satuan}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Awal
                </label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={onChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Minimum
                </label>
                <input
                  type="number"
                  name="stokMinimum"
                  value={formData.stokMinimum}
                  onChange={onChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={onChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BarangFormModal;
