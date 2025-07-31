import React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

const DashboardRecentRequests = ({ requests, onDetail, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <ClockIcon className="w-6 h-6 text-yellow-600 mr-2" />
      Permintaan Terbaru
    </h2>
    {loading ? (
      <p className="text-gray-500">Memuat data...</p>
    ) : requests.length === 0 ? (
      <p className="text-gray-500">Belum ada permintaan masuk.</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {requests.map((req) => (
          <li
            key={req.id}
            className="py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => onDetail(req)}
          >
            <div>
              <span className="font-medium">
                {req.nomorPermintaan || req.id}
              </span>
              {" - "}
              {req.pemohon?.nama || "-"}
              <span className="ml-2 text-xs text-gray-500">
                {req.tanggalPermintaan
                  ? new Date(req.tanggalPermintaan).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              {req.status || "Menunggu"}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardRecentRequests;
