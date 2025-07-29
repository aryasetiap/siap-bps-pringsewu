import React, { useState, useEffect } from "react";
import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardChart from "../../components/dashboard/DashboardChart";
import DashboardNotifKritis from "../../components/dashboard/DashboardNotifKritis";
import DashboardRecentRequests from "../../components/dashboard/DashboardRecentRequests";
import * as dashboardService from "../../services/dashboardService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBarang: 0,
    permintaanTertunda: 0,
    barangKritis: 0,
    totalUser: 0,
  });
  const [chartData, setChartData] = useState(null);
  const [notifKritis, setNotifKritis] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

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
      // TODO: tampilkan notifikasi error
    }
    setLoading(false);
  };

  const handleDetailRequest = (req) => {
    // TODO: buka modal detail permintaan
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
      <p className="text-gray-600 mb-6">
        Statistik, grafik, dan notifikasi stok kritis barang persediaan
      </p>
      <DashboardStats stats={stats} />
      <DashboardChart chartData={chartData} />
      <DashboardNotifKritis items={notifKritis} />
      <DashboardRecentRequests
        requests={recentRequests}
        onDetail={handleDetailRequest}
      />
      {/* TODO: Modal detail permintaan jika diperlukan */}
    </div>
  );
};

export default AdminDashboard;
