import axios from "axios";
import { toast } from "react-toastify";

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: "/api", // Sesuaikan dengan base URL API Anda
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handling global error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Persiapkan default error message
    let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

    // Cek jika ada response dari server
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request - Validasi Error
          errorMessage =
            data?.message || "Data tidak valid. Periksa kembali input Anda.";
          break;

        case 401:
          // Unauthorized - Token invalid atau expired
          errorMessage = "Sesi login telah berakhir. Silakan login kembali.";

          // Clear authentication data
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("username");

          // Redirect ke halaman login jika bukan di halaman login
          if (window.location.pathname !== "/login") {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
          break;

        case 403:
          // Forbidden - Tidak punya akses
          errorMessage = "Anda tidak memiliki akses untuk operasi ini.";

          // Redirect ke halaman forbidden jika bukan di halaman forbidden
          if (window.location.pathname !== "/forbidden") {
            setTimeout(() => {
              window.location.href = "/forbidden";
            }, 1500);
          }
          break;

        case 404:
          // Not Found
          errorMessage = "Data tidak ditemukan.";
          break;

        case 422:
          // Unprocessable Entity - Validasi Error
          errorMessage =
            data?.message || "Data tidak valid. Periksa kembali input Anda.";
          break;

        case 429:
          // Too Many Requests
          errorMessage = "Terlalu banyak permintaan. Coba lagi nanti.";
          break;

        case 500:
          // Server Error
          errorMessage =
            "Terjadi kesalahan pada server. Silakan hubungi administrator.";
          break;

        default:
          errorMessage = data?.message || errorMessage;
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respon (network issue)
      errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
    }

    // Tampilkan toast notification untuk error
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default api;
