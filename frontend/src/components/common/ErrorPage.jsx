import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

const ErrorPage = ({
  code,
  title,
  message,
  icon: Icon,
  iconColor,
  iconBgColor,
  children,
}) => {
  const navigate = useNavigate();

  // Fungsi untuk mendapatkan halaman home berdasarkan role
  const getHomePage = () => {
    const userRole = localStorage.getItem("userRole");
    const isAuthenticated = localStorage.getItem("authToken");

    if (!isAuthenticated) return "/login";
    return userRole === "admin" ? "/admin/dashboard" : "/pegawai/permintaan";
  };

  // Fungsi untuk kembali ke halaman sebelumnya
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
        {/* Header gradien dengan logo */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
          <div
            className={`${iconBgColor} rounded-full p-5 w-24 h-24 mx-auto mb-4 shadow-lg flex items-center justify-center`}
          >
            <Icon className={`h-14 w-14 ${iconColor}`} />
          </div>
          <h1 className="text-5xl font-extrabold mb-2">{code}</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {title}
          </h2>
          <p className="text-gray-600 text-center mb-8">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Kembali
            </button>

            <Link
              to={getHomePage()}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-colors"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Ke Beranda
            </Link>

            {children}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>BPS Kabupaten Pringsewu</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Sistem Aplikasi Pengelolaan Aset &
              Persediaan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
