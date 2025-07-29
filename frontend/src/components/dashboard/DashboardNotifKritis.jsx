import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DashboardNotifKritis = ({ items }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-2" />
      Notifikasi Stok Kritis
    </h2>
    {items.length === 0 ? (
      <p className="text-gray-500">Tidak ada barang dengan stok kritis.</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="py-2 flex justify-between">
            <span>
              <span className="font-medium">{item.nama}</span> ({item.kode})
            </span>
            <span className="text-red-600 font-semibold">
              {item.stok} {item.satuan}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardNotifKritis;
