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
import { ToastContainer, toast } from "react-toastify"; // Add toast import here
import "react-toastify/dist/ReactToastify.css";
import EmployeeHistory from "./pages/employee/EmployeeHistory";
import LaporanPeriodik from "./pages/admin/LaporanPeriodik";
import CetakBuktiPermintaan from "./pages/admin/CetakBuktiPermintaan";
import ProfilePage from "./pages/ProfilePage";
import Error404 from "./pages/Error404";
import Forbidden from "./pages/Forbidden";
import { ProfileProvider } from "./context/ProfileContext";

function App() {
  // Remove these unused functions
  // const isAuthenticated = () => {
  //   return localStorage.getItem("authToken") ? true : false;
  // };

  // const getUserRole = () => {
  //   return localStorage.getItem("userRole");
  // };

  // Pastikan PrivateRoute menangani case expired token dengan benar
  const PrivateRoute = ({ children, roles }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("userRole");

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          // Verifikasi token di sini jika diperlukan
          // await authService.verifyToken();

          setIsAuthenticated(true);

          // Cek role jika diperlukan
          if (roles && !roles.includes(userRole)) {
            toast.error("Anda tidak memiliki akses ke halaman ini");
            setIsAuthenticated(false);
          }
        } catch (error) {
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
      // Tampilkan loading spinner
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rute untuk Admin */}
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

          {/* Rute untuk Pegawai */}
          <Route
            path="/pegawai/permintaan"
            element={
              <PrivateRoute roles={["pegawai"]}>
                <DashboardLayout>
                  <EmployeeRequestPage />{" "}
                  {/* Ganti dengan komponen yang sesuai untuk pegawai */}
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

          {/* Rute khusus error */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </ProfileProvider>
  );
}

export default App;
