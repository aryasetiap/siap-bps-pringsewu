import React from "react";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeHistory from "./pages/employee/EmployeeHistory";
import LaporanPeriodik from "./pages/admin/LaporanPeriodik";
import CetakBuktiPermintaan from "./pages/admin/CetakBuktiPermintaan";

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") ? true : false;
  };

  const getUserRole = () => {
    return localStorage.getItem("userRole");
  };

  const PrivateRoute = ({ children, roles }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    if (roles && !roles.includes(getUserRole())) {
      return <Navigate to="/forbidden" replace />; // Atau ke halaman default role mereka
    }
    return children;
  };

  return (
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
                <AdminDashboard />
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

        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* <Route path="*" element={<div>404 Not Found</div>} /> 
        <Route path="/forbidden" element={<div>Akses Ditolak! Anda tidak memiliki izin untuk halaman ini.</div>} /> */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
