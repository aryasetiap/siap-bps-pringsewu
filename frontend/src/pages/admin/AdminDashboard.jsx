import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardChart from "../../components/dashboard/DashboardChart";
import DashboardNotifKritis from "../../components/dashboard/DashboardNotifKritis";
import DashboardRecentRequests from "../../components/dashboard/DashboardRecentRequests";
import * as dashboardService from "../../services/dashboardService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBarang: 0,
    totalPermintaanTertunda: 0,
    totalBarangKritis: 0,
    totalUser: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [notifKritis, setNotifKritis] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, chartRes, notifRes, recentRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getChart(),
        dashboardService.getNotifKritis(),
        dashboardService.getRecentRequests(),
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data);
      setNotifKritis(notifRes.data);
      setRecentRequests(recentRes.data);
    } catch (err) {
      toast.error("Gagal memuat data dashboard.");
    }
    setLoading(false);
  };

  const handleDetailRequest = (req) => {
    setSelectedRequest(req);
  };

  const closeModal = () => setSelectedRequest(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
      <p className="text-gray-600 mb-6">
        Statistik, grafik, dan notifikasi stok kritis barang persediaan
      </p>
      <DashboardStats stats={stats} loading={loading} />
      <DashboardChart chartData={chartData} loading={loading} />
      <DashboardNotifKritis items={notifKritis} loading={loading} />
      <DashboardRecentRequests
        requests={recentRequests}
        onDetail={handleDetailRequest}
        loading={loading}
      />

      {/* Modal Detail Permintaan */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">
              Detail Permintaan #{selectedRequest.id}
            </h3>
            <div className="mb-2">
              <span className="font-medium">Pemohon:</span>{" "}
              {selectedRequest.pemohon?.nama} (
              {selectedRequest.pemohon?.unit_kerja})
            </div>
            <div className="mb-2">
              <span className="font-medium">Tanggal Permintaan:</span>{" "}
              {new Date(selectedRequest.tanggal_permintaan).toLocaleDateString(
                "id-ID"
              )}
            </div>
            <div className="mb-2">
              <span className="font-medium">Status:</span>{" "}
              {selectedRequest.status}
            </div>
            <div className="mb-2">
              <span className="font-medium">Catatan:</span>{" "}
              {selectedRequest.catatan || "-"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Jumlah Item:</span>{" "}
              {selectedRequest.details.length}
            </div>
            <div className="mb-2">
              <span className="font-medium">Daftar Barang:</span>
              <ul className="list-disc ml-6 mt-1">
                {selectedRequest.details.map((d) => (
                  <li key={d.id}>
                    <span className="font-medium">{d.barang?.nama_barang}</span>{" "}
                    ({d.barang?.kode_barang}) - {d.jumlah_diminta}{" "}
                    {d.barang?.satuan}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
