import React, { useState, useEffect } from "react";
import * as permintaanService from "../../services/permintaanService";
import EmployeeRequestHistoryTable from "../../components/employee/EmployeeRequestHistoryTable";
import EmployeeRequestDetailModal from "../../components/employee/EmployeeRequestDetailModal";
import { toast } from "react-toastify";

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Disetujui", label: "Disetujui" },
  { value: "Disetujui Sebagian", label: "Disetujui Sebagian" },
  { value: "Ditolak", label: "Ditolak" },
];

const EmployeeHistory = () => {
  const [permintaan, setPermintaan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await permintaanService.getRiwayatPermintaan();
      // Pastikan data yang dipetakan ke state memiliki format yang benar
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
      }));
      setPermintaan(mappedData);
    } catch (err) {
      toast.error("Gagal memuat riwayat permintaan");
      console.error("Error fetching history:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    let data = permintaan;
    if (searchTerm)
      data = data.filter(
        (p) =>
          p.nomorPermintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.items.some((i) =>
            i.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    if (filterStatus) data = data.filter((p) => p.status === filterStatus);
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Riwayat Permintaan Barang</h1>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Cari nomor atau nama barang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : permintaan.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Belum ada riwayat permintaan
        </div>
      ) : (
        <EmployeeRequestHistoryTable
          permintaan={filtered}
          onDetail={(p) => {
            setSelected(p);
            setShowDetail(true);
          }}
          getStatusColor={getStatusColor}
          formatDate={formatDate} // Add this line to pass the function
        />
      )}
      <EmployeeRequestDetailModal
        show={showDetail}
        permintaan={selected}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
};

export default EmployeeHistory;
