import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import EmployeeBarangTable from "../../components/employee/EmployeeBarangTable";
import EmployeeRequestForm from "../../components/employee/EmployeeRequestForm";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import * as barangService from "../../services/barangService";
import * as employeeRequestService from "../../services/employeeRequestService";

const EmployeeRequestPage = () => {
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [keranjang, setKeranjang] = useState([]);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch barang dari API
  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      // Gunakan endpoint yang tersedia untuk pegawai
      const res = await barangService.getAllBarangForEmployee();
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

  // Filter barang
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
    setFilteredBarang(filtered);
  }, [searchTerm, filterKategori, barang]);

  // Handler search/filter
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterKategoriChange = (e) => setFilterKategori(e.target.value);

  // Handler tambah barang ke keranjang
  const handleAddItem = (item) => {
    if (keranjang.find((i) => i.id === item.id)) return;
    setKeranjang((prev) => [
      ...prev,
      {
        id: item.id,
        kode: item.kode, // Pastikan field ini ada
        nama: item.nama, // Pastikan field ini ada
        kategori: item.kategori,
        stok: item.stok,
        satuan: item.satuan,
        jumlah: 1,
      },
    ]);
  };

  // Handler ubah jumlah barang di keranjang
  const handleItemChange = (id, jumlah) => {
    setKeranjang((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              jumlah: Math.max(1, Math.min(item.stok, parseInt(jumlah) || 1)),
            }
          : item
      )
    );
  };

  // Handler hapus barang dari keranjang
  const handleRemoveItem = (id) => {
    setKeranjang((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler catatan
  const handleCatatanChange = (e) => setCatatan(e.target.value);

  // Handler validasi dan pra-submit
  const handlePreSubmit = (e) => {
    e.preventDefault();
    // Validasi
    if (keranjang.length === 0) {
      toast.error("Pilih minimal satu barang!");
      return;
    }

    // Validasi per item
    for (const item of keranjang) {
      if (item.jumlah < 1) {
        toast.error(`Jumlah untuk ${item.nama} harus minimal 1.`);
        return;
      }
      if (item.jumlah > item.stok) {
        toast.error(`Jumlah ${item.nama} melebihi stok tersedia.`);
        return;
      }
    }

    // Tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  // Handler submit setelah konfirmasi
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await employeeRequestService.createPermintaan({
        items: keranjang.map((item) => ({
          id_barang: item.id,
          jumlah: item.jumlah,
        })),
        catatan,
      });

      // Reset form
      setKeranjang([]);
      setCatatan("");

      // Tutup modal konfirmasi
      setShowConfirmModal(false);

      // Notifikasi sukses dengan detail
      toast.success(
        `Permintaan berhasil diajukan dengan nomor: ${
          response.data.nomor_permintaan || response.data.id
        }!`
      );

      // Refresh data barang
      fetchBarang();
    } catch (err) {
      // Error handling spesifik
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 400) {
          if (message.includes("stok")) {
            toast.error(
              "Stok tidak mencukupi untuk beberapa barang. Silakan periksa kembali."
            );
          } else if (message.includes("items")) {
            toast.error("Data barang tidak valid. Silakan pilih barang lain.");
          } else {
            toast.error(
              message || "Validasi gagal, periksa kembali data permintaan."
            );
          }
        } else if (status === 401) {
          toast.error("Sesi login telah berakhir. Silakan login kembali.");
        } else if (status === 403) {
          toast.error("Anda tidak memiliki izin untuk melakukan permintaan.");
        } else {
          toast.error(
            "Terjadi kesalahan pada server. Silakan coba lagi nanti."
          );
        }
      } else {
        toast.error(
          "Gagal terhubung ke server. Periksa koneksi internet Anda."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header dengan ikon dan informasi */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow">
            <ShoppingCartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pengajuan Permintaan Barang
            </h1>
            <p className="text-gray-600 mt-1">
              Pilih barang yang akan diminta dari daftar tersedia di bawah ini.
              {keranjang.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {keranjang.length} Item di keranjang
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Barang */}
      <EmployeeBarangTable
        barang={filteredBarang}
        searchTerm={searchTerm}
        filterKategori={filterKategori}
        kategoriOptions={kategoriOptions}
        onSearchChange={handleSearchChange}
        onFilterKategoriChange={handleFilterKategoriChange}
        onAddItem={handleAddItem}
        keranjang={keranjang}
        loading={loading}
      />

      {/* Form Permintaan */}
      <EmployeeRequestForm
        items={keranjang}
        onItemChange={handleItemChange}
        onRemoveItem={handleRemoveItem}
        onSubmit={handlePreSubmit}
        loading={loading}
        catatan={catatan}
        onCatatanChange={handleCatatanChange}
      />

      {/* Modal Konfirmasi */}
      <ConfirmationModal
        show={showConfirmModal}
        title="Konfirmasi Pengajuan"
        message="Apakah Anda yakin ingin mengajukan permintaan barang ini? Setelah diajukan, permintaan akan dikirim ke admin untuk diverifikasi."
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Kirim Permintaan"
        cancelText="Batal"
        loading={loading}
      />
    </div>
  );
};

export default EmployeeRequestPage;
