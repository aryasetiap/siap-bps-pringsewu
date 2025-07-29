import React, { useState, useEffect } from "react";
import EmployeeBarangTable from "../../components/employee/EmployeeBarangTable";
import EmployeeRequestForm from "../../components/employee/EmployeeRequestForm";
import * as barangService from "../../services/barangService";
import * as employeeRequestService from "../../services/employeeRequestService";

const kategoriOptions = [
  "Alat Tulis Kantor",
  "Consumables",
  "Perlengkapan",
  "Elektronik",
];

const EmployeeRequestPage = () => {
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [keranjang, setKeranjang] = useState([]);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch barang dari API
  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await barangService.getAllBarang();
      setBarang(res.data);
    } catch (err) {
      // TODO: tampilkan notifikasi error
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
    setKeranjang((prev) => [...prev, { ...item, jumlah: 1 }]);
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

  // Handler submit permintaan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeeRequestService.createPermintaan({
        items: keranjang.map((item) => ({
          id_barang: item.id,
          jumlah: item.jumlah,
        })),
        catatan,
      });
      setKeranjang([]);
      setCatatan("");
      // TODO: tampilkan notifikasi sukses
    } catch (err) {
      // TODO: tampilkan notifikasi error
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pengajuan Permintaan Barang</h1>
      <EmployeeBarangTable
        barang={filteredBarang}
        searchTerm={searchTerm}
        filterKategori={filterKategori}
        onSearchChange={handleSearchChange}
        onFilterKategoriChange={handleFilterKategoriChange}
        onAddItem={handleAddItem}
      />
      <EmployeeRequestForm
        items={keranjang}
        onItemChange={handleItemChange}
        onRemoveItem={handleRemoveItem}
        onSubmit={handleSubmit}
        loading={loading}
        catatan={catatan}
        onCatatanChange={handleCatatanChange}
      />
    </div>
  );
};

export default EmployeeRequestPage;
