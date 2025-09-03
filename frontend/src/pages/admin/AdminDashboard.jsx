/**
 * File: AdminDashboard.jsx
 * Halaman dashboard admin untuk aplikasi SIAP BPS Pringsewu.
 * Menampilkan statistik, grafik permintaan barang, notifikasi stok kritis, dan permintaan barang terbaru.
 *
 * Komponen ini mengelola data dashboard dan modal detail permintaan barang.
 */

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardChart from "../../components/dashboard/DashboardChart";
import DashboardNotifKritis from "../../components/dashboard/DashboardNotifKritis";
import DashboardRecentRequests from "../../components/dashboard/DashboardRecentRequests";
import * as dashboardService from "../../services/dashboardService";

/**
 * Komponen utama dashboard admin SIAP.
 *
 * Menampilkan statistik barang, grafik permintaan, notifikasi stok kritis, dan daftar permintaan terbaru.
 * Mengelola state loading, data dashboard, dan modal detail permintaan.
 *
 * Return:
 * - JSX: Tampilan dashboard admin beserta modal detail permintaan barang.
 */
const AdminDashboard = () => {
  // State untuk menyimpan data statistik dashboard
  const [stats, setStats] = useState({
    totalBarang: 0,
    totalPermintaanTertunda: 0,
    totalBarangKritis: 0,
    totalUser: 0,
  });

  // State untuk data grafik permintaan barang
  const [chartData, setChartData] = useState([]);

  // State untuk notifikasi barang dengan stok kritis
  const [notifKritis, setNotifKritis] = useState([]);

  // State untuk daftar permintaan barang terbaru
  const [recentRequests, setRecentRequests] = useState([]);

  // State untuk status loading data dashboard
  const [loading, setLoading] = useState(false);

  // State untuk permintaan barang yang dipilih (detail modal)
  const [selectedRequest, setSelectedRequest] = useState(null);

  /**
   * Efek samping untuk mengambil data dashboard saat komponen pertama kali dirender.
   *
   * Parameter: Tidak ada
   *
   * Return: void
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fungsi ini digunakan untuk mengambil seluruh data dashboard dari backend secara paralel.
   *
   * Parameter: Tidak ada
   *
   * Return: Promise<void>
   * - Mengupdate state stats, chartData, notifKritis, recentRequests, dan loading.
   * - Menampilkan toast error jika gagal mengambil data.
   */
  const fetchDashboardData = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi ini digunakan untuk menampilkan detail permintaan barang pada modal.
   *
   * Parameter:
   * - req (Object): Data permintaan barang yang dipilih.
   *
   * Return: void
   * - Mengupdate state selectedRequest.
   */
  const handleDetailRequest = (req) => {
    setSelectedRequest(req);
  };

  /**
   * Fungsi ini digunakan untuk menutup modal detail permintaan barang.
   *
   * Parameter: Tidak ada
   *
   * Return: void
   * - Mengupdate state selectedRequest menjadi null.
   */
  const closeModal = () => setSelectedRequest(null);

  /**
   * Fungsi ini digunakan untuk menentukan kelas status permintaan barang.
   *
   * Parameter:
   * - status (string): Status permintaan barang.
   *
   * Return:
   * - string: Nama kelas CSS untuk status.
   */
  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-700";
      case "disetujui":
        return "bg-green-100 text-green-700";
      case "disetujui sebagian":
        return "bg-orange-100 text-orange-700";
      case "ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
      <p className="text-gray-600 mb-6">
        Statistik, grafik, dan notifikasi stok kritis barang persediaan
      </p>
      {/* Komponen statistik barang */}
      <DashboardStats stats={stats} loading={loading} />
      {/* Komponen grafik permintaan barang */}
      <DashboardChart chartData={chartData} loading={loading} />
      {/* Komponen notifikasi barang kritis */}
      <DashboardNotifKritis items={notifKritis} loading={loading} />
      {/* Komponen daftar permintaan barang terbaru */}
      <DashboardRecentRequests
        requests={recentRequests}
        onDetail={handleDetailRequest}
        loading={loading}
      />

      {/* Modal Detail Permintaan Barang */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
              onClick={closeModal}
              aria-label="Tutup"
            >
              &times;
            </button>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3 shadow">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Detail Permintaan #{selectedRequest.id}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Pemohon:</span>{" "}
                <span className="text-gray-900">
                  {selectedRequest.pemohon?.nama}
                </span>{" "}
                <span className="text-xs text-gray-500">
                  ({selectedRequest.pemohon?.unit_kerja})
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Tanggal Permintaan:
                </span>{" "}
                <span className="text-gray-900">
                  {new Date(
                    selectedRequest.tanggal_permintaan
                  ).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm align-middle ${getStatusClass(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status || "Menunggu"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Catatan:</span>{" "}
                <span className="text-gray-900">
                  {selectedRequest.catatan || "-"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Jumlah Item:</span>{" "}
                <span className="text-gray-900">
                  {selectedRequest.details.length}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Daftar Barang:
                </span>
                <ul className="list-disc ml-6 mt-1 space-y-1">
                  {/* Menampilkan daftar barang yang diminta */}
                  {selectedRequest.details.map((d) => (
                    <li key={d.id} className="text-gray-800">
                      <span className="font-semibold">
                        {d.barang?.nama_barang}
                      </span>{" "}
                      <span className="text-xs text-gray-500">
                        ({d.barang?.kode_barang})
                      </span>{" "}
                      <span className="text-gray-600">
                        - {d.jumlah_diminta} {d.barang?.satuan}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
