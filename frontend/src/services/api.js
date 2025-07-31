import axios from "axios";

// Ganti baseURL sesuai environment (bisa pakai .env)
const api = axios.create({
  baseURL: "/api", // proxy ke http://localhost:3001/api
  timeout: 15000,
});

// Interceptor: Tambahkan Authorization header jika ada token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// // Interceptor: Global error handling (contoh: token expired)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Jika 401/403, redirect ke login atau tampilkan notifikasi
//       if (error.response.status === 401 || error.response.status === 403) {
//         localStorage.removeItem("authToken"); // tambahkan baris ini
//         localStorage.removeItem("token"); // opsional, jika pernah pakai key ini
//         localStorage.removeItem("userRole");
//         localStorage.removeItem("username");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
