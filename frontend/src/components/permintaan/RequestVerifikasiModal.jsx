import React from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

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
  if (!show || !permintaan) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Verifikasi Permintaan - {permintaan.nomorPermintaan}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            {/* ...form keputusan, tabel item, summary, catatan, tombol aksi... */}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Verifikasi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestVerifikasiModal;
