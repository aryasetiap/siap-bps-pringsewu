/**
 * File: EmployeeRequest.jsx
 *
 * Halaman EmployeeRequestPage digunakan untuk pengajuan permintaan barang oleh pegawai.
 * Pegawai dapat memilih barang dari daftar, menambahkannya ke keranjang, mengatur jumlah,
 * menambahkan catatan, dan mengirim permintaan ke admin untuk diverifikasi.
 *
 * Fitur utama:
 * - Pencarian dan filter barang berdasarkan kategori
 * - Penambahan barang ke keranjang permintaan
 * - Validasi jumlah barang terhadap stok
 * - Pengiriman permintaan dengan konfirmasi
 *
 * Komponen terkait:
 * - EmployeeBarangTable: Tabel daftar barang yang dapat dipilih
 * - EmployeeRequestForm: Formulir permintaan barang
 * - ConfirmationModal: Modal konfirmasi sebelum submit
 */

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import EmployeeBarangTable from "../../components/employee/EmployeeBarangTable";
import EmployeeRequestForm from "../../components/employee/EmployeeRequestForm";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import * as barangService from "../../services/barangService";
import * as employeeRequestService from "../../services/employeeRequestService";

/**
 * Komponen utama halaman permintaan barang oleh pegawai.
 *
 * Return:
 * - JSX: Tampilan halaman permintaan barang
 */
const EmployeeRequestPage = () => {
  // State utama untuk data barang, filter, keranjang, dan loading
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [keranjang, setKeranjang] = useState([]);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * Mengambil data barang dari API khusus pegawai.
   * Menyimpan data barang dan daftar kategori unik.
   *
   * Return:
   * - void
   */
  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await barangService.getAllBarangForEmployee();
      setBarang(res.data);

      // Membuat daftar kategori unik dari data barang
      const kategoriSet = new Set(
        res.data.map((item) => item.kategori).filter(Boolean)
      );
      setKategoriOptions(Array.from(kategoriSet));
    } catch (err) {
      toast.error("Gagal memuat data barang.");
    }
    setLoading(false);
  };

  /**
   * Efek untuk mengambil data barang saat komponen pertama kali di-mount.
   *
   * Return:
   * - void
   */
  useEffect(() => {
    fetchBarang();
  }, []);

  /**
   * Melakukan filter barang berdasarkan kata kunci pencarian dan kategori.
   * Hasil filter disimpan ke state filteredBarang.
   *
   * Parameter:
   * - searchTerm (string): Kata kunci pencarian
   * - filterKategori (string): Kategori barang yang dipilih
   * - barang (array): Daftar barang dari API
   *
   * Return:
   * - void
   */
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

  /**
   * Handler perubahan kata kunci pencarian barang.
   *
   * Parameter:
   * - e (Event): Event input
   *
   * Return:
   * - void
   */
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  /**
   * Handler perubahan filter kategori barang.
   *
   * Parameter:
   * - e (Event): Event input
   *
   * Return:
   * - void
   */
  const handleFilterKategoriChange = (e) => setFilterKategori(e.target.value);

  /**
   * Menambahkan barang ke keranjang permintaan.
   * Barang yang sudah ada di keranjang tidak akan ditambahkan lagi.
   *
   * Parameter:
   * - item (object): Data barang yang dipilih
   *
   * Return:
   * - void
   */
  const handleAddItem = (item) => {
    if (keranjang.find((i) => i.id === item.id)) return;
    setKeranjang((prev) => [
      ...prev,
      {
        id: item.id,
        kode: item.kode,
        nama: item.nama,
        kategori: item.kategori,
        stok: item.stok,
        satuan: item.satuan,
        jumlah: 1,
      },
    ]);
  };

  /**
   * Mengubah jumlah barang pada keranjang permintaan.
   * Jumlah minimal 1 dan maksimal sesuai stok tersedia.
   *
   * Parameter:
   * - id (number|string): ID barang
   * - jumlah (number|string): Jumlah yang diinputkan
   *
   * Return:
   * - void
   */
  const handleItemChange = (id, jumlah) => {
    setKeranjang((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              jumlah: parseInt(jumlah) || 0, // Biarkan 0 untuk validasi
            }
          : item
      )
    );
  };

  /**
   * Menghapus barang dari keranjang permintaan.
   *
   * Parameter:
   * - id (number|string): ID barang yang akan dihapus
   *
   * Return:
   * - void
   */
  const handleRemoveItem = (id) => {
    setKeranjang((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Handler perubahan catatan permintaan barang.
   *
   * Parameter:
   * - e (Event): Event input
   *
   * Return:
   * - void
   */
  const handleCatatanChange = (e) => setCatatan(e.target.value);

  /**
   * Handler validasi sebelum submit permintaan barang.
   * Menampilkan modal konfirmasi jika validasi lolos.
   *
   * Parameter:
   * - e (Event): Event submit form
   *
   * Return:
   * - void
   */
  const handlePreSubmit = (e) => {
    e.preventDefault();

    // Validasi minimal satu barang di keranjang
    if (keranjang.length === 0) {
      toast.error("Pilih minimal satu barang!");
      return;
    }

    // Validasi jumlah barang per item
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

    setShowConfirmModal(true);
  };

  /**
   * Handler submit permintaan barang ke API setelah konfirmasi.
   * Melakukan reset form dan menampilkan notifikasi sesuai hasil.
   *
   * Return:
   * - void
   */
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

      // Reset form permintaan
      setKeranjang([]);
      setCatatan("");
      setShowConfirmModal(false);

      // Notifikasi sukses dengan nomor permintaan
      toast.success(
        `Permintaan berhasil diajukan dengan nomor: ${
          response.data.nomor_permintaan || response.data.id
        }!`
      );

      // Refresh data barang agar stok terbaru
      fetchBarang();
    } catch (err) {
      // Penanganan error spesifik dari API SIAP
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 400) {
          if (message?.includes("stok")) {
            toast.error(
              "Stok tidak mencukupi untuk beberapa barang. Silakan periksa kembali."
            );
          } else if (message?.includes("items")) {
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

  // Render halaman permintaan barang pegawai
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
