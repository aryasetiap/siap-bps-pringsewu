import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Menggunakan useNavigate untuk navigasi

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Inisialisasi hook useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulasi penundaan jaringan
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Tunda 1 detik

    // Logika simulasi autentikasi
    if (username === "admin" && password === "admin123") {
      // Contoh kredensial admin
      localStorage.setItem("authToken", "fake-admin-token"); // Simpan token palsu
      localStorage.setItem("userRole", "admin"); // Simpan role admin
      navigate("/admin/dashboard"); // Arahkan ke dashboard admin
    } else if (username === "pegawai" && password === "pegawai123") {
      // Contoh kredensial pegawai
      localStorage.setItem("authToken", "fake-pegawai-token"); // Simpan token palsu
      localStorage.setItem("userRole", "pegawai"); // Simpan role pegawai
      navigate("/pegawai/permintaan"); // Arahkan ke halaman permintaan pegawai
    } else {
      setError("Username atau password salah. Silakan coba lagi."); // Pesan error jika kredensial tidak cocok
    }

    setLoading(false); // Selesai loading
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login SIAP BPS Pringsewu
        </h2>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
