import React from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onCancel}
          disabled={loading}
          aria-label="Tutup"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center mb-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-3">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>

        <p className="mb-6 text-gray-600">{message}</p>

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
