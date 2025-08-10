import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  ClockIcon,
  DocumentTextIcon,
  FunnelIcon, // Changed from FilterIcon
  ArrowPathIcon, // Changed from RefreshIcon
  MagnifyingGlassIcon, // Changed from SearchIcon
} from "@heroicons/react/24/outline"; // Note the '24/outline' instead of just 'outline'
import * as permintaanService from "../../services/permintaanService";
import EmployeeRequestHistoryTable from "../../components/employee/EmployeeRequestHistoryTable";
import EmployeeRequestDetailModal from "../../components/employee/EmployeeRequestDetailModal";

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Disetujui", label: "Disetujui" },
  { value: "Disetujui Sebagian", label: "Disetujui Sebagian" },
  { value: "Ditolak", label: "Ditolak" },
];

const EmployeeHistory = () => {
  // State management
  const [permintaan, setPermintaan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fungsi untuk mengambil data dari API dengan pagination
  const fetchData = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        // Anda bisa menambahkan parameter pagination ke API jika backend mendukung
        const res = await permintaanService.getRiwayatPermintaan({
          page,
          limit,
          status: filterStatus || undefined,
          search: searchTerm || undefined,
        });

        // Mapping data dari API ke format yang dibutuhkan komponen
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

        // Jika API mendukung pagination, perbarui totalPages
        // Jika tidak, gunakan perhitungan sederhana
        if (res.meta && res.meta.totalPages) {
          setTotalPages(res.meta.totalPages);
        } else {
          // Fallback pagination calculation
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

  // Initial load
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Filtering
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

  // Format tanggal dengan benar
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-"; // Handle invalid date
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // Add getStatusColor function
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

  // Handler untuk memuat ulang data
  const handleRefresh = () => {
    fetchData(currentPage);
  };

  // Handler untuk mengubah halaman
  const handlePageChange = (page) => {
    fetchData(page);
  };

  // Handler untuk mengunduh PDF permintaan
  const handleDownloadPDF = async (id) => {
    setPdfLoading(id);
    try {
      const response = await permintaanService.getPermintaanPDF(id);

      // Membuat blob URL dari response
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Buka PDF di tab baru
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

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center space-x-3 mb-3 lg:mb-0">
          <ClockIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Permintaan Barang
          </h1>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="relative flex-grow max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nomor atau nama barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex items-center">
          <FunnelIcon className="h-4 w-4 mr-2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add limit selector UI */}
        <div className="flex items-center ml-2">
          <span className="text-sm text-gray-500 mr-2">Tampilkan:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              fetchData(1); // Reset to first page when changing limit
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-500">Memuat data riwayat permintaan...</p>
        </div>
      ) : permintaan.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
          <DocumentTextIcon className="h-16 w-16 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Belum Ada Riwayat Permintaan
          </h3>
          <p className="text-gray-500">
            Permintaan yang Anda ajukan akan muncul di sini
          </p>
        </div>
      ) : (
        <>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  &laquo;
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </>
      )}

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
