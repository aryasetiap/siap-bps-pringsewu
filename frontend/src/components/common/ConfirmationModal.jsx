/**
 * ConfirmationModal.jsx
 *
 * Komponen modal konfirmasi untuk aplikasi SIAP BPS Pringsewu.
 * Digunakan untuk menampilkan dialog konfirmasi pada proses pengelolaan barang, permintaan, dan verifikasi.
 *
 * Parameter:
 * - show (boolean): Menentukan apakah modal ditampilkan.
 * - title (string): Judul modal konfirmasi.
 * - message (string): Pesan atau deskripsi yang ditampilkan pada modal.
 * - onConfirm (function): Fungsi callback ketika tombol konfirmasi ditekan.
 * - onCancel (function): Fungsi callback ketika modal dibatalkan atau ditutup.
 * - confirmText (string, opsional): Teks pada tombol konfirmasi (default: "OK").
 * - cancelText (string, opsional): Teks pada tombol batal (default: "Batal").
 * - loading (boolean, opsional): Status loading saat proses konfirmasi berlangsung.
 *
 * Return:
 * - React Element: Komponen modal konfirmasi.
 */

import React from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Komponen ConfirmationModal
 *
 * Menampilkan modal konfirmasi untuk aksi penting seperti verifikasi permintaan barang.
 * Modal ini dapat digunakan pada berbagai proses bisnis SIAP yang membutuhkan persetujuan user.
 *
 * Parameter:
 * - show (boolean): Status visibilitas modal.
 * - title (string): Judul modal.
 * - message (string): Pesan utama modal.
 * - onConfirm (function): Handler ketika user menekan tombol konfirmasi.
 * - onCancel (function): Handler ketika user membatalkan atau menutup modal.
 * - confirmText (string): Label tombol konfirmasi.
 * - cancelText (string): Label tombol batal.
 * - loading (boolean): Status loading tombol konfirmasi.
 *
 * Return:
 * - React Element: Modal konfirmasi.
 */
const ConfirmationModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Batal",
  loading = false,
}) => {
  // Jika modal tidak perlu ditampilkan, kembalikan null
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        {/* Tombol untuk menutup modal */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onCancel}
          disabled={loading}
          aria-label="Tutup"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Header modal dengan ikon dan judul */}
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-3">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>

        {/* Pesan utama modal */}
        <p className="mb-6 text-gray-600">{message}</p>

        {/* Tombol aksi: batal dan konfirmasi */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
          >
            {loading ? (
              <>
                {/* Indikator loading saat proses konfirmasi */}
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Memproses...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
