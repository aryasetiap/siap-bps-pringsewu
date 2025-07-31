import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DashboardNotifKritis = ({ items, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-2" />
      Notifikasi Stok Kritis
    </h2>
    {loading ? (
      <p className="text-gray-500">Memuat data...</p>
    ) : items.length === 0 ? (
      <p className="text-gray-500">Tidak ada barang dengan stok kritis.</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-2 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <span className="font-medium">{item.nama_barang}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({item.kode_barang})
              </span>
              <span className="ml-2 text-xs text-gray-500">
                | {item.satuan}
              </span>
              <div className="text-xs text-gray-400">{item.deskripsi}</div>
            </div>
            <div className="flex items-center space-x-4 mt-1 md:mt-0">
              <span>
                Stok:{" "}
                <span className="text-red-600 font-bold">{item.stok}</span>
              </span>
              <span className="text-xs text-gray-500">
                Minimum: {item.ambang_batas_kritis}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardNotifKritis;
