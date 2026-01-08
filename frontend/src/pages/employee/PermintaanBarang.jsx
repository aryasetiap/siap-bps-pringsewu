import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBarangWithoutPagination } from "../../services/barangService";

const Barang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBarang = async () => {
      setLoading(true);
      try {
        // Gunakan endpoint tanpa pagination untuk pegawai
        const res = await getAllBarangWithoutPagination({
          status_aktif: true,
        });
        setBarang(res.data);
      } catch (err) {
        toast.error("Gagal memuat data barang.");
      }
      setLoading(false);
    };

    fetchBarang();
  }, []);

  return (
    <div>
      <h2>Barang</h2>
      <ul>
        {barang.map((barang) => (
          <li key={barang.id}>{barang.nama}</li>
        ))}
      </ul>
    </div>
  );
};

export default Barang;
