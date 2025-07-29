import React from "react";
const LaporanTable = ({ data, loading }) => (
  <div className="bg-white rounded-lg shadow">
    {loading ? (
      <div className="p-8 text-center text-blue-600">Memuat data...</div>
    ) : (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nama Barang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Total Digunakan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Satuan
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                Tidak ada data penggunaan barang
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">{row.nama_barang}</td>
                <td className="px-6 py-4">{row.total_digunakan}</td>
                <td className="px-6 py-4">{row.satuan}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    )}
  </div>
);
export default LaporanTable;
