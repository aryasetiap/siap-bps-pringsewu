/**
 * File: ManajemenBarang.jsx
 * Halaman ini digunakan untuk mengelola data barang pada aplikasi SIAP.
 * Fitur utama: pencarian, filter, tambah/edit/hapus barang, dan penambahan stok.
 * Semua state dikelola secara internal.
 *
 * Return:
 * - Komponen React yang menampilkan UI manajemen barang beserta modals dan tabel.
 */

import React, { useState, useEffect, useCallback } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import BarangTable from "../../components/barang/BarangTable";
import BarangFormModal from "../../components/barang/BarangFormModal";
import BarangStokModal from "../../components/barang/BarangStokModal";
import Pagination from "../../components/common/Pagination";
import PageSizeSelector from "../../components/common/PageSizeSelector";
import * as barangService from "../../services/barangService";
import { toast } from "react-toastify";

// Pilihan satuan barang - DIPERBAIKI
const satuanOptions = [
  "Pcs",
  "Box",
  "Botol",
  "Roll",
  "Buku",
  "Rim",
  "Lembar",
  "Tube",
  "Pack",
  "Set",
];

// Pilihan kategori default barang
const defaultKategoriOptions = [
  "ATK",
  "Elektronik",
  "Komputer & Printer",
  "Konsumsi",
  "Dokumen & Arsip",
  "Peralatan Survey",
  "Peralatan Kebersihan",
  "Peralatan Rumah Tangga",
  "Peralatan Listrik",
  "Peralatan Jaringan",
  "Peralatan Komunikasi",
  "Furniture",
  "Kendaraan",
  "Lainnya",
];

/**
 * Komponen utama halaman manajemen barang dengan pagination.
 */
const ManajemenBarang = () => {
  // State utama untuk data barang dan filter
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAktif, setFilterAktif] = useState("aktif");
  const [loading, setLoading] = useState(false);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State untuk modal dan form
  const [showModal, setShowModal] = useState(false);
  const [showStokModal, setShowStokModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBarangId, setDeleteBarangId] = useState(null);

  // State untuk form tambah/edit barang
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategori: "",
    satuan: "",
    stok: "",
    stokMinimum: "",
    deskripsi: "",
  });

  // State untuk form penambahan stok barang
  const [stokData, setStokData] = useState({
    jumlahTambah: "",
    keterangan: "",
  });

  // State untuk pilihan kategori barang
  const [kategoriOptions, setKategoriOptions] = useState(
    defaultKategoriOptions
  );

  /**
   * Fungsi untuk mengambil data barang dari backend dengan pagination.
   */
  const fetchBarang = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        paginate: true,
      };

      // Tambahkan filter pencarian
      if (searchTerm) {
        params.q = searchTerm;
      }

      // Tambahkan filter status aktif
      if (filterAktif !== "all") {
        params.status_aktif = filterAktif === "aktif";
      }

      // Tambahkan filter stok kritis jika diperlukan
      if (filterStatus === "kritis") {
        params.stok_kritis = true;
      }

      const res = await barangService.getAllBarang(params);

      // Mapping data API ke struktur yang digunakan di frontend
      const mapped = res.data.data.map((item) => ({
        id: item.id,
        kode: item.kode_barang,
        nama: item.nama_barang,
        kategori: item.kategori,
        satuan: item.satuan,
        stok: item.stok,
        stokMinimum: item.ambang_batas_kritis,
        deskripsi: item.deskripsi,
        statusAktif: item.status_aktif,
        foto: item.foto,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setBarang(mapped);
      setTotalData(res.data.total);
      setTotalPages(res.data.totalPages);

      // Ambil semua kategori unik untuk filter
      const kategoriSet = new Set([
        ...defaultKategoriOptions,
        ...mapped.map((item) => item.kategori).filter(Boolean),
      ]);
      setKategoriOptions(Array.from(kategoriSet));
    } catch (err) {
      toast.error("Gagal memuat data barang.");
      console.error("Error fetching barang:", err);
    }
    setLoading(false);
  }, [
    currentPage,
    pageSize,
    searchTerm,
    filterAktif,
    filterStatus,
    // Hapus filterKategori karena tidak digunakan dalam fetchBarang
    // filterKategori hanya digunakan untuk client-side filtering
  ]);

  /**
   * Efek untuk mengambil data barang dari API saat komponen pertama kali di-mount
   * atau ketika parameter pagination/filter berubah.
   */
  useEffect(() => {
    fetchBarang();
  }, [fetchBarang]);

  /**
   * Effect untuk memfilter data berdasarkan kategori dan status
   * (filtering dilakukan di client-side untuk kategori, server-side untuk yang lain)
   */
  useEffect(() => {
    let filtered = barang;

    // Filter berdasarkan kategori (client-side)
    if (filterKategori) {
      filtered = filtered.filter((item) => item.kategori === filterKategori);
    }

    // Filter berdasarkan status stok (client-side)
    if (filterStatus) {
      if (filterStatus === "kritis") {
        filtered = filtered.filter((item) => item.stok <= item.stokMinimum);
      } else if (filterStatus === "normal") {
        filtered = filtered.filter((item) => item.stok > item.stokMinimum);
      }
    }

    setFilteredBarang(filtered);
  }, [barang, filterKategori, filterStatus]);

  /**
   * Handler untuk perubahan halaman
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * Handler untuk perubahan page size
   */
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset ke halaman pertama
  };

  /**
   * Handler untuk perubahan pencarian dengan debounce
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian
  };

  /**
   * Handler untuk perubahan filter kategori
   */
  const handleFilterKategoriChange = (e) => {
    setFilterKategori(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama
  };

  /**
   * Handler untuk perubahan filter status aktif
   */
  const handleFilterAktifChange = (e) => {
    setFilterAktif(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama
  };

  /**
   * Fungsi untuk membuka modal tambah barang.
   * Mengatur mode modal ke "add" dan reset form.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - void
   */
  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      kode: "",
      nama: "",
      kategori: "",
      satuan: "",
      stok: "",
      stokMinimum: "",
      deskripsi: "",
    });
    setShowModal(true);
  };

  /**
   * Fungsi untuk membuka modal edit barang.
   * Mengatur mode modal ke "edit" dan mengisi form dengan data barang terpilih.
   *
   * Parameter:
   * - item (Object): Data barang yang akan diedit
   *
   * Return:
   * - void
   */
  const openEditModal = (item) => {
    setModalMode("edit");
    setSelectedBarang(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori,
      satuan: item.satuan,
      stok: item.stok.toString(),
      stokMinimum: item.stokMinimum.toString(),
      deskripsi: item.deskripsi,
    });
    setShowModal(true);
  };

  /**
   * Fungsi untuk membuka modal penambahan stok barang.
   * Mengatur barang terpilih dan reset form stok.
   *
   * Parameter:
   * - item (Object): Data barang yang akan ditambah stoknya
   *
   * Return:
   * - void
   */
  const openStokModal = (item) => {
    setSelectedBarang(item);
    setStokData({ jumlahTambah: "", keterangan: "" });
    setShowStokModal(true);
  };

  /**
   * Fungsi untuk membuka modal konfirmasi hapus barang.
   * Menyimpan ID barang yang akan dihapus.
   *
   * Parameter:
   * - id (number): ID barang yang akan dihapus
   *
   * Return:
   * - void
   */
  const openDeleteModal = (id) => {
    setDeleteBarangId(id);
    setShowDeleteModal(true);
  };

  /**
   * Handler untuk submit form tambah/edit barang.
   * Melakukan validasi input sebelum mengirim ke backend.
   *
   * Parameter:
   * - e (Event): Event submit form
   *
   * Return:
   * - void
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi field wajib
    if (
      !formData.kode ||
      !formData.nama ||
      !formData.kategori ||
      !formData.satuan ||
      formData.stok === "" ||
      formData.stokMinimum === ""
    ) {
      toast.error("Semua field wajib diisi, termasuk satuan!");
      return;
    }
    if (isNaN(formData.stok) || parseInt(formData.stok) < 0) {
      toast.error("Stok harus angka positif!");
      return;
    }
    if (isNaN(formData.stokMinimum) || parseInt(formData.stokMinimum) < 0) {
      toast.error("Stok minimum harus angka positif!");
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "add") {
        await barangService.createBarang({
          kode_barang: formData.kode,
          nama_barang: formData.nama,
          kategori: formData.kategori,
          satuan: formData.satuan,
          stok: parseInt(formData.stok),
          ambang_batas_kritis: parseInt(formData.stokMinimum),
          deskripsi: formData.deskripsi,
        });
        toast.success("Barang berhasil ditambahkan!");
      } else {
        await barangService.updateBarang(selectedBarang.id, {
          kode_barang: formData.kode,
          nama_barang: formData.nama,
          kategori: formData.kategori,
          satuan: formData.satuan,
          stok: parseInt(formData.stok),
          ambang_batas_kritis: parseInt(formData.stokMinimum),
          deskripsi: formData.deskripsi,
        });
        toast.success("Barang berhasil diupdate!");
      }
      setShowModal(false);
      fetchBarang();
    } catch (err) {
      toast.error("Gagal menyimpan data barang.");
    }
    setLoading(false);
  };

  /**
   * Handler untuk submit form penambahan stok barang.
   * Melakukan validasi input sebelum mengirim ke backend.
   *
   * Parameter:
   * - e (Event): Event submit form
   *
   * Return:
   * - void
   */
  const handleStokSubmit = async (e) => {
    e.preventDefault();
    const jumlahInt = parseInt(stokData.jumlahTambah, 10);

    if (
      !stokData.jumlahTambah ||
      isNaN(jumlahInt) ||
      jumlahInt < 1 ||
      !Number.isInteger(jumlahInt)
    ) {
      toast.error("Jumlah penambahan harus angka bulat positif!");
      return;
    }

    setLoading(true);
    try {
      await barangService.tambahStok(selectedBarang.id, jumlahInt);
      toast.success("Stok barang berhasil ditambah!");
      setShowStokModal(false);
      fetchBarang();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Gagal menambah stok barang."
      );
    }
    setLoading(false);
  };

  /**
   * Handler untuk menghapus (menonaktifkan) barang.
   * Barang tidak dihapus permanen, hanya dinonaktifkan.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - void
   */
  const handleDelete = async () => {
    setLoading(true);
    try {
      await barangService.deleteBarang(deleteBarangId);
      toast.success("Barang berhasil dihapus!");
      await fetchBarang(); // Pastikan data barang terbaru diambil
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menghapus barang.");
    }
    setLoading(false);
    setShowDeleteModal(false);
    setDeleteBarangId(null);
  };

  /**
   * Fungsi helper untuk menentukan warna status stok barang.
   * Digunakan untuk menampilkan status stok kritis/normal pada tabel.
   *
   * Parameter:
   * - stok (number): Jumlah stok barang
   * - stokMinimum (number): Ambang batas stok kritis
   *
   * Return:
   * - string: Kelas warna Tailwind CSS
   */
  const getStatusColor = (stok, stokMinimum) =>
    stok <= stokMinimum
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";

  /**
   * Fungsi helper untuk menentukan teks status stok barang.
   * Digunakan untuk menampilkan label status pada tabel.
   *
   * Parameter:
   * - stok (number): Jumlah stok barang
   * - stokMinimum (number): Ambang batas stok kritis
   *
   * Return:
   * - string: Teks status ("Kritis" atau "Normal")
   */
  const getStatusText = (stok, stokMinimum) =>
    stok <= stokMinimum ? "Kritis" : "Normal";

  /**
   * Handler untuk mengaktifkan kembali barang yang telah dinonaktifkan.
   * Barang yang dihapus dapat diaktifkan kembali.
   *
   * Parameter:
   * - id (number): ID barang yang akan diaktifkan
   *
   * Return:
   * - void
   */
  const handleAktifkan = async (id) => {
    setLoading(true);
    try {
      await barangService.updateBarang(id, { status_aktif: true });
      toast.success("Barang berhasil diaktifkan kembali!");
      fetchBarang();
    } catch (err) {
      toast.error("Gagal mengaktifkan barang.");
    }
    setLoading(false);
  };

  /**
   * Handler untuk refresh data
   */
  const handleRefresh = () => {
    fetchBarang();
  };

  /**
   * Handler untuk perubahan input form tambah/edit barang.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handler untuk perubahan input form penambahan stok barang.
   */
  const handleStokChange = (e) => {
    const { name, value } = e.target;
    setStokData((prev) => ({ ...prev, [name]: value }));
  };

  // UI utama halaman manajemen barang
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manajemen Barang
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data barang dan stok persediaan secara efisien dan
              real-time.
            </p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm shadow">
            {totalData} Barang
          </span>
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl shadow border border-gray-100 px-4 py-3">
          {/* Input pencarian barang */}
          <div className="relative flex-1 min-w-[220px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
            />
          </div>

          {/* Filter kategori barang */}
          <select
            name="kategori"
            value={filterKategori}
            onChange={handleFilterKategoriChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>

          {/* Filter status stok */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="">Semua Status</option>
            <option value="kritis">Stok Kritis</option>
            <option value="normal">Stok Normal</option>
          </select>

          {/* Filter status aktif */}
          <select
            value={filterAktif}
            onChange={handleFilterAktifChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="aktif">Barang Aktif</option>
            <option value="nonaktif">Barang Nonaktif</option>
            <option value="all">Semua Barang</option>
          </select>

          {/* Page Size Selector */}
          <PageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
          />

          {/* Tombol tambah barang */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 shadow transition text-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Tambah Barang
          </button>

          {/* Tombol refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 shadow transition text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Tabel barang dengan loading state */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-gray-600">Memuat data...</span>
            </div>
          </div>
        )}

        <BarangTable
          data={filteredBarang}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onTambahStok={openStokModal}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          onAktifkan={handleAktifkan}
        />

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          total={totalData}
          limit={pageSize}
          loading={loading}
        />
      </div>

      {/* Modal tambah/edit barang */}
      <BarangFormModal
        show={showModal}
        mode={modalMode}
        formData={formData}
        kategoriOptions={kategoriOptions}
        satuanOptions={satuanOptions}
        loading={loading}
        onChange={handleInputChange}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Modal penambahan stok barang */}
      <BarangStokModal
        show={showStokModal}
        barang={selectedBarang}
        stokData={stokData}
        loading={loading}
        onChange={handleStokChange} // ✅ Handler sudah ditambahkan
        onClose={() => setShowStokModal(false)}
        onSubmit={handleStokSubmit}
      />

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Konfirmasi Hapus Barang
            </h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus barang ini? Data barang akan
              dinonaktifkan dan bisa diaktifkan kembali.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenBarang;
