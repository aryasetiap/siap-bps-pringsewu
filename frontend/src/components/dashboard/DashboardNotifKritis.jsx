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
          <li key={item.id} className="py-2 flex justify-between items-center">
            <span>
              <span className="font-medium">{item.nama}</span> (Stok:{" "}
              <span className="text-red-600 font-bold">{item.stok}</span>)
            </span>
            <span className="text-xs text-gray-500">
              Minimum: {item.ambang_batas_kritis}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardNotifKritis;
