import React from "react";
const EmployeeRequestDetailModal = ({ show, permintaan, onClose }) => {
  if (!show || !permintaan) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Detail Permintaan - {permintaan.nomorPermintaan}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div className="mb-2">
          <div className="text-sm text-gray-600">
            Tanggal:{" "}
            {new Date(permintaan.tanggalPermintaan).toLocaleString("id-ID")}
          </div>
          <div className="text-sm text-gray-600">
            Status: <span className="font-semibold">{permintaan.status}</span>
          </div>
          <div className="text-sm text-gray-600">
            Catatan: {permintaan.catatan || "-"}
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Barang
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Jumlah Diminta
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Jumlah Disetujui
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Satuan
              </th>
            </tr>
          </thead>
          <tbody>
            {permintaan.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.namaBarang}</td>
                <td className="px-4 py-2">{item.jumlahDiminta}</td>
                <td className="px-4 py-2">{item.jumlahDisetujui ?? "-"}</td>
                <td className="px-4 py-2">{item.satuan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default EmployeeRequestDetailModal;
