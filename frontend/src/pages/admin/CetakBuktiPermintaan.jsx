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
} from "@heroicons/react/24/outline";

const CetakBuktiPermintaan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [permintaan, setPermintaan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Use useCallback to memoize the fetchPermintaan function
  const fetchPermintaan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permintaanService.getPermintaanById(id);

      // Transformasi data jika perlu
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
      console.error("Error fetching permintaan:", err);
      setError(
        "Gagal memuat detail permintaan. " +
          (err.response?.data?.message || err.message)
      );
      toast.error("Gagal memuat detail permintaan.");
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id as a dependency

  useEffect(() => {
    fetchPermintaan();
  }, [fetchPermintaan]); // Now include fetchPermintaan in the dependency array

  // Format status untuk tampilan yang lebih baik
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
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Fungsi untuk mengunduh PDF dari API
  const handleCetakPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await permintaanService.getPermintaanPDF(id);

      // Buat URL untuk download
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Buat element link untuk download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Bukti_Permintaan_${id}_${new Date().toISOString().split("T")[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();

      toast.success("PDF berhasil diunduh");
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast.error(
        "Gagal mengunduh PDF. " + (err.response?.data?.message || err.message)
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // Fungsi kembali ke halaman sebelumnya
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DocumentIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Cetak Bukti Permintaan
          </h1>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Kembali
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data permintaan...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">{error}</p>
          <button
            onClick={fetchPermintaan}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Coba Lagi
          </button>
        </div>
      ) : permintaan ? (
        <div className="space-y-6">
          {/* Preview Bukti Permintaan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Bukti Permintaan Barang
              </h2>
            </div>
            <div className="p-6">
              <BuktiPermintaanPreview permintaan={permintaan} />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCetakPDF}
              disabled={pdfLoading}
              className={`flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 transition ${
                pdfLoading ? "opacity-70 cursor-not-allowed" : ""
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
                  <DocumentIcon className="w-5 h-5 mr-2" />
                  Cetak PDF
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Data permintaan tidak ditemukan
          </h3>
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
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
