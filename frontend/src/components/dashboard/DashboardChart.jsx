import React from "react";
// Gunakan chart library seperti chart.js/react-chartjs-2 jika sudah diinstall

const DashboardChart = ({ chartData }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-4">Tren Permintaan Bulanan</h2>
    {/* Ganti dengan komponen chart sesuai library */}
    <div className="h-64 flex items-center justify-center text-gray-400">
      {/* Placeholder chart */}
      {chartData ? "Chart akan tampil di sini" : "Memuat data..."}
    </div>
  </div>
);

export default DashboardChart;
