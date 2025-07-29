import React from "react";
const Forbidden = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-4xl font-bold mb-2 text-yellow-600">403</h1>
    <p className="text-lg text-gray-700 mb-4">
      Akses ditolak! Anda tidak memiliki izin untuk halaman ini.
    </p>
    <a href="/" className="text-blue-600 hover:underline">
      Kembali ke Beranda
    </a>
  </div>
);
export default Forbidden;
