import React from "react";
const EmployeeRequestHistoryTable = ({ permintaan, onDetail }) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Nomor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Tanggal
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Total Item
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {permintaan.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
              Tidak ada data permintaan
            </td>
          </tr>
        ) : (
          permintaan.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4">{item.nomorPermintaan}</td>
              <td className="px-6 py-4">
                {new Date(item.tanggalPermintaan).toLocaleDateString("id-ID")}
              </td>
              <td className="px-6 py-4">{item.status}</td>
              <td className="px-6 py-4">{item.items.length}</td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onDetail(item)}
                  className="text-blue-600 hover:underline"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
export default EmployeeRequestHistoryTable;
