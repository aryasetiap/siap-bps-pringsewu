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
import { FaChartLine } from "react-icons/fa"; // pastikan react-icons sudah diinstall

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const chartGradient = (ctx, area) => {
  if (!area) return "rgba(37,99,235,0.1)";
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, "rgba(37,99,235,0.05)");
  gradient.addColorStop(1, "rgba(37,99,235,0.3)");
  return gradient;
};

const DashboardChart = ({ chartData, loading }) => {
  // Custom dataset with gradient
  const data = {
    labels: chartData.map((d) => {
      const [year, month] = d.bulan.split("-");
      return `${new Date(year, month - 1).toLocaleString("id-ID", {
        month: "short",
      })} ${year}`;
    }),
    datasets: [
      {
        label: "Jumlah Permintaan",
        data: chartData.map((d) => d.jumlah),
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: (context) =>
          context.chart
            ? chartGradient(context.chart.ctx, context.chart.chartArea)
            : "rgba(37,99,235,0.1)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#2563eb",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "Bulan",
          color: "#6b7280",
          font: { size: 13, weight: "bold" },
        },
        ticks: { color: "#6b7280" },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: "#6b7280" },
        title: {
          display: true,
          text: "Jumlah Permintaan",
          color: "#6b7280",
          font: { size: 13, weight: "bold" },
        },
        grid: { color: "#e5e7eb" },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 flex flex-col items-center justify-center animate-pulse aspect-[2/1] min-h-[280px]">
        <div className="w-1/3 h-6 bg-gray-200 rounded mb-4"></div>
        <div className="w-full flex-1 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 flex items-center justify-center text-gray-400 aspect-[2/1] min-h-[280px]">
        Belum ada data tren permintaan
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 w-full">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-3 shadow">
          <FaChartLine size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Tren Permintaan Bulanan
        </h2>
      </div>
      <div className="w-full aspect-[2/1] min-h-[280px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
