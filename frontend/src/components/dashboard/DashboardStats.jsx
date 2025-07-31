import React from "react";
import {
  CubeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const DashboardStats = ({ stats, loading }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    {[
      {
        label: "Total Barang",
        value: stats.totalBarang,
        color: "from-blue-500 to-blue-300",
        icon: <CubeIcon className="w-9 h-9" />,
        text: "text-blue-700",
      },
      {
        label: "Permintaan Tertunda",
        value: stats.totalPermintaanTertunda,
        color: "from-yellow-400 to-yellow-200",
        icon: <ClipboardDocumentListIcon className="w-9 h-9" />,
        text: "text-yellow-700",
      },
      {
        label: "Barang Kritis",
        value: stats.totalBarangKritis,
        color: "from-red-500 to-red-300",
        icon: <ExclamationTriangleIcon className="w-9 h-9" />,
        text: "text-red-700",
      },
      {
        label: "Total Pengguna",
        value: stats.totalUser,
        color: "from-green-500 to-green-300",
        icon: <UsersIcon className="w-9 h-9" />,
        text: "text-green-700",
      },
    ].map((stat) => (
      <div
        key={stat.label}
        className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center p-6 group transition-all hover:shadow-lg hover:-translate-y-1"
      >
        <div
          className={`mb-4 bg-gradient-to-br ${stat.color} rounded-full w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
        >
          <span className="text-white">{stat.icon}</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">
            {stat.label}
          </p>
          <p className={`text-4xl font-extrabold ${stat.text} tracking-tight`}>
            {loading ? <span className="animate-pulse">...</span> : stat.value}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default DashboardStats;
