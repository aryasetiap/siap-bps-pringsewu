import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import RequestTable from "../../components/permintaan/RequestTable";
import RequestDetailModal from "../../components/permintaan/RequestDetailModal";
import RequestVerifikasiModal from "../../components/permintaan/RequestVerifikasiModal";
import * as permintaanService from "../../services/permintaanService";

const statusOptions = [
  { value: "Menunggu", label: "Menunggu", color: "yellow" },
  { value: "Disetujui", label: "Disetujui", color: "green" },
  { value: "Disetujui Sebagian", label: "Disetujui Sebagian", color: "orange" },
  { value: "Ditolak", label: "Ditolak", color: "red" },
];

const RequestVerification = () => {
  const [permintaan, setPermintaan] = useState([]);
  const [filteredPermintaan, setFilteredPermintaan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
  const [selectedPermintaan, setSelectedPermintaan] = useState(null);
  const [loading, setLoading] = useState(false);

  const [verifikasiData, setVerifikasiData] = useState({
    keputusan: "",
    catatanVerifikasi: "",
    items: [],
  });

  // Fetch permintaan dari API
  useEffect(() => {
    fetchPermintaan();
  }, []);

  const fetchPermintaan = async () => {
    setLoading(true);
    try {
      const res = await permintaanService.getAllPermintaan();
      setPermintaan(res.data);
    } catch (err) {
      // TODO: tampilkan notifikasi error
    }
    setLoading(false);
  };

  // Filter dan search
  useEffect(() => {
    let filtered = permintaan;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nomorPermintaan
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.pemohon.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pemohon.unitKerja
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }
    setFilteredPermintaan(filtered);
  }, [searchTerm, filterStatus, permintaan]);

  // Modal handlers
  const openDetailModal = (item) => {
    setSelectedPermintaan(item);
    setShowDetailModal(true);
  };
  const openVerifikasiModal = (item) => {
    setSelectedPermintaan(item);
    setVerifikasiData({
      keputusan: "",
      catatanVerifikasi: "",
      items: item.items.map((itm) => ({
        id: itm.id,
        namaBarang: itm.namaBarang,
        jumlahDiminta: itm.jumlahDiminta,
        jumlahDisetujui: itm.jumlahDiminta,
        stokTersedia: itm.stokTersedia,
        satuan: itm.satuan,
      })),
    });
    setShowVerifikasiModal(true);
  };

  // Verifikasi handlers
  const handleVerifikasiChange = (e) => {
    const { name, value } = e.target;
    setVerifikasiData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleItemQuantityChange = (itemId, newQuantity) => {
    setVerifikasiData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? { ...item, jumlahDisetujui: parseInt(newQuantity) || 0 }
          : item
      ),
    }));
  };
  const handleKeputusanChange = (keputusan) => {
    let updatedItems = [...verifikasiData.items];
    if (keputusan === "setuju") {
      updatedItems = updatedItems.map((item) => ({
        ...item,
        jumlahDisetujui: item.jumlahDiminta,
      }));
    } else if (keputusan === "tolak") {
      updatedItems = updatedItems.map((item) => ({
        ...item,
        jumlahDisetujui: 0,
      }));
    }
    setVerifikasiData((prev) => ({
      ...prev,
      keputusan,
      items: updatedItems,
    }));
  };

  // Submit verifikasi
  const handleVerifikasiSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await permintaanService.verifikasiPermintaan(selectedPermintaan.id, {
        keputusan: verifikasiData.keputusan,
        items: verifikasiData.items.map((item) => ({
          id_detail: item.id,
          jumlah_disetujui: item.jumlahDisetujui,
        })),
        catatan_verifikasi: verifikasiData.catatanVerifikasi,
      });
      setShowVerifikasiModal(false);
      fetchPermintaan();
      // TODO: tampilkan notifikasi sukses
    } catch (err) {
      // TODO: tampilkan notifikasi error
    }
    setLoading(false);
  };

  // Helpers
  const getStatusColor = (status) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    const colorMap = {
      yellow: "text-yellow-700 bg-yellow-100",
      green: "text-green-700 bg-green-100",
      orange: "text-orange-700 bg-orange-100",
      red: "text-red-700 bg-red-100",
    };
    return colorMap[statusObj?.color] || "text-gray-700 bg-gray-100";
  };
  const getRowBackgroundColor = (item) => {
    if (verifikasiData.keputusan === "tolak") {
      return "bg-red-50 border-red-200";
    } else if (verifikasiData.keputusan === "setuju") {
      return item.stokTersedia < item.jumlahDiminta
        ? "bg-red-50 border-red-200"
        : "bg-green-50 border-green-200";
    } else if (verifikasiData.keputusan === "sebagian") {
      if (item.jumlahDisetujui === 0) return "bg-red-50 border-red-200";
      if (item.jumlahDisetujui === item.jumlahDiminta)
        return "bg-green-50 border-green-200";
      if (item.jumlahDisetujui > 0) return "bg-yellow-50 border-yellow-200";
    }
    return item.stokTersedia < item.jumlahDiminta
      ? "bg-red-50 border-red-200"
      : "bg-white";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Verifikasi Permintaan
        </h1>
        <p className="text-gray-600">
          Kelola dan verifikasi permintaan barang dari pegawai
        </p>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* ...widget statistik, sama seperti sebelumnya... */}
      </div>
      {/* Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor permintaan, nama, atau unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <RequestTable
        permintaan={filteredPermintaan}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onDetail={openDetailModal}
        onVerifikasi={openVerifikasiModal}
      />
      {/* Detail Modal */}
      <RequestDetailModal
        show={showDetailModal}
        permintaan={selectedPermintaan}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onClose={() => setShowDetailModal(false)}
      />
      {/* Verifikasi Modal */}
      <RequestVerifikasiModal
        show={showVerifikasiModal}
        permintaan={selectedPermintaan}
        verifikasiData={verifikasiData}
        loading={loading}
        onChange={handleVerifikasiChange}
        onItemChange={handleItemQuantityChange}
        onKeputusanChange={handleKeputusanChange}
        onClose={() => setShowVerifikasiModal(false)}
        onSubmit={handleVerifikasiSubmit}
        getRowBackgroundColor={getRowBackgroundColor}
      />
    </div>
  );
};

export default RequestVerification;
