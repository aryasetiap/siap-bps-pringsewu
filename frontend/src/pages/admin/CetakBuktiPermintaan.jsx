import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BuktiPermintaanPreview from "../../components/permintaan/BuktiPermintaanPreview";
import { toast } from "react-toastify";

const CetakBuktiPermintaan = () => {
  const { id } = useParams();
  const [permintaan, setPermintaan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPermintaan();
  }, [id]);

  const fetchPermintaan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/permintaan/${id}`);
      setPermintaan(res.data);
    } catch (err) {
      toast.error("Gagal memuat detail permintaan.");
    }
    setLoading(false);
  };

  const handleCetakPDF = async () => {
    try {
      const res = await axios.get(`/api/permintaan/${id}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bukti_Permintaan_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Gagal mengunduh PDF.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cetak Bukti Permintaan</h1>
      {loading ? (
        <div className="p-8 text-center text-blue-600">Memuat data...</div>
      ) : permintaan ? (
        <>
          <BuktiPermintaanPreview permintaan={permintaan} />
          <button
            onClick={handleCetakPDF}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Cetak PDF
          </button>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">
          Data tidak ditemukan
        </div>
      )}
    </div>
  );
};

export default CetakBuktiPermintaan;
