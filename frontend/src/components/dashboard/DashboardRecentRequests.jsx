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
            className="py-2 flex flex-col md:flex-row md:justify-between md:items-center cursor-pointer hover:bg-gray-50"
            onClick={() => onDetail(req)}
          >
            <div>
              <span className="font-medium">{req.pemohon?.nama || "-"}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({req.pemohon?.unit_kerja || "-"})
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {req.tanggal_permintaan
                  ? new Date(req.tanggal_permintaan).toLocaleDateString("id-ID")
                  : ""}
              </span>
              <div className="text-xs text-gray-500">
                {req.details.length} item:{" "}
                {req.details
                  .map((d) => d.barang?.nama_barang)
                  .filter(Boolean)
                  .slice(0, 3)
                  .join(", ")}
                {req.details.length > 3 && " ..."}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {req.status || "Menunggu"}
              </span>
              <button
                className="ml-2 text-xs text-blue-600 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDetail(req);
                }}
              >
                Detail
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardRecentRequests;
