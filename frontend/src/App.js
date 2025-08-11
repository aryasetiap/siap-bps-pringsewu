/**
 * File utama aplikasi SIAP-BPS Pringsewu.
 *
 * Aplikasi ini digunakan untuk pengelolaan barang, permintaan, verifikasi, dan manajemen pengguna
 * di lingkungan BPS Pringsewu. File ini mengatur routing utama aplikasi dan proteksi akses berdasarkan role.
 */

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManajemenBarang from "./pages/admin/ManajemenBarang";
import EmployeeRequestPage from "./pages/employee/EmployeeRequest";
import DashboardLayout from "./components/DashboardLayout";
import UserManagement from "./pages/admin/UserManagement";
import RequestVerification from "./pages/admin/RequestVerification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeHistory from "./pages/employee/EmployeeHistory";
import LaporanPeriodik from "./pages/admin/LaporanPeriodik";
import CetakBuktiPermintaan from "./pages/admin/CetakBuktiPermintaan";
import ProfilePage from "./pages/ProfilePage";
import Error404 from "./pages/Error404";
import Forbidden from "./pages/Forbidden";
import { ProfileProvider } from "./context/ProfileContext";

/**
 * Komponen PrivateRoute digunakan untuk membatasi akses halaman berdasarkan autentikasi dan role pengguna.
 *
 * Parameter:
 * - children (ReactNode): Komponen yang akan dirender jika akses diizinkan.
 * - roles (Array<string>): Daftar role yang diizinkan mengakses halaman.
 *
 * Return:
 * - ReactNode: Komponen anak jika akses diizinkan, atau redirect ke halaman login jika tidak.
 */
function PrivateRoute({ children, roles }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Fungsi ini melakukan pengecekan autentikasi dan role pengguna.
     * Jika token tidak ada atau role tidak sesuai, maka akses ditolak.
     */
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Jika ingin menambah verifikasi token ke server, tambahkan di sini.
        setIsAuthenticated(true);

        // Validasi role pengguna terhadap role yang diizinkan
        if (roles && !roles.includes(userRole)) {
          toast.error("Anda tidak memiliki akses ke halaman ini");
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Jika terjadi error (misal token expired), hapus data autentikasi
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
        toast.error("Sesi login telah berakhir, silakan login kembali");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [roles]);

  if (isLoading) {
    // Tampilkan loading spinner saat proses autentikasi
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect ke halaman login jika tidak terautentikasi
    return <Navigate to="/login" replace />;
  }

  // Render komponen anak jika akses diizinkan
  return children;
}

/**
 * Komponen utama aplikasi SIAP-BPS Pringsewu.
 * Mengatur routing dan layout berdasarkan role pengguna.
 *
 * Return:
 * - ReactNode: Struktur aplikasi beserta routing dan proteksi akses.
 */
function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          {/* Halaman Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routing untuk Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/barang"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <ManajemenBarang />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/pengguna"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/verifikasi"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <RequestVerification />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/laporan"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <LaporanPeriodik />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/permintaan/:id/cetak"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <CetakBuktiPermintaan />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Routing untuk Pegawai */}
          <Route
            path="/pegawai/permintaan"
            element={
              <PrivateRoute roles={["pegawai"]}>
                <DashboardLayout>
                  <EmployeeRequestPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pegawai/riwayat"
            element={
              <PrivateRoute roles={["pegawai"]}>
                <DashboardLayout>
                  <EmployeeHistory />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Routing untuk Profile (Admin & Pegawai) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={["admin", "pegawai"]}>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Routing untuk halaman error dan forbidden */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<Error404 />} />

          {/* Add this root route */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem("authToken")
                    ? localStorage.getItem("userRole") === "admin"
                      ? "/admin/dashboard"
                      : "/pegawai/permintaan"
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
        {/* Komponen Toast untuk notifikasi */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </ProfileProvider>
  );
}

export default App;
