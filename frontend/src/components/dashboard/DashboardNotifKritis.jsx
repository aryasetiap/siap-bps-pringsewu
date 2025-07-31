import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DashboardNotifKritis = ({ items, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-red-100">
    <h2 className="text-lg font-bold mb-4 flex items-center text-red-700">
      <span className="bg-red-100 rounded-full p-2 mr-3 shadow">
        <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
      </span>
      Notifikasi Stok Kritis
    </h2>
    {loading ? (
      <p className="text-gray-500">Memuat data...</p>
    ) : items.length === 0 ? (
      <p className="text-gray-400">Tidak ada barang dengan stok kritis.</p>
    ) : (
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-3 px-2 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-red-50 transition rounded-lg"
          >
            <div>
              <span className="font-semibold text-red-700">
                {item.nama_barang}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                ({item.kode_barang}) | {item.satuan}
              </span>
              <div className="text-xs text-gray-400">{item.deskripsi}</div>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                Stok: <span className="ml-1">{item.stok}</span>
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
