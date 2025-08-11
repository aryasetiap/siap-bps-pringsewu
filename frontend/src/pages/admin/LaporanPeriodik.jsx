/**
 * File ini merupakan halaman Laporan Periodik Penggunaan Barang pada aplikasi SIAP.
 * Digunakan untuk menampilkan laporan penggunaan barang berdasarkan rentang tanggal dan unit kerja.
 * Fitur utama: filter data, ekspor PDF, dan menampilkan tabel laporan.
 */

import React, { useState } from "react";
import { toast } from "react-toastify";
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
      const res = await getLaporanPenggunaanPDF(queryParams);

      // Membuat link download file PDF
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Penggunaan_${startDate}_${endDate}${
          unitKerja ? "_" + unitKerja.replace(/\s+/g, "_") : ""
        }.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Gagal mengunduh PDF.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Laporan Periodik Penggunaan Barang
      </h1>
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
      <LaporanTable data={data} loading={loading} />
    </div>
  );
};

export default LaporanPeriodik;
