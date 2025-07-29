import React from "react";
const Error404 = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-4xl font-bold mb-2 text-red-600">404</h1>
    <p className="text-lg text-gray-700 mb-4">Halaman tidak ditemukan.</p>
    <a href="/" className="text-blue-600 hover:underline">
      Kembali ke Beranda
    </a>
  </div>
);
export default Error404;
