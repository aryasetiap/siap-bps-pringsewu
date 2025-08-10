import axios from "axios";
import { toast } from "react-toastify";

// Buat axios instance dengan baseURL yang sesuai
const api = axios.create({
  baseURL: "/api", // proxy ke http://localhost:3001/api
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: tambahkan token ke header
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

// Response interceptor: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration atau unauthorized
    if (error.response) {
      if (
        error.response.status === 401 &&
        window.location.pathname !== "/login"
      ) {
        // Clear local storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");

        // Notify user
        toast.error("Sesi login telah berakhir, silakan login kembali");

        // Redirect ke halaman login
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        toast.error("Anda tidak memiliki akses ke resource ini");

        // Optional: redirect ke Forbidden page
        if (window.location.pathname !== "/forbidden") {
          window.location.href = "/forbidden";
        }
      } else if (error.response.status === 500) {
        toast.error("Terjadi kesalahan pada server");
      }
    } else if (error.request) {
      // Request dilakukan tapi tidak ada response
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi Anda");
    } else {
      // Error lainnya
      toast.error("Terjadi kesalahan saat memproses permintaan");
    }

    return Promise.reject(error);
  }
);

export default api;
