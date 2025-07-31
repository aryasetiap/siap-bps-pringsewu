import React, { useState } from "react";
import api from "../../services/api";
import LaporanFilterForm from "../../components/laporan/LaporanFilterForm";
import LaporanTable from "../../components/laporan/LaporanTable";
import { toast } from "react-toastify";

const LaporanPeriodik = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih rentang tanggal!");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(
        `/laporan/penggunaan?start=${startDate}&end=${endDate}`
      );
      setData(res.data);
    } catch (err) {
      toast.error("Gagal memuat data laporan.");
    }
    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih rentang tanggal!");
      return;
    }
    try {
      const res = await api.get(
        `/laporan/penggunaan/pdf?start=${startDate}&end=${endDate}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Penggunaan_${startDate}_${endDate}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Gagal mengunduh PDF.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Laporan Periodik Penggunaan Barang
      </h1>
      <LaporanFilterForm
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onFilter={handleFilter}
        onExportPDF={handleExportPDF}
        loading={loading}
      />
      <LaporanTable data={data} loading={loading} />
    </div>
  );
};

export default LaporanPeriodik;
