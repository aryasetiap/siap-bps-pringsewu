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

import React, { useState, useEffect } from "react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";

/**
 * Modal untuk form tambah/edit barang.
 *
 * Props:
 * - show: Boolean untuk menampilkan/menyembunyikan modal
 * - mode: String ("add" atau "edit") untuk menentukan mode modal
 * - formData: Object data form
 * - kategoriOptions: Array pilihan kategori
 * - satuanOptions: Array pilihan satuan
 * - loading: Boolean status loading
 * - onChange: Function handler perubahan input
 * - onClose: Function handler tutup modal
 * - onSubmit: Function handler submit form
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
  // State untuk custom kategori dan satuan - SELALU di atas, tidak kondisional
  const [customKategori, setCustomKategori] = useState("");
  const [customSatuan, setCustomSatuan] = useState("");
  const [showCustomKategori, setShowCustomKategori] = useState(false);
  const [showCustomSatuan, setShowCustomSatuan] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // useEffect untuk reset state saat modal dibuka/ditutup
  useEffect(() => {
    if (show) {
      setCustomKategori("");
      setCustomSatuan("");
      setShowCustomKategori(false);
      setShowCustomSatuan(false);
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [show, mode]);

  // Early return SETELAH semua hooks dipanggil
  if (!show) return null;

  /**
   * Handler untuk perubahan kategori
   */
  const handleKategoriChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomKategori(true);
      onChange({ target: { name: "kategori", value: "" } });
    } else {
      setShowCustomKategori(false);
      setCustomKategori("");
      onChange(e);
    }
  };

  /**
   * Handler untuk perubahan satuan
   */
  const handleSatuanChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomSatuan(true);
      onChange({ target: { name: "satuan", value: "" } });
    } else {
      setShowCustomSatuan(false);
      setCustomSatuan("");
      onChange(e);
    }
  };

  /**
   * Handler untuk perubahan custom kategori
   */
  const handleCustomKategoriChange = (e) => {
    const value = e.target.value;
    setCustomKategori(value);
    onChange({ target: { name: "kategori", value } });
  };

  /**
   * Handler untuk perubahan custom satuan
   */
  const handleCustomSatuanChange = (e) => {
    const value = e.target.value;
    setCustomSatuan(value);
    onChange({ target: { name: "satuan", value } });
  };

  /**
   * Handler untuk perubahan file gambar
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handler untuk submit form
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
    if (
      !formData.kode ||
      !formData.nama ||
      !formData.kategori ||
      !formData.satuan
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    // Validasi stok dan stok minimum harus berupa angka positif
    if (isNaN(formData.stok) || formData.stok < 0) {
      alert("Stok harus berupa angka positif!");
      return;
    }

    if (isNaN(formData.stokMinimum) || formData.stokMinimum < 0) {
      alert("Stok minimum harus berupa angka positif!");
      return;
    }

    // Panggil onSubmit dengan data form dan file
    onSubmit(formData, selectedFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {mode === "add" ? "Tambah Barang Baru" : "Edit Barang"}
            </h3>
            <button
              className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
              onClick={onClose}
              aria-label="Tutup"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Upload Foto */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-xl border-4 border-dashed border-gray-300 flex items-center justify-center">
                  <CameraIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">
              Klik untuk upload foto barang (opsional)
            </p>
          </div>

          {/* Grid untuk form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kode Barang */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kode Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kode"
                value={formData.kode}
                onChange={onChange}
                placeholder="Masukkan kode barang"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
              />
            </div>

            {/* Nama Barang */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={onChange}
                placeholder="Masukkan nama barang"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              {!showCustomKategori ? (
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleKategoriChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
                >
                  <option value="">Pilih kategori</option>
                  {kategoriOptions.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                  <option value="custom">+ Kategori Lain</option>
                </select>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customKategori}
                    onChange={handleCustomKategoriChange}
                    placeholder="Masukkan kategori baru"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomKategori(false);
                      setCustomKategori("");
                      onChange({ target: { name: "kategori", value: "" } });
                    }}
                    className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>

            {/* Satuan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Satuan <span className="text-red-500">*</span>
              </label>
              {!showCustomSatuan ? (
                <select
                  name="satuan"
                  value={formData.satuan}
                  onChange={handleSatuanChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
                >
                  <option value="">Pilih satuan</option>
                  {satuanOptions.map((satuan) => (
                    <option key={satuan} value={satuan}>
                      {satuan}
                    </option>
                  ))}
                  <option value="custom">+ Satuan Lain</option>
                </select>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customSatuan}
                    onChange={handleCustomSatuanChange}
                    placeholder="Masukkan satuan baru"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomSatuan(false);
                      setCustomSatuan("");
                      onChange({ target: { name: "satuan", value: "" } });
                    }}
                    className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>

            {/* Stok */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stok Awal <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stok"
                value={formData.stok}
                onChange={onChange}
                placeholder="0"
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
              />
            </div>

            {/* Stok Minimum */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stok Minimum <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stokMinimum"
                value={formData.stokMinimum}
                onChange={onChange}
                placeholder="0"
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={onChange}
              placeholder="Masukkan deskripsi barang (opsional)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition resize-none"
            />
          </div>

          {/* Footer Modal */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading
                ? "Menyimpan..."
                : mode === "add"
                ? "Tambah Barang"
                : "Update Barang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarangFormModal;
