import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldExclamationIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ErrorPage from "../components/common/ErrorPage";

const Forbidden = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken");

  // Fungsi untuk logout
  const handleLogout = () => {
    // Hapus semua data autentikasi
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    // Redirect ke login
    navigate("/login");
  };

  return (
    <ErrorPage
      code="403"
      title="Akses Ditolak"
      message="Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali atau masuk dengan akun yang memiliki akses."
      icon={ShieldExclamationIcon}
      iconColor="text-white"
      iconBgColor="bg-yellow-500"
    >
      {/* Tampilkan tombol logout hanya jika user terautentikasi */}
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      )}
    </ErrorPage>
  );
};

export default Forbidden;
