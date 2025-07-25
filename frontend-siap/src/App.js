import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeRequestPage from "./pages/employee/EmployeeRequest";
import DashboardLayout from "./components/DashboardLayout";

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

        {/* <Route
        <Route
          path="/admin/barang"
          element={
            <PrivateRoute roles={['admin']}>
              <div>Halaman Manajemen Barang (Admin)</div>
            </PrivateRoute>
          }
        />
         <Route
          path="/admin/pengguna"
          element={
            <PrivateRoute roles={['admin']}>
              <div>Halaman Manajemen Pengguna (Admin)</div>
            </PrivateRoute>
          }
        />  */}

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
        {/* <Route
        <Route
          path="/pegawai/riwayat"
          element={
            <PrivateRoute roles={['pegawai']}>
              <div>Halaman Riwayat Permintaan (Pegawai)</div> 
            </PrivateRoute>
          }
        /> */}

        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* <Route path="*" element={<div>404 Not Found</div>} /> 
        <Route path="/forbidden" element={<div>Akses Ditolak! Anda tidak memiliki izin untuk halaman ini.</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
