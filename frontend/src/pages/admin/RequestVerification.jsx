import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import RequestTable from "../../components/permintaan/RequestTable";
import RequestDetailModal from "../../components/permintaan/RequestDetailModal";
import RequestVerifikasiModal from "../../components/permintaan/RequestVerifikasiModal";
import * as permintaanService from "../../services/permintaanService";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const statusOptions = [
  { value: "Menunggu", label: "Menunggu", color: "yellow" },
  { value: "Disetujui", label: "Disetujui", color: "green" },
  { value: "Disetujui Sebagian", label: "Disetujui Sebagian", color: "orange" },
  { value: "Ditolak", label: "Ditolak", color: "red" },
];

function StatCard({ color, icon, label, value, info }) {
  const colorMap = {
    blue: "text-blue-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
    green: "text-green-700",
  };
  const iconBgMap = {
    blue: "bg-blue-100",
    yellow: "bg-yellow-100",
    red: "bg-red-100",
    green: "bg-green-100",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow ${iconBgMap[color]}`}
      >
        <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-2xl font-extrabold ${colorMap[color]}`}>{value}</p>
        {info && <p className="text-xs text-gray-400 mt-1">{info}</p>}
      </div>
    </div>
  );
}

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

  const [statistik, setStatistik] = useState(null);
  const [trenPermintaan, setTrenPermintaan] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    fetchPermintaan();
    fetchStatistik();
    fetchTrenPermintaan();
  }, [filterStatus, page, limit]);

  const fetchPermintaan = async () => {
    setLoading(true);
    try {
      // Validasi agar page dan limit selalu angka bulat positif
      const validPage = Number.isInteger(page) && page > 0 ? page : 1;
      const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 20;
      const params = {
        page: validPage,
        limit: validLimit,
      };
      if (filterStatus) {
        params.status = filterStatus;
      }
      const res = await permintaanService.getAllPermintaan(params);
      const mapped = (res.data.data || []).map((p) => ({
        ...p,
        items: (p.details || []).map((d) => ({
          id: d.id,
          namaBarang: d.barang.nama_barang,
          kodeBarang: d.barang.kode_barang,
          satuan: d.barang.satuan,
          kategori: d.barang.kategori,
          stokTersedia: d.barang.stok,
          jumlahDiminta: d.jumlah_diminta,
          jumlahDisetujui: d.jumlah_disetujui,
        })),
        totalItem: (p.details || []).length,
        tanggalPermintaan: p.tanggal_permintaan,
        unitKerja: p.pemohon?.unit_kerja || "",
        fotoPemohon: p.pemohon?.foto || "",
        namaPemohon: p.pemohon?.nama || "",
        status: p.status,
        catatan: p.catatan,
        id: p.id, // pastikan id selalu ada
        nomorPermintaan: p.nomor_permintaan || "",
      }));
      setPermintaan(mapped);
      setTotalData(res.data.total || 0);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Gagal memuat daftar permintaan."
      );
    }
    setLoading(false);
  };

  const fetchStatistik = async () => {
    try {
      const res = await permintaanService.getDashboardStatistik();
      setStatistik(res.data);
    } catch (err) {}
  };

  const fetchTrenPermintaan = async () => {
    try {
      const res = await permintaanService.getTrenPermintaanBulanan();
      setTrenPermintaan(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    let filtered = permintaan;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          (item.nomorPermintaan &&
            item.nomorPermintaan
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.namaPemohon &&
            item.namaPemohon
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.unitKerja &&
            item.unitKerja.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }
    setFilteredPermintaan(filtered);
  }, [searchTerm, filterStatus, permintaan]);

  // Modal handlers
  const openDetailModal = async (item) => {
    const id = Number(item?.id);
    if (!item || !id || !Number.isInteger(id) || id <= 0) {
      toast.error("ID permintaan tidak valid.");
      return;
    }
    setLoading(true);
    try {
      const res = await permintaanService.getPermintaanById(id);
      const permintaanDetail = {
        ...res.data,
        items: (res.data.details || res.data.items || []).map((d) => ({
          id: d.id,
          namaBarang: d.barang.nama_barang,
          kodeBarang: d.barang.kode_barang,
          satuan: d.barang.satuan,
          kategori: d.barang.kategori,
          stokTersedia: d.barang.stok,
          jumlahDiminta: d.jumlah_diminta,
          jumlahDisetujui: d.jumlah_disetujui,
        })),
        totalItem: (res.data.details || res.data.items || []).length,
        tanggalPermintaan: res.data.tanggal_permintaan,
        unitKerja: res.data.pemohon?.unit_kerja || "",
        fotoPemohon: res.data.pemohon?.foto || "",
        namaPemohon: res.data.pemohon?.nama || "",
        status: res.data.status,
        catatan: res.data.catatan,
        id: res.data.id,
        nomorPermintaan: res.data.nomor_permintaan || "",
      };
      setSelectedPermintaan(permintaanDetail);
      setShowDetailModal(true);
    } catch (err) {
      toast.error("Gagal memuat detail permintaan.");
    }
    setLoading(false);
  };

  const openVerifikasiModal = async (item) => {
    const id = Number(item?.id);
    if (!item || !id || !Number.isInteger(id) || id <= 0) {
      toast.error("ID permintaan tidak valid.");
      return;
    }
    setLoading(true);
    try {
      const res = await permintaanService.getPermintaanById(id);
      const permintaanDetail = {
        ...res.data,
        items: (res.data.details || res.data.items || []).map((d) => ({
          id: d.id,
          namaBarang: d.barang.nama_barang,
          kodeBarang: d.barang.kode_barang,
          satuan: d.barang.satuan,
          kategori: d.barang.kategori,
          stokTersedia: d.barang.stok,
          jumlahDiminta: d.jumlah_diminta,
          jumlahDisetujui: d.jumlah_disetujui,
        })),
        totalItem: (res.data.details || res.data.items || []).length,
        tanggalPermintaan: res.data.tanggal_permintaan,
        unitKerja: res.data.pemohon?.unit_kerja || "",
        fotoPemohon: res.data.pemohon?.foto || "",
        namaPemohon: res.data.pemohon?.nama || "",
        status: res.data.status,
        catatan: res.data.catatan,
        id: res.data.id,
        nomorPermintaan: res.data.nomor_permintaan || "",
      };
      setSelectedPermintaan(permintaanDetail);
      setVerifikasiData({
        keputusan: "",
        catatanVerifikasi: "",
        items: permintaanDetail.items.map((itm) => ({
          id: itm.id,
          namaBarang: itm.namaBarang,
          jumlahDiminta: itm.jumlahDiminta,
          jumlahDisetujui: itm.jumlahDiminta,
          stokTersedia: itm.stokTersedia,
          satuan: itm.satuan,
        })),
      });
      setShowVerifikasiModal(true);
    } catch (err) {
      toast.error("Gagal memuat detail permintaan untuk verifikasi.");
    }
    setLoading(false);
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
    let apiKeputusan = keputusan;
    if (keputusan === "Disetujui") apiKeputusan = "setuju";
    if (keputusan === "Disetujui Sebagian") apiKeputusan = "sebagian";
    if (keputusan === "Ditolak") apiKeputusan = "tolak";

    let updatedItems = [...verifikasiData.items];
    if (apiKeputusan === "setuju") {
      updatedItems = updatedItems.map((item) => ({
        ...item,
        jumlahDisetujui: item.jumlahDiminta,
      }));
    } else if (apiKeputusan === "tolak") {
      updatedItems = updatedItems.map((item) => ({
        ...item,
        jumlahDisetujui: 0,
      }));
    }
    setVerifikasiData((prev) => ({
      ...prev,
      keputusan: apiKeputusan,
      items: updatedItems,
    }));
  };

  const handleVerifikasiSubmit = async (e) => {
    e.preventDefault();
    if (!verifikasiData.keputusan) {
      toast.error("Pilih keputusan verifikasi!");
      return;
    }
    for (const item of verifikasiData.items) {
      if (item.jumlahDisetujui < 0) {
        toast.error("Jumlah disetujui tidak boleh negatif.");
        return;
      }
      if (item.jumlahDisetujui > item.jumlahDiminta) {
        toast.error(
          `Jumlah disetujui untuk ${item.namaBarang} melebihi jumlah diminta.`
        );
        return;
      }
      if (item.jumlahDisetujui > item.stokTersedia) {
        toast.error(
          `Jumlah disetujui untuk ${item.namaBarang} melebihi stok tersedia.`
        );
        return;
      }
    }
    setLoading(true);
    try {
      await permintaanService.verifikasiPermintaan(selectedPermintaan.id, {
        keputusan: verifikasiData.keputusan,
        catatan_verifikasi: verifikasiData.catatanVerifikasi,
        items: verifikasiData.items.map((item) => ({
          id_detail: item.id,
          jumlah_disetujui: item.jumlahDisetujui,
        })),
      });
      setShowVerifikasiModal(false);
      fetchPermintaan();
      toast.success("Permintaan berhasil diverifikasi!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Gagal memverifikasi permintaan."
      );
    }
    setLoading(false);
  };

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

  const trenChartData = {
    labels: trenPermintaan.map((d) => d.bulan),
    datasets: [
      {
        label: "Jumlah Permintaan",
        data: trenPermintaan.map((d) => d.jumlah),
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 border-b pb-4 flex items-center gap-4">
        <div className="bg-blue-200 text-blue-700 rounded-full p-3 shadow-lg">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Verifikasi Permintaan Barang
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Kelola dan verifikasi permintaan barang dari pegawai secara efisien.{" "}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
              Realtime Update
            </span>
          </p>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statistik ? (
          <>
            <StatCard
              color="blue"
              icon={
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
              }
              label="Total Barang"
              value={statistik.totalBarang}
              info="Semua barang aktif di sistem"
            />
            <StatCard
              color="yellow"
              icon={
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
              }
              label="Permintaan Tertunda"
              value={statistik.totalPermintaanTertunda}
              info="Menunggu verifikasi admin"
            />
            <StatCard
              color="red"
              icon={
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
              }
              label="Barang Kritis"
              value={statistik.totalBarangKritis}
              info="Stok di bawah ambang batas"
            />
            <StatCard
              color="green"
              icon={
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
              }
              label="User Aktif"
              value={statistik.totalUser}
              info="Pegawai terdaftar"
            />
          </>
        ) : (
          <div className="col-span-4 text-center text-gray-400 animate-pulse">
            Memuat statistik...
          </div>
        )}
      </div>
      {/* Grafik tren permintaan bulanan */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M3 3v18h18" />
          </svg>
          Tren Permintaan Bulanan
        </h2>
        <Bar
          data={trenChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `Permintaan: ${context.parsed.y}`,
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: "#e5e7eb" } },
            },
          }}
        />
        <div className="mt-2 text-xs text-gray-400">
          Grafik tren permintaan barang setiap bulan.
        </div>
      </div>
      {/* Controls */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 md:max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor permintaan, nama, atau unit kerja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
      {/* Table */}
      <RequestTable
        permintaan={filteredPermintaan}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onDetail={openDetailModal}
        onVerifikasi={openVerifikasiModal}
        page={page}
        setPage={setPage}
        limit={limit}
        totalData={totalData}
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
