/**
 * ============================================================
 * File: LaporanPeriodik.jsx
 * Halaman Laporan Periodik Penggunaan Barang - SIAP BPS Pringsewu
 *
 * Deskripsi:
 * Halaman ini digunakan untuk menampilkan laporan penggunaan barang
 * berdasarkan rentang tanggal dan unit kerja. Fitur utama meliputi:
 * - Filter data laporan
 * - Ekspor laporan ke PDF
 * - Tabel hasil laporan
 *
 * Konteks bisnis:
 * Digunakan oleh admin untuk monitoring penggunaan barang, permintaan,
 * dan verifikasi pada aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * ============================================================
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
 * Fungsi utilitas untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD.
 *
 * Return:
 * - string: Tanggal hari ini (YYYY-MM-DD)
 */
const getToday = () => new Date().toISOString().split("T")[0];

/**
 * Fungsi utilitas untuk mendapatkan tanggal satu bulan yang lalu dari hari ini.
 *
 * Return:
 * - string: Tanggal satu bulan lalu (YYYY-MM-DD)
 */
const getOneMonthAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
};

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
 * Fungsi untuk memformat tanggal menjadi format yang mudah dibaca.
 *
 * Parameter:
 * - date (Date): Objek tanggal
 *
 * Return:
 * - string: Tanggal dalam format DD/MM/YYYY HH:MM
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

/**
 * Komponen utama halaman laporan periodik penggunaan barang.
 * Mengelola state filter, data laporan, dan status loading.
 *
 * Return:
 * - JSX: Tampilan halaman laporan periodik
 */
const LaporanPeriodik = () => {
  // State untuk filter tanggal mulai, tanggal akhir, dan unit kerja
  const [startDate, setStartDate] = useState(getOneMonthAgo());
  const [endDate, setEndDate] = useState(getToday());
  const [unitKerja, setUnitKerja] = useState("");
  // State untuk data hasil filter dan status loading
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

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

      // Tampilkan indikator loading pada toast
      toast.info("Sedang mengunduh PDF...", {
        autoClose: false,
        toastId: "pdf-loading",
      });

      const res = await getLaporanPenggunaanPDF(queryParams);

      // Hilangkan loading toast
      toast.dismiss("pdf-loading");

      // Validasi response blob PDF
      if (!res.data || !(res.data instanceof Blob)) {
        throw new Error("PDF data tidak valid");
      }

      // Jika blob terlalu kecil, kemungkinan error response
      if (res.data.size < 100) {
        const text = await res.data.text();
        if (text && (text.includes("error") || text.includes("tidak"))) {
          throw new Error(text || "PDF data tidak valid");
        }
      }

      // Proses download PDF
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

      // Kompatibilitas dengan IDM (Internet Download Manager)
      setTimeout(() => {
        link.click();

        // Deteksi jika download manager mengintersep download
        let downloadIntercepted = false;
        setTimeout(() => {
          try {
            const testAccess = new XMLHttpRequest();
            testAccess.open("HEAD", url, false);
            testAccess.send();
            if (testAccess.status === 200) {
              downloadIntercepted = true;
            }
          } catch (e) {
            // Jika error, berarti URL sudah direvoke (download normal)
          }

          toast.success(
            downloadIntercepted
              ? "PDF diunduh oleh download manager"
              : "PDF berhasil diunduh"
          );

          // Bersihkan resource
          window.URL.revokeObjectURL(url);
          link.remove();
        }, 500);
      }, 100);
    } catch (err) {
      console.error("PDF download error:", err);
      toast.dismiss("pdf-loading");
      let errorMsg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message ||
            err.message ||
            "Gagal mengunduh PDF. Silakan coba lagi.";
      toast.error(errorMsg);
    }
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
