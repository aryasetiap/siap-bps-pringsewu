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
      const res = await permintaanService.getRiwayatPermintaanPegawai();
      setPermintaan(res.data);
    } catch (err) {
      toast.error("Gagal memuat riwayat permintaan");
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
      <EmployeeRequestHistoryTable
        permintaan={filtered}
        onDetail={(p) => {
          setSelected(p);
          setShowDetail(true);
        }}
      />
      <EmployeeRequestDetailModal
        show={showDetail}
        permintaan={selected}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
};

export default EmployeeHistory;
