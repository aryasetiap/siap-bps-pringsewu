/**
 * File CetakBuktiPermintaan.jsx
 *
 * Halaman ini digunakan untuk menampilkan dan mengunduh bukti permintaan barang pada aplikasi SIAP.
 * Fitur utama: menampilkan detail permintaan, mengunduh bukti permintaan dalam format PDF, dan mencetak halaman.
 *
 * Konteks bisnis: Digunakan oleh admin untuk verifikasi dan dokumentasi permintaan barang.
 */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as permintaanService from "../../services/permintaanService";
import BuktiPermintaanPreview from "../../components/permintaan/BuktiPermintaanPreview";
import { toast } from "react-toastify";
import {
  DocumentIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

/**
 * Komponen utama untuk halaman Cetak Bukti Permintaan.
 *
 * Menampilkan detail permintaan barang, tombol unduh PDF, dan tombol print.
 *
 * Parameter: Tidak menerima parameter langsung, menggunakan useParams untuk mengambil id permintaan.
 *
 * Return:
 * - JSX: Tampilan halaman cetak bukti permintaan.
 */
const CetakBuktiPermintaan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk menyimpan data permintaan, status loading, error, dan loading PDF
  const [permintaan, setPermintaan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  /**
   * Fungsi untuk memformat status permintaan agar lebih mudah dipahami oleh admin.
   *
   * Parameter:
   * - status (string): Status asli dari permintaan barang.
   *
   * Return:
   * - string: Status yang sudah diformat untuk tampilan.
   */
  const formatStatus = (status) => {
    if (!status) return "Menunggu";
    switch (status.toLowerCase()) {
      case "setuju":
        return "Disetujui";
      case "sebagian":
        return "Disetujui Sebagian";
      case "tolak":
        return "Ditolak";
      default:
        // Jika status tidak dikenali, tampilkan dengan huruf kapital di awal
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  /**
   * Fungsi untuk mengambil detail permintaan barang berdasarkan id.
   * Data yang diambil akan ditransformasi agar sesuai dengan kebutuhan tampilan.
   *
   * Parameter: Tidak ada (menggunakan id dari useParams)
   *
   * Return: Tidak ada (mengubah state permintaan, loading, dan error)
   */
  const fetchPermintaan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permintaanService.getPermintaanById(id);

      // Transformasi data permintaan agar sesuai dengan kebutuhan preview
      const transformedData = {
        ...response.data,
        nomorPermintaan:
          response.data.nomor_permintaan || `#${response.data.id}`,
        tanggalPermintaan: response.data.tanggal_permintaan,
        pemohon: response.data.pemohon,
        status: formatStatus(response.data.status),
        catatan: response.data.catatan_admin,
        items:
          response.data.items?.map((item) => ({
            id: item.id,
            namaBarang: item.barang?.nama_barang || "Barang tidak diketahui",
            jumlahDiminta: item.jumlah_diminta,
            jumlahDisetujui: item.jumlah_disetujui,
            satuan: item.barang?.satuan || "Pcs",
          })) || [],
      };

      setPermintaan(transformedData);
    } catch (err) {
      // Tambahkan penanganan khusus untuk 404
      if (err.response?.status === 404) {
        setPermintaan(null);
        setError(null);
      } else {
        // Error handling jika gagal mengambil data permintaan
        console.error("Error fetching permintaan:", err);
        setError(
          "Gagal memuat detail permintaan. " +
            (err.response?.data?.message || err.message)
        );
        toast.error("Gagal memuat detail permintaan.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Ambil data permintaan saat komponen pertama kali dirender atau id berubah
  useEffect(() => {
    fetchPermintaan();
  }, [fetchPermintaan]);

  /**
   * Fungsi untuk mengunduh bukti permintaan dalam format PDF dari API.
   *
   * Parameter: Tidak ada (menggunakan id dari useParams dan data permintaan dari state)
   *
   * Return: Tidak ada (mengubah state pdfLoading dan memicu download file)
   */
  const handleCetakPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await permintaanService.getPermintaanPDF(id);

      // Membuat URL objek untuk file PDF yang diterima dari API
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Membuat elemen link untuk memicu download file PDF
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Bukti_Permintaan_${permintaan?.nomorPermintaan || id}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      document.body.appendChild(link);
      link.click();

      // Membersihkan URL objek setelah download selesai
      window.URL.revokeObjectURL(url);
      link.remove();

      toast.success("PDF berhasil diunduh");
    } catch (err) {
      // Error handling jika gagal mengunduh PDF
      console.error("Error downloading PDF:", err);
      toast.error(
        "Gagal mengunduh PDF. " + (err.response?.data?.message || err.message)
      );
    } finally {
      setPdfLoading(false);
    }
  };

  /**
   * Fungsi untuk kembali ke halaman sebelumnya.
   *
   * Parameter: Tidak ada
   *
   * Return: Tidak ada (navigasi ke halaman sebelumnya)
   */
  const handleBack = () => {
    navigate(-1);
  };

  // Render UI sesuai dengan status loading, error, dan data permintaan
  return (
    <div className="p-6 space-y-6">
      {/* Header halaman */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-md">
              <DocumentIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cetak Bukti Permintaan
              </h1>
              <p className="text-gray-600 mt-1">
                Lihat dan unduh bukti permintaan barang dalam format PDF.
              </p>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali
          </button>
        </div>
      </div>

      {/* State loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data permintaan...</p>
        </div>
      ) : error ? (
        // State error
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">{error}</p>
          <button
            onClick={fetchPermintaan}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Coba Lagi
          </button>
        </div>
      ) : permintaan ? (
        // State data permintaan berhasil diambil
        <div className="space-y-6">
          {/* Preview Bukti Permintaan */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden print-area">
            <BuktiPermintaanPreview permintaan={permintaan} />
          </div>

          {/* Tombol aksi: Unduh PDF dan Print */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 no-print">
            <button
              onClick={handleCetakPDF}
              disabled={pdfLoading}
              className={`flex-1 sm:max-w-xs flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition ${
                pdfLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "transform hover:-translate-y-0.5"
              }`}
            >
              {pdfLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                  Mengunduh PDF...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  Unduh PDF
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 sm:max-w-xs flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition transform hover:-translate-y-0.5"
            >
              <PrinterIcon className="w-5 h-5 mr-2" />
              Print Halaman
            </button>
          </div>
        </div>
      ) : (
        // State jika data permintaan tidak ditemukan
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Data permintaan tidak ditemukan
          </h3>
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Kembali
          </button>
        </div>
      )}
    </div>
  );
};

export default CetakBuktiPermintaan;
