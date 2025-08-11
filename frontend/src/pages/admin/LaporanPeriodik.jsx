/**
 * File ini merupakan halaman Laporan Periodik Penggunaan Barang pada aplikasi SIAP.
 * Digunakan untuk menampilkan laporan penggunaan barang berdasarkan rentang tanggal dan unit kerja.
 * Fitur utama: filter data, ekspor PDF, dan menampilkan tabel laporan.
 */

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  DocumentChartBarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  getLaporanPenggunaanJSON,
  getLaporanPenggunaanPDF,
} from "../../services/barangService";
import LaporanFilterForm from "../../components/laporan/LaporanFilterForm";
import LaporanTable from "../../components/laporan/LaporanTable";

/**
 * Komponen utama untuk halaman laporan periodik penggunaan barang.
 * Mengelola state filter, data laporan, dan loading.
 *
 * Return:
 * - JSX: Tampilan halaman laporan periodik
 */
const LaporanPeriodik = () => {
  // State untuk filter tanggal mulai, tanggal akhir, dan unit kerja
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  // State untuk data hasil filter dan status loading
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fungsi untuk membangun query parameter dari filter yang dipilih.
   *
   * Parameter:
   * - startDate (string): Tanggal mulai
   * - endDate (string): Tanggal akhir
   * - unitKerja (string): Nama unit kerja
   *
   * Return:
   * - URLSearchParams: Query parameter untuk request API
   */
  const buildQueryParams = (startDate, endDate, unitKerja) => {
    const queryParams = new URLSearchParams();
    queryParams.append("start", startDate);
    queryParams.append("end", endDate);
    if (unitKerja) {
      queryParams.append("unit_kerja", unitKerja);
    }
    return queryParams;
  };

  /**
   * Fungsi untuk memproses filter dan mengambil data laporan penggunaan barang.
   * Menampilkan notifikasi jika filter belum lengkap atau data kosong.
   *
   * Return:
   * - void
   */
  const handleFilter = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih rentang tanggal!");
      return;
    }

    setLoading(true);
    try {
      const queryParams = buildQueryParams(startDate, endDate, unitKerja);
      const response = await getLaporanPenggunaanJSON(queryParams);
      setData(response.data);
      setLastUpdated(new Date());

      // Notifikasi jika data kosong
      if (response.data.length === 0) {
        toast.info("Tidak ada data dalam rentang tanggal tersebut");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mengekspor laporan penggunaan barang dalam format PDF.
   * File PDF akan diunduh otomatis dengan nama sesuai filter.
   *
   * Return:
   * - void
   */
  const handleExportPDF = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih rentang tanggal!");
      return;
    }

    try {
      const queryParams = buildQueryParams(startDate, endDate, unitKerja);

      // Add loading indicator
      toast.info("Sedang mengunduh PDF...", {
        autoClose: false,
        toastId: "pdf-loading",
      });

      const res = await getLaporanPenggunaanPDF(queryParams);

      // Dismiss loading toast
      toast.dismiss("pdf-loading");

      // Check if response is valid - ensure proper blob type and size
      if (!res.data || !(res.data instanceof Blob)) {
        throw new Error("PDF data tidak valid");
      }

      // If the blob is empty or too small, it might be an error response
      if (res.data.size < 100) {
        // Try to read the blob as text to check for error messages
        const text = await res.data.text();
        if (text && (text.includes("error") || text.includes("tidak"))) {
          throw new Error(text || "PDF data tidak valid");
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Penggunaan_${startDate}_${endDate}${
          unitKerja ? "_" + unitKerja.replace(/\s+/g, "_") : ""
        }.pdf`
      );
      document.body.appendChild(link);

      // For IDM compatibility, add a small delay
      setTimeout(() => {
        link.click();

        // Add a flag to detect if download manager is being used
        let downloadIntercepted = false;
        setTimeout(() => {
          // If URL wasn't revoked, assume download manager took over
          try {
            // Try to access the URL - if it's still valid, a download manager likely intercepted it
            const testAccess = new XMLHttpRequest();
            testAccess.open("HEAD", url, false);
            testAccess.send();
            if (testAccess.status === 200) {
              downloadIntercepted = true;
            }
          } catch (e) {
            // Error means URL was properly revoked, normal browser download happened
          }

          // Always show success if we got this far
          toast.success(
            downloadIntercepted
              ? "PDF diunduh oleh download manager"
              : "PDF berhasil diunduh"
          );

          // Clean up
          window.URL.revokeObjectURL(url);
          link.remove();
        }, 500);
      }, 100);
    } catch (err) {
      console.error("PDF download error:", err);
      toast.dismiss("pdf-loading");
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Gagal mengunduh PDF. Silakan coba lagi."
      );
    }
  };

  /**
   * Fungsi untuk memformat tanggal menjadi format yang lebih mudah dibaca
   *
   * @param {Date} date - Objek tanggal
   * @return {string} - Tanggal dalam format DD/MM/YYYY HH:MM
   */
  const formatDateTime = (date) => {
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fadeIn">
      {/* Header dengan icon dan judul */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-md">
            <DocumentChartBarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Laporan Periodik Penggunaan Barang
            </h1>
            <p className="text-gray-600 mt-1">
              Buat dan ekspor laporan penggunaan barang berdasarkan periode
              waktu
            </p>
          </div>
        </div>
        {lastUpdated && (
          <div className="text-sm text-gray-500">
            Terakhir diperbarui: {formatDateTime(lastUpdated)}
          </div>
        )}
      </div>

      {/* Form filter laporan periodik */}
      <LaporanFilterForm
        startDate={startDate}
        endDate={endDate}
        unitKerja={unitKerja}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setUnitKerja={setUnitKerja}
        onFilter={handleFilter}
        onExportPDF={handleExportPDF}
        loading={loading}
      />

      {/* Tabel hasil laporan penggunaan barang */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {data.length > 0 ? (
              <>
                Hasil Laporan Penggunaan Barang
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({data.length} item)
                </span>
              </>
            ) : lastUpdated ? (
              "Tidak ada data penggunaan barang"
            ) : (
              "Pilih periode untuk melihat data"
            )}
          </h2>
          {data.length > 0 && (
            <button
              onClick={handleFilter}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh
            </button>
          )}
        </div>
        <LaporanTable data={data} loading={loading} />
      </div>
    </div>
  );
};

export default LaporanPeriodik;
