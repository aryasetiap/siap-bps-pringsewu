import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Hapus token
    localStorage.removeItem("userRole"); // Hapus role
    window.location.href = "/login"; // Redirect ke login
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Selamat Datang, Admin!</h1>
      <p>Ini adalah Dashboard Admin.</p>
      <div className="mt-4 space-x-4">
        <Link to="/admin/barang" className="text-blue-600 hover:underline">
          Manajemen Barang
        </Link>
        <Link to="/admin/pengguna" className="text-blue-600 hover:underline">
          Manajemen Pengguna
        </Link>
        <button onClick={handleLogout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
