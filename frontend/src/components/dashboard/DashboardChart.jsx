import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const DashboardChart = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6 h-64 flex items-center justify-center text-gray-400">
        Memuat data...
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6 h-64 flex items-center justify-center text-gray-400">
        Belum ada data tren permintaan
      </div>
    );
  }

  const data = {
    labels: chartData.map((d) => {
      // Format bulan: "2024-07" -> "Jul 2024"
      const [year, month] = d.bulan.split("-");
      return `${new Date(year, month - 1).toLocaleString("id-ID", {
        month: "short",
      })} ${year}`;
    }),
    datasets: [
      {
        label: "Jumlah Permintaan",
        data: chartData.map((d) => d.jumlah),
        fill: false,
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Tren Permintaan Bulanan</h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
