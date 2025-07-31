import React from "react";
// Gunakan chart library seperti chart.js/react-chartjs-2 jika sudah diinstall

const DashboardChart = ({ chartData, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-4">Tren Permintaan Bulanan</h2>
    <div className="h-64 flex items-center justify-center text-gray-400">
      {loading
        ? "Memuat data..."
        : chartData && chartData.length > 0
        ? "Chart akan tampil di sini (implementasi chart library)"
        : "Belum ada data tren permintaan"}
    </div>
  </div>
);

export default DashboardChart;
