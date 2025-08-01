import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import BarangTable from "../../components/barang/BarangTable";
import BarangFormModal from "../../components/barang/BarangFormModal";
import BarangStokModal from "../../components/barang/BarangStokModal";
import * as barangService from "../../services/barangService";
import { toast } from "react-toastify";

const satuanOptions = ["pcs", "box", "rim", "pack", "unit", "set"];

const ManajemenBarang = () => {
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAktif, setFilterAktif] = useState("aktif"); // baru
  const [showModal, setShowModal] = useState(false);
  const [showStokModal, setShowStokModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBarangId, setDeleteBarangId] = useState(null);

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategori: "",
    satuan: "",
    stok: "",
    stokMinimum: "",
    deskripsi: "",
  });

  const [stokData, setStokData] = useState({
    jumlahTambah: "",
    keterangan: "",
  });

  const [kategoriOptions, setKategoriOptions] = useState([]);

  // Fetch data barang dari API
  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await barangService.getAllBarang();
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
      const kategoriSet = new Set(
        mapped.map((item) => item.kategori).filter(Boolean)
      );
      setKategoriOptions(Array.from(kategoriSet));
    } catch (err) {
      toast.error("Gagal memuat data barang.");
    }
    setLoading(false);
  };

  // Filter dan search
  useEffect(() => {
    let filtered = barang;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterKategori) {
      filtered = filtered.filter((item) => item.kategori === filterKategori);
    }
    if (filterStatus) {
      if (filterStatus === "kritis") {
        filtered = filtered.filter((item) => item.stok <= item.stokMinimum);
      } else if (filterStatus === "normal") {
        filtered = filtered.filter((item) => item.stok > item.stokMinimum);
      }
    }
    if (filterAktif === "aktif") {
      filtered = filtered.filter((item) => item.statusAktif);
    } else if (filterAktif === "nonaktif") {
      filtered = filtered.filter((item) => !item.statusAktif);
    }
    setFilteredBarang(filtered);
  }, [searchTerm, filterKategori, filterStatus, filterAktif, barang]);

  // Handler input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleStokChange = (e) => {
    const { name, value } = e.target;
    setStokData((prev) => ({ ...prev, [name]: value }));
  };

  // Modal handlers
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
  const openStokModal = (item) => {
    setSelectedBarang(item);
    setStokData({ jumlahTambah: "", keterangan: "" });
    setShowStokModal(true);
  };
  const openDeleteModal = (id) => {
    setDeleteBarangId(id);
    setShowDeleteModal(true);
  };

  // CRUD handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi manual
    if (!formData.kode || !formData.nama || !formData.satuan) {
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
          kategori: formData.kategori, // <-- pastikan ini ada!
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
          kategori: formData.kategori, // <-- pastikan ini ada!
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await barangService.deleteBarang(deleteBarangId);
      toast.success("Barang berhasil dihapus!");
      fetchBarang();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menghapus barang.");
    }
    setLoading(false);
    setShowDeleteModal(false);
    setDeleteBarangId(null);
  };

  // Status helpers
  const getStatusColor = (stok, stokMinimum) =>
    stok <= stokMinimum
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";
  const getStatusText = (stok, stokMinimum) =>
    stok <= stokMinimum ? "Kritis" : "Normal";

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
          <select
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="">Semua Status</option>
            <option value="normal">Normal</option>
            <option value="kritis">Stok Kritis</option>
          </select>
          <select
            value={filterAktif}
            onChange={(e) => setFilterAktif(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm"
          >
            <option value="aktif">Barang Aktif</option>
            <option value="nonaktif">Barang Nonaktif</option>
            <option value="all">Semua Barang</option>
          </select>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 shadow transition text-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Tambah Barang
          </button>
        </div>
      </div>
      <div className="mb-2 border-b border-gray-100"></div>
      <BarangTable
        data={filteredBarang}
        onEdit={openEditModal}
        onDelete={openDeleteModal} // ganti ke openDeleteModal
        onTambahStok={openStokModal}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        onAktifkan={handleAktifkan}
      />
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
