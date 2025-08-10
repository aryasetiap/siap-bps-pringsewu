import React from "react";

const EmployeeRequestHistoryTable = ({
  permintaan,
  onDetail,
  getStatusColor,
  formatDate, // Add this prop
}) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nomor
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tanggal
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Item
          </th>
          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{item.nomorPermintaan || item.id}</td>
              <td className="px-4 py-3">
                {formatDate(item.tanggalPermintaan)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {(item.items || []).length}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDetail(item)}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
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
