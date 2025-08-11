/**
 * Halaman EmployeeHistory.jsx
 *
 * Halaman ini digunakan untuk menampilkan riwayat permintaan barang oleh pegawai pada aplikasi SIAP.
 * Fitur utama meliputi pencarian, filter status, pagination, dan detail permintaan.
 *
 * Komponen utama:
 * - EmployeeHistory: Komponen utama halaman riwayat permintaan.
 * - EmployeeRequestHistoryTable: Tabel daftar permintaan.
 * - EmployeeRequestDetailModal: Modal detail permintaan.
 *
 * Konteks bisnis: Pengelolaan permintaan barang, verifikasi, dan dokumentasi permintaan.
 */

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  ClockIcon,
  DocumentTextIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import * as permintaanService from "../../services/permintaanService";
import EmployeeRequestHistoryTable from "../../components/employee/EmployeeRequestHistoryTable";
import EmployeeRequestDetailModal from "../../components/employee/EmployeeRequestDetailModal";

// Opsi status permintaan barang
const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Disetujui", label: "Disetujui" },
  { value: "Disetujui Sebagian", label: "Disetujui Sebagian" },
  { value: "Ditolak", label: "Ditolak" },
];

/**
 * Komponen utama untuk halaman riwayat permintaan barang pegawai.
 *
 * Fitur:
 * - Menampilkan daftar permintaan barang.
 * - Filter berdasarkan status dan pencarian barang/nomor.
 * - Pagination dan pengaturan jumlah data per halaman.
 * - Melihat detail permintaan dan mengunduh PDF permintaan.
 *
 * Return:
 * - JSX: Tampilan halaman riwayat permintaan barang.
 */
const EmployeeHistory = () => {
  // State utama untuk pengelolaan data permintaan dan UI
  const [permintaan, setPermintaan] = useState([]); // Data permintaan dari API
  const [filtered, setFiltered] = useState([]); // Data permintaan setelah filter/pencarian
  const [searchTerm, setSearchTerm] = useState(""); // Kata kunci pencarian
  const [filterStatus, setFilterStatus] = useState(""); // Status filter
  const [loading, setLoading] = useState(false); // Status loading data
  const [selected, setSelected] = useState(null); // Permintaan yang dipilih untuk detail
  const [showDetail, setShowDetail] = useState(false); // Status modal detail
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(1); // Total halaman
  const [limit, setLimit] = useState(10); // Jumlah data per halaman
  const [pdfLoading, setPdfLoading] = useState(false); // Status loading PDF

  /**
   * Mengambil data riwayat permintaan barang dari backend.
   *
   * Parameter:
   * - page (number): Nomor halaman yang ingin diambil.
   *
   * Return:
   * - void: Mengupdate state permintaan, filtered, dan pagination.
   */
  const fetchData = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        // Ambil data riwayat permintaan dari backend dengan filter dan pagination
        const res = await permintaanService.getRiwayatPermintaan({
          page,
          limit,
          status: filterStatus || undefined,
          search: searchTerm || undefined,
        });

        // Mapping data API ke format yang dibutuhkan komponen
        const mappedData = res.data.map((item) => ({
          id: item.id,
          nomorPermintaan: item.nomor_permintaan || `#${item.id}`,
          tanggalPermintaan: item.tanggal_permintaan,
          status: item.status || "Menunggu",
          items: Array.isArray(item.details)
            ? item.details.map((d) => ({
                id: d.id,
                namaBarang: d.barang?.nama_barang || "-",
                kodeBarang: d.barang?.kode_barang || "-",
                satuan: d.barang?.satuan || "-",
                jumlahDiminta: d.jumlah_diminta || 0,
                jumlahDisetujui: d.jumlah_disetujui || 0,
              }))
            : [],
          catatan: item.catatan || "-",
          catatanAdmin: item.catatan_admin || "-",
          tanggalVerifikasi: item.tanggal_verifikasi || null,
        }));

        setPermintaan(mappedData);
        setFiltered(mappedData);

        // Update total halaman jika API mendukung pagination
        if (res.meta && res.meta.totalPages) {
          setTotalPages(res.meta.totalPages);
        } else {
          // Fallback jika backend tidak support pagination
          setTotalPages(Math.ceil(mappedData.length / limit));
        }

        setCurrentPage(page);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Gagal memuat riwayat permintaan";
        toast.error(errorMessage);
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterStatus, searchTerm, limit]
  );

  // Load data pertama kali dan setiap kali filter/pagination berubah
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  /**
   * Melakukan filter dan pencarian pada data permintaan.
   *
   * Parameter:
   * - Tidak ada (menggunakan state permintaan, searchTerm, filterStatus)
   *
   * Return:
   * - void: Mengupdate state filtered.
   */
  useEffect(() => {
    let data = permintaan;
    if (searchTerm) {
      data = data.filter(
        (p) =>
          p.nomorPermintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.items.some((i) =>
            i.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (filterStatus) {
      data = data.filter((p) => p.status === filterStatus);
    }
    setFiltered(data);
  }, [searchTerm, filterStatus, permintaan]);

  /**
   * Memformat tanggal ke format Indonesia.
   *
   * Parameter:
   * - dateString (string): Tanggal dalam format ISO atau string.
   *
   * Return:
   * - string: Tanggal yang sudah diformat, atau "-" jika tidak valid.
   */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  /**
   * Mendapatkan warna status permintaan untuk badge.
   *
   * Parameter:
   * - status (string): Status permintaan barang.
   *
   * Return:
   * - string: Kelas warna Tailwind CSS.
   */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "disetujui":
        return "bg-green-100 text-green-800";
      case "disetujui sebagian":
        return "bg-blue-100 text-blue-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Handler untuk memuat ulang data permintaan.
   *
   * Return:
   * - void: Memanggil fetchData dengan halaman saat ini.
   */
  const handleRefresh = () => {
    fetchData(currentPage);
  };

  /**
   * Handler untuk mengubah halaman pada pagination.
   *
   * Parameter:
   * - page (number): Nomor halaman yang ingin ditampilkan.
   *
   * Return:
   * - void: Memanggil fetchData dengan halaman baru.
   */
  const handlePageChange = (page) => {
    fetchData(page);
  };

  /**
   * Handler untuk mengunduh PDF permintaan barang.
   *
   * Parameter:
   * - id (number): ID permintaan barang.
   *
   * Return:
   * - void: Membuka PDF di tab baru dan menampilkan notifikasi.
   */
  const handleDownloadPDF = async (id) => {
    setPdfLoading(id);
    try {
      const response = await permintaanService.getPermintaanPDF(id);

      // Membuat blob URL dari response PDF
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Membuka PDF di tab baru
      const pdfWindow = window.open();
      pdfWindow.location.href = fileURL;

      toast.success("PDF berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh PDF");
      console.error("Error downloading PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  // Render utama halaman
  return (
    <div className="p-6">
      {/* Header Section dengan ikon dan jumlah permintaan */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Riwayat Permintaan
            </h1>
            <p className="text-gray-600 mt-1">
              Lihat status dan detail permintaan barang yang pernah Anda ajukan.
              {filtered.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {filtered.length} Permintaan
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Panel Filter dan Kontrol */}
      <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Input Pencarian */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nomor atau nama barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all text-sm"
            />
          </div>

          {/* Filter Status Permintaan */}
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pengaturan Jumlah Data per Halaman */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Tampilkan:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                fetchData(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Tombol Refresh Data */}
          <button
            onClick={handleRefresh}
            className="ml-auto flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Konten Utama: Loading, Kosong, atau Tabel Permintaan */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-500 font-medium">
            Memuat data riwayat permintaan...
          </p>
        </div>
      ) : permintaan.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <DocumentTextIcon className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Belum Ada Riwayat Permintaan
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Permintaan barang yang Anda ajukan akan muncul di sini. Mulai ajukan
            permintaan dari halaman Pengajuan Permintaan.
          </p>
        </div>
      ) : (
        <>
          {/* Tabel Riwayat Permintaan Barang */}
          <EmployeeRequestHistoryTable
            permintaan={filtered}
            onDetail={(p) => {
              setSelected(p);
              setShowDetail(true);
            }}
            onDownloadPDF={handleDownloadPDF}
            pdfLoading={pdfLoading}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />

          {/* Pagination: Navigasi Halaman */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                {/* Tombol halaman sebelumnya */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Tombol halaman, selalu tampilkan halaman pertama, terakhir, dan sekitar halaman aktif */}
                {Array.from({ length: totalPages })
                  .map((_, i) => {
                    const page = i + 1;
                    const show =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    // Tampilkan ellipsis jika ada gap antar halaman
                    if (!show) {
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <span
                            key={`ellipsis-${page}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
                          >
                            …
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === page
                            ? "bg-blue-600 text-white font-medium border-blue-600 z-10"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  })
                  .filter(Boolean)}

                {/* Tombol halaman berikutnya */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    currentPage === totalPages
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal Detail Permintaan Barang */}
      <EmployeeRequestDetailModal
        show={showDetail}
        permintaan={selected}
        onClose={() => setShowDetail(false)}
        onDownloadPDF={handleDownloadPDF}
        pdfLoading={pdfLoading === selected?.id}
        formatDate={formatDate}
      />
    </div>
  );
};

export default EmployeeHistory;
