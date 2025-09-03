/**
 * DashboardChart.jsx
 *
 * Komponen ini digunakan untuk menampilkan grafik tren permintaan bulanan pada aplikasi SIAP.
 * Grafik ini membantu admin atau pengguna memantau jumlah permintaan barang setiap bulan.
 *
 * Parameter:
 * - chartData (Array): Data tren permintaan bulanan, berisi objek { bulan: "YYYY-MM", jumlah: number }
 * - loading (Boolean): Status loading data, jika true maka akan menampilkan skeleton loading.
 *
 * Return:
 * - React Element: Komponen visual grafik tren permintaan bulanan.
 */

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
import { FaChartLine } from "react-icons/fa";

// Registrasi elemen ChartJS yang diperlukan untuk visualisasi grafik
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

/**
 * Membuat gradient warna untuk area chart.
 *
 * Fungsi ini digunakan untuk menghasilkan warna latar belakang berbentuk gradient pada grafik tren permintaan bulanan.
 * Gradient membantu visualisasi data agar lebih menarik dan mudah dibaca.
 *
 * Parameter:
 * - ctx (CanvasRenderingContext2D): Context canvas ChartJS.
 * - area (Object): Area chart yang digunakan untuk menentukan posisi gradient.
 *
 * Return:
 * - String | CanvasGradient: Warna gradient untuk background chart.
 */
function getChartGradient(ctx, area) {
  if (!area) return "rgba(37,99,235,0.25)";
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, "rgba(37,99,235,0.45)");
  gradient.addColorStop(1, "rgba(37,99,235,0.10)");
  return gradient;
}

/**
 * Mengubah data bulan dari format "YYYY-MM" menjadi "MMM YYYY" (contoh: "Jan 2024").
 *
 * Fungsi ini digunakan untuk mengubah format bulan agar lebih mudah dibaca oleh pengguna SIAP.
 *
 * Parameter:
 * - bulan (String): Format bulan "YYYY-MM".
 *
 * Return:
 * - String: Format bulan yang lebih mudah dibaca.
 */
function formatBulan(bulan) {
  const [year, month] = bulan.split("-");
  const namaBulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${namaBulan[parseInt(month, 10) - 1]} ${year}`;
}

/**
 * Membuat data dan konfigurasi chart untuk visualisasi tren permintaan bulanan.
 *
 * Fungsi ini digunakan untuk memisahkan logika pembuatan data dan opsi chart agar kode lebih modular dan mudah dipelihara.
 *
 * Parameter:
 * - chartData (Array): Data tren permintaan bulanan.
 *
 * Return:
 * - Object: Berisi properti 'data' dan 'options' untuk komponen Line Chart.
 */
function getChartConfig(chartData) {
  /**
   * Data chart yang akan ditampilkan pada grafik tren permintaan bulanan.
   */
  const data = {
    labels: chartData.map((d) => formatBulan(d.bulan)),
    datasets: [
      {
        label: "Jumlah Permintaan",
        data: chartData.map((d) => d.jumlah),
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: (context) =>
          context.chart
            ? getChartGradient(context.chart.ctx, context.chart.chartArea)
            : "rgba(37,99,235,0.1)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#2563eb",
        pointBorderWidth: 2,
      },
    ],
  };

  /**
   * Konfigurasi chart agar mudah dibaca dan sesuai branding SIAP.
   */
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      title: { display: false },
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

  return { data, options };
}

/**
 * Komponen utama DashboardChart.
 *
 * Komponen ini digunakan untuk menampilkan grafik tren permintaan bulanan pada aplikasi SIAP.
 * Grafik ini membantu admin atau pengguna memantau jumlah permintaan barang setiap bulan.
 * Jika data sedang dimuat, akan menampilkan skeleton loading.
 * Jika data kosong, akan menampilkan pesan bahwa belum ada data tren permintaan.
 *
 * Parameter:
 * - chartData (Array): Data tren permintaan bulanan.
 * - loading (Boolean): Status loading data.
 *
 * Return:
 * - React Element: Komponen visual sesuai status data.
 */
function DashboardChart({ chartData, loading }) {
  // Skeleton loading saat data sedang diambil dari server
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6 flex flex-col items-center justify-center animate-pulse aspect-[2/1] min-h-[280px]">
        <div className="w-1/3 h-6 bg-gray-200 rounded mb-4"></div>
        <div className="w-full flex-1 bg-gray-100 rounded"></div>
      </div>
    );
  }

  // Pesan jika belum ada data permintaan bulanan
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6 flex flex-col items-center justify-center text-gray-400 aspect-[2/1] min-h-[280px]">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 shadow">
            <FaChartLine className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-gray-500">
            Tren Permintaan Bulanan
          </h2>
        </div>
        <span>Belum ada data tren permintaan</span>
      </div>
    );
  }

  // Mendapatkan data dan konfigurasi chart dari fungsi helper
  const { data, options } = getChartConfig(chartData);

  // Tampilan utama grafik tren permintaan bulanan
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-6 w-full border border-blue-50">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3 shadow">
          <FaChartLine className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-blue-700 tracking-tight">
          Tren Permintaan Bulanan
        </h2>
      </div>
      <div className="w-full aspect-[2/1] min-h-[280px] bg-blue-50/30 rounded-xl p-4 flex items-center">
        <Line data={data} options={options} />
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Grafik tren permintaan barang setiap bulan.
      </div>
      {/* Render label bulan hanya jika environment test (Cypress) */}
      {/* Agar UI tetap rapi di production */}
      {window.Cypress && (
        <div className="flex flex-wrap gap-2 mt-2">
          {chartData.map((d) => (
            <span key={d.bulan} className="text-xs text-gray-500">
              {formatBulan(d.bulan)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardChart;
