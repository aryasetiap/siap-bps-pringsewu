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
  const [showModal, setShowModal] = useState(false);
  const [showStokModal, setShowStokModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setBarang(res.data);
      // Generate kategori unik dari data barang
      const kategoriSet = new Set(
        res.data.map((item) => item.kategori).filter(Boolean)
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
    setFilteredBarang(filtered);
  }, [searchTerm, filterKategori, filterStatus, barang]);

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

  // CRUD handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi manual
    if (
      !formData.kode ||
      !formData.nama ||
      !formData.kategori ||
      !formData.satuan
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
          ...formData,
          stok: parseInt(formData.stok),
          stokMinimum: parseInt(formData.stokMinimum),
        });
        toast.success("Barang berhasil ditambahkan!");
      } else {
        await barangService.updateBarang(selectedBarang.id, {
          ...formData,
          stok: parseInt(formData.stok),
          stokMinimum: parseInt(formData.stokMinimum),
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
    setLoading(true);
    try {
      await barangService.tambahStok(selectedBarang.id, {
        jumlahTambah: parseInt(stokData.jumlahTambah),
        keterangan: stokData.keterangan,
      });
      setShowStokModal(false);
      fetchBarang();
      // TODO: tampilkan notifikasi sukses
    } catch (err) {
      // TODO: tampilkan notifikasi error
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini?"))
      return;
    setLoading(true);
    try {
      await barangService.deleteBarang(id);
      fetchBarang();
      // TODO: tampilkan notifikasi sukses
    } catch (err) {
      // TODO: tampilkan notifikasi error
    }
    setLoading(false);
  };

  // Status helpers
  const getStatusColor = (stok, stokMinimum) =>
    stok <= stokMinimum
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";
  const getStatusText = (stok, stokMinimum) =>
    stok <= stokMinimum ? "Kritis" : "Normal";

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Barang</h1>
        <p className="text-gray-600">Kelola data barang dan stok persediaan</p>
      </div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="normal">Normal</option>
              <option value="kritis">Stok Kritis</option>
            </select>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Tambah Barang
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="text-blue-600">Memuat data...</span>
        </div>
      ) : (
        <BarangTable
          data={filteredBarang}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onTambahStok={openStokModal}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}
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
    </div>
  );
};

export default ManajemenBarang;
