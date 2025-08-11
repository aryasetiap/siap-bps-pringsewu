import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  getLaporanPenggunaanJSON,
  getLaporanPenggunaanPDF,
} from "../../services/barangService";
import LaporanFilterForm from "../../components/laporan/LaporanFilterForm";
import LaporanTable from "../../components/laporan/LaporanTable";

const LaporanPeriodik = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih rentang tanggal!");
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("start", startDate);
      queryParams.append("end", endDate);
      if (unitKerja) {
        queryParams.append("unit_kerja", unitKerja);
      }

      const response = await getLaporanPenggunaanJSON(queryParams);
      setData(response.data);
      if (response.data.length === 0) {
        toast.info("Tidak ada data dalam rentang tanggal tersebut");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih rentang tanggal!");
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("start", startDate);
      queryParams.append("end", endDate);
      if (unitKerja) {
        queryParams.append("unit_kerja", unitKerja);
      }

      const res = await getLaporanPenggunaanPDF(queryParams);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Penggunaan_${startDate}_${endDate}${
          unitKerja ? "_" + unitKerja.replace(/\s+/g, "_") : ""
        }.pdf`
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
        unitKerja={unitKerja}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setUnitKerja={setUnitKerja}
        onFilter={handleFilter}
        onExportPDF={handleExportPDF}
        loading={loading}
      />
      <LaporanTable data={data} loading={loading} />
    </div>
  );
};

export default LaporanPeriodik;
