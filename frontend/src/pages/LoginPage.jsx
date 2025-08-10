import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as authService from "../services/authService";
import {
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

function LoginPage() {
  // State untuk form input dan validasi
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  // Cek jika user sudah login saat komponen mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      // Redirect ke halaman yang sesuai berdasarkan role
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "pegawai") {
        navigate("/pegawai/permintaan");
      }
    }
  }, [navigate]);

  // Handler untuk perubahan input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error ketika user mengubah input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Reset general error ketika user mengubah input
    if (generalError) {
      setGeneralError("");
    }
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler untuk form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const res = await authService.login(formData);

      // Simpan data di localStorage
      localStorage.setItem("authToken", res.data.access_token);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("userRole", res.data.user.role);

      // Tampilkan notifikasi sukses
      toast.success(
        `Selamat datang, ${res.data.user.nama || res.data.user.username}!`
      );

      // Redirect sesuai role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "pegawai") {
        navigate("/pegawai/permintaan");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Error handling yang detail
      console.error("Login error:", err);

      if (err.response) {
        // Error dari response server
        const status = err.response.status;
        const message = err.response.data?.message;

        switch (status) {
          case 401:
            setGeneralError("Username atau password salah");
            break;
          case 403:
            setGeneralError("Akun Anda tidak aktif. Hubungi administrator");
            break;
          case 429:
            setGeneralError("Terlalu banyak percobaan login. Coba lagi nanti");
            break;
          case 500:
            setGeneralError("Terjadi kesalahan pada server");
            break;
          default:
            setGeneralError(message || "Login gagal. Silakan coba lagi");
        }
      } else if (err.request) {
        // Tidak ada response dari server
        setGeneralError(
          "Tidak dapat terhubung ke server. Periksa koneksi Anda"
        );
      } else {
        // Error lainnya
        setGeneralError("Terjadi kesalahan. Silakan coba lagi");
      }

      // Tampilkan error di toast juga
      toast.error(generalError || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Background and Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-white justify-center items-center">
        <div className="max-w-md">
          <div className="mb-12 text-center">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
              <svg
                className="w-16 h-16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8.5 8.5H8.51M8.5 12H8.51M8.5 15.5H8.51M12 8.5H12.01M12 12H12.01M12 15.5H12.01M15.5 8.5H15.51M15.5 12H15.51M15.5 15.5H15.51"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-3">SIAP</h1>
            <p className="text-xl text-blue-100">
              Sistem Aplikasi Pengelolaan Aset & Persediaan
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  Manajemen Barang Efisien
                </h3>
                <p className="text-blue-100 text-sm">
                  Lacak dan kelola persediaan dengan mudah
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Pengajuan Digital</h3>
                <p className="text-blue-100 text-sm">
                  Prosedur permintaan barang yang transparan
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Laporan Real-time</h3>
                <p className="text-blue-100 text-sm">
                  Data dan statistik dalam satu tampilan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mb-5 flex justify-center md:hidden">
              <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8.5 8.5H8.51M8.5 12H8.51M8.5 15.5H8.51M12 8.5H12.01M12 12H12.01M12 15.5H12.01M15.5 8.5H15.51M15.5 12H15.51M15.5 15.5H15.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Silahkan masuk dengan akun yang diberikan oleh admin
            </p>
          </div>

          {/* Error Message */}
          {generalError && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm animate-fadeIn">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-3 block w-full rounded-xl border ${
                    errors.username
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } shadow-sm transition duration-150`}
                  placeholder="Masukkan username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-3 block w-full rounded-xl border ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } shadow-sm transition duration-150`}
                  placeholder="Masukkan password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sedang Masuk...
                  </>
                ) : (
                  <>
                    Masuk
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>BPS Kabupaten Pringsewu</p>
              <p className="mt-1">
                © {new Date().getFullYear()} Sistem Aplikasi Pengelolaan Aset &
                Persediaan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
