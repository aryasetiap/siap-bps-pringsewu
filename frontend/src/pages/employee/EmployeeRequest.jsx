import React from "react";
import { Link } from "react-router-dom";

function EmployeeRequestPage() {
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Hapus token
    localStorage.removeItem("userRole"); // Hapus role
    window.location.href = "/login"; // Redirect ke login
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Halaman Permintaan Barang, Pegawai!
      </h1>
      <p>Di sini Anda bisa mengajukan permintaan barang.</p>
      <div className="mt-4 space-x-4">
        <Link to="/pegawai/riwayat" className="text-blue-600 hover:underline">
          Riwayat Permintaan
        </Link>
        <button onClick={handleLogout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}

export default EmployeeRequestPage;
