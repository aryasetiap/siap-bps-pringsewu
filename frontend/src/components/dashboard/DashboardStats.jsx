import React from "react";
import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <div className="bg-white p-6 rounded-lg shadow border flex items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">Total Barang</p>
        <p className="text-2xl font-bold text-gray-900">{stats.totalBarang}</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <ArchiveBoxIcon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow border flex items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">Permintaan Tertunda</p>
        <p className="text-2xl font-bold text-yellow-600">
          {stats.permintaanTertunda}
        </p>
      </div>
      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
        <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-600" />
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow border flex items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">Barang Kritis</p>
        <p className="text-2xl font-bold text-red-600">{stats.barangKritis}</p>
      </div>
      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow border flex items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
        <p className="text-2xl font-bold text-green-600">{stats.totalUser}</p>
      </div>
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <UsersIcon className="w-6 h-6 text-green-600" />
      </div>
    </div>
  </div>
);

export default DashboardStats;
