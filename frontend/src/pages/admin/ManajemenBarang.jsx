/**
 * File: ManajemenBarang.jsx
 * Halaman ini digunakan untuk mengelola data barang pada aplikasi SIAP.
 * Fitur utama: pencarian, filter, tambah/edit/hapus barang, dan penambahan stok.
 * Semua state dikelola secara internal.
 *
 * Return:
 * - Komponen React yang menampilkan UI manajemen barang beserta modals dan tabel.
 */

import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import BarangTable from "../../components/barang/BarangTable";
import BarangFormModal from "../../components/barang/BarangFormModal";
import BarangStokModal from "../../components/barang/BarangStokModal";
import * as barangService from "../../services/barangService";
import { toast } from "react-toastify";

// Pilihan satuan barang
const satuanOptions = ["pcs", "box", "rim", "pack", "unit", "set"];

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
 * Komponen utama halaman manajemen barang.
 * Mengelola state, pengambilan data, filter, dan aksi CRUD barang.
 *
 * Return:
 * - JSX: UI halaman manajemen barang
 */
const ManajemenBarang = () => {
  // State utama untuk data barang dan filter
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAktif, setFilterAktif] = useState("aktif");
  const [showModal, setShowModal] = useState(false);
  const [showStokModal, setShowStokModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [loading, setLoading] = useState(false);
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
   * Efek untuk mengambil data barang dari API saat komponen pertama kali di-mount.
   */
  useEffect(() => {
    fetchBarang();
  }, []);

  /**
   * Fungsi untuk mengambil data barang dari backend dan mengatur state barang.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - void
   */
  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await barangService.getAllBarang();
      // Mapping data API ke struktur yang digunakan di frontend
      const mapped = res.data.map((item) => ({
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

      // Ambil semua kategori unik untuk filter
      const kategoriSet = new Set([
        ...defaultKategoriOptions,
        ...mapped.map((item) => item.kategori).filter(Boolean),
      ]);
      setKategoriOptions(Array.from(kategoriSet));
    } catch (err) {
      toast.error("Gagal memuat data barang.");
    }
    setLoading(false);
  };

  /**
   * Efek untuk melakukan filter dan pencarian pada data barang.
   * Filter berdasarkan pencarian, kategori, status stok, dan status aktif barang.
   *
   * Tidak menerima parameter.
   *
   * Return:
   * - void
   */
  useEffect(() => {
    let filtered = barang;

    // Filter berdasarkan pencarian nama/kode barang
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan kategori barang
    if (filterKategori) {
      filtered = filtered.filter((item) => item.kategori === filterKategori);
    }

    // Filter berdasarkan status stok barang
    if (filterStatus) {
      if (filterStatus === "kritis") {
        filtered = filtered.filter((item) => item.stok <= item.stokMinimum);
      } else if (filterStatus === "normal") {
        filtered = filtered.filter((item) => item.stok > item.stokMinimum);
      }
    }

    // Filter berdasarkan status aktif barang
    if (filterAktif === "aktif") {
      filtered = filtered.filter((item) => item.statusAktif);
    } else if (filterAktif === "nonaktif") {
      filtered = filtered.filter((item) => !item.statusAktif);
    }
    // Jika "all", tampilkan semua barang tanpa filter status aktif

    setFilteredBarang(filtered);
  }, [searchTerm, filterKategori, filterStatus, filterAktif, barang]);

  /**
   * Handler untuk perubahan input pada form tambah/edit barang.
   *
   * Parameter:
   * - e (Event): Event perubahan input
   *
   * Return:
   * - void
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handler untuk perubahan input pada form penambahan stok barang.
   *
   * Parameter:
   * - e (Event): Event perubahan input
   *
   * Return:
   * - void
   */
  const handleStokChange = (e) => {
    const { name, value } = e.target;
    setStokData((prev) => ({ ...prev, [name]: value }));
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
      toast.error("Semua field wajib diisi!");
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
            {barang.length} Barang
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
            />
          </div>
          {/* Filter kategori barang */}
          <select
            name="kategori"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
          {/* Filter status stok barang */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="">Semua Status</option>
            <option value="normal">Normal</option>
            <option value="kritis">Stok Kritis</option>
          </select>
          {/* Filter status aktif barang */}
          <select
            value={filterAktif}
            onChange={(e) => setFilterAktif(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="aktif">Barang Aktif</option>
            <option value="nonaktif">Barang Nonaktif</option>
            <option value="all">Semua Barang</option>
          </select>
          {/* Tombol tambah barang */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 shadow transition text-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Tambah Barang
          </button>
        </div>
      </div>
      <div className="mb-2 border-b border-gray-100"></div>
      {/* Tabel barang */}
      <BarangTable
        data={filteredBarang}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onTambahStok={openStokModal}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        onAktifkan={handleAktifkan}
      />
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
        onChange={handleStokChange}
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
