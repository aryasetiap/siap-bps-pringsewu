/**
 * Komponen RequestVerifikasiModal
 *
 * Komponen ini digunakan untuk menampilkan modal verifikasi permintaan barang pada aplikasi SIAP.
 * Modal ini memungkinkan verifikator untuk menentukan keputusan (setuju, sebagian, tolak) atas permintaan barang,
 * mengatur jumlah barang yang disetujui, serta memberikan catatan verifikasi.
 *
 * Parameter:
 * - show (boolean): Menentukan apakah modal ditampilkan.
 * - permintaan (object): Data permintaan barang yang diverifikasi.
 * - verifikasiData (object): Data hasil verifikasi (keputusan, catatan, dan item barang).
 * - loading (boolean): Status loading saat proses verifikasi berlangsung.
 * - onChange (function): Handler perubahan pada input catatan verifikasi.
 * - onItemChange (function): Handler perubahan jumlah barang yang disetujui per item.
 * - onKeputusanChange (function): Handler perubahan keputusan verifikasi.
 * - onClose (function): Handler untuk menutup modal.
 * - onSubmit (function): Handler untuk submit form verifikasi.
 * - getRowBackgroundColor (function): Fungsi untuk menentukan warna latar baris tabel berdasarkan status item.
 *
 * Return:
 * - React.Element: Modal verifikasi permintaan barang.
 */

import React from "react";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/**
 * Komponen utama modal verifikasi permintaan barang.
 *
 * Menampilkan detail permintaan, tabel barang, keputusan verifikasi, dan catatan.
 */
const RequestVerifikasiModal = ({
  show,
  permintaan,
  verifikasiData,
  loading,
  onChange,
  onItemChange,
  onKeputusanChange,
  onClose,
  onSubmit,
  getRowBackgroundColor,
}) => {
  // Jika modal tidak ditampilkan atau data permintaan tidak tersedia, kembalikan null
  if (!show || !permintaan) return null;

  /**
   * Render tombol keputusan verifikasi.
   *
   * Parameter:
   * - label (string): Label tombol.
   * - value (string): Nilai keputusan.
   * - Icon (React.Component): Ikon yang ditampilkan.
   * - activeColor (string): Warna background saat aktif.
   *
   * Return:
   * - React.Element: Tombol keputusan.
   */
  const renderKeputusanButton = (label, value, Icon, activeColor) => (
    <button
      type="button"
      className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
        verifikasiData.keputusan === value
          ? `${activeColor} text-white shadow`
          : "bg-gray-100 text-gray-700"
      }`}
      onClick={() => onKeputusanChange(value)}
      disabled={loading}
    >
      <Icon className="h-6 w-6 mr-2" />
      {label}
    </button>
  );

  /**
   * Render baris item barang pada tabel.
   *
   * Parameter:
   * - item (object): Data item barang.
   * - idx (number): Index baris.
   *
   * Return:
   * - React.Element: Baris tabel barang.
   */
  const renderItemRow = (item, idx) => (
    <tr
      key={item.id}
      className={
        getRowBackgroundColor(item) +
        (idx % 2 === 0 ? " bg-white" : " bg-gray-50")
      }
    >
      <td className="px-3 py-2">{item.kodeBarang}</td>
      <td className="px-3 py-2">{item.namaBarang}</td>
      <td className="px-3 py-2">{item.kategori}</td>
      <td className="px-3 py-2 text-right">{item.jumlahDiminta}</td>
      <td className="px-3 py-2 text-right">
        {/* Input jumlah disetujui hanya aktif jika keputusan 'sebagian' */}
        <input
          type="number"
          min={0}
          max={item.jumlahDiminta}
          value={item.jumlahDisetujui}
          onChange={(e) => onItemChange(item.id, e.target.value)}
          className="w-16 border rounded px-2 py-1"
          disabled={
            loading ||
            verifikasiData.keputusan === "setuju" ||
            verifikasiData.keputusan === "tolak"
          }
        />
      </td>
      <td className="px-3 py-2 text-right">{item.satuan}</td>
      <td className="px-3 py-2 text-right">{item.stokTersedia}</td>
    </tr>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl relative">
        {/* Tombol tutup modal */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {/* Header modal */}
        <div className="flex items-center mb-6">
          <div className="bg-green-100 text-green-600 rounded-full p-3 mr-4 shadow">
            <CheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Verifikasi Permintaan #{permintaan.nomorPermintaan}
          </h3>
        </div>
        {/* Form verifikasi */}
        <form onSubmit={onSubmit}>
          {/* Pilihan keputusan verifikasi */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Keputusan Verifikasi
            </label>
            <div className="flex space-x-3">
              {renderKeputusanButton(
                "Setujui Semua",
                "setuju",
                CheckIcon,
                "bg-green-600"
              )}
              {renderKeputusanButton(
                "Setujui Sebagian",
                "sebagian",
                ExclamationTriangleIcon,
                "bg-yellow-500"
              )}
              {renderKeputusanButton(
                "Tolak Semua",
                "tolak",
                XMarkIcon,
                "bg-red-600"
              )}
            </div>
          </div>
          {/* Tabel daftar barang permintaan */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 text-left text-xs font-bold text-blue-700">
                    Kode
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-blue-700">
                    Nama Barang
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-blue-700">
                    Kategori
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Diminta
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Disetujui
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Satuan
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-blue-700">
                    Stok
                  </th>
                </tr>
              </thead>
              <tbody>{(verifikasiData.items || []).map(renderItemRow)}</tbody>
            </table>
          </div>
          {/* Catatan verifikasi */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Catatan Verifikasi
            </label>
            <textarea
              name="catatanVerifikasi"
              value={verifikasiData.catatanVerifikasi}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              disabled={loading}
              placeholder="Catatan opsional..."
            />
          </div>
          {/* Tombol submit verifikasi */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Memproses..." : "Verifikasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestVerifikasiModal;
