/**
 * BarangFormModal.jsx
 *
 * Komponen modal form untuk tambah/edit data barang pada aplikasi SIAP.
 * Digunakan dalam proses pengelolaan barang, seperti penambahan barang baru atau pengeditan data barang yang sudah ada.
 *
 * Parameter:
 * - show (boolean): Menentukan apakah modal ditampilkan.
 * - mode ('add' | 'edit'): Mode form, 'add' untuk tambah barang baru, 'edit' untuk edit barang.
 * - formData (object): Data barang yang sedang diedit atau akan ditambahkan.
 * - kategoriOptions (array): Daftar kategori barang yang tersedia.
 * - satuanOptions (array): Daftar satuan barang yang tersedia.
 * - loading (boolean): Status loading saat proses simpan data.
 * - onChange (function): Handler perubahan input form.
 * - onClose (function): Handler untuk menutup modal.
 * - onSubmit (function): Handler untuk submit form.
 *
 * Return:
 * - React Element: Modal form barang.
 */

import React from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

/**
 * Komponen BarangFormModal
 *
 * Modal form untuk input data barang pada aplikasi SIAP.
 * Menampilkan form input dengan field kode barang, nama barang, kategori, satuan, stok awal, stok minimum, dan deskripsi.
 *
 * Parameter:
 * - show (boolean): Status visibilitas modal.
 * - mode ('add' | 'edit'): Mode form, menentukan ikon dan judul.
 * - formData (object): Data barang yang diinput.
 * - kategoriOptions (array): Pilihan kategori barang.
 * - satuanOptions (array): Pilihan satuan barang.
 * - loading (boolean): Status loading tombol submit.
 * - onChange (function): Fungsi handler perubahan input.
 * - onClose (function): Fungsi handler tutup modal.
 * - onSubmit (function): Fungsi handler submit form.
 *
 * Return:
 * - React Element: Modal form barang.
 */
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
  // Jika modal tidak ditampilkan, return null
  if (!show) return null;

  // Helper untuk render opsi select kategori
  const renderKategoriOptions = () =>
    kategoriOptions.map((kategori) => (
      <option key={kategori} value={kategori}>
        {kategori}
      </option>
    ));

  // Helper untuk render opsi select satuan
  const renderSatuanOptions = () =>
    satuanOptions.map((satuan) => (
      <option key={satuan} value={satuan}>
        {satuan}
      </option>
    ));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        {/* Tombol tutup modal */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
        {/* Header modal: ikon dan judul sesuai mode */}
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3 shadow">
            {mode === "add" ? (
              <PlusIcon className="h-6 w-6" />
            ) : (
              <PencilIcon className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {mode === "add" ? "Tambah Barang Baru" : "Edit Barang"}
          </h3>
        </div>
        {/* Form input data barang */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Input kode barang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kode Barang
            </label>
            <input
              type="text"
              name="kode"
              value={formData.kode}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>
          {/* Input nama barang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Barang
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Select kategori barang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kategori
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {renderKategoriOptions()}
            </select>
          </div>
          {/* Select satuan barang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Satuan
            </label>
            <select
              name="satuan"
              value={formData.satuan}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Satuan</option>
              {renderSatuanOptions()}
            </select>
          </div>
          {/* Input stok awal dan stok minimum */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Stok Awal
              </label>
              <input
                type="number"
                name="stok"
                value={formData.stok}
                onChange={onChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Stok Minimum
              </label>
              <input
                type="number"
                name="stokMinimum"
                value={formData.stokMinimum}
                onChange={onChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {/* Input deskripsi barang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={onChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Tombol aksi: batal dan simpan */}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarangFormModal;
