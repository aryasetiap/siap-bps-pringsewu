import React from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const RequestDetailModal = ({
  show,
  permintaan,
  getStatusColor,
  formatDate,
  onClose,
}) => {
  if (!show || !permintaan) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Detail Permintaan - {permintaan.nomorPermintaan}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* ...info dan tabel item, mirip kode Anda... */}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
