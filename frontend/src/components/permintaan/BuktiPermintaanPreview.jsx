import React from "react";
const BuktiPermintaanPreview = ({ permintaan }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="mb-2">
      <div className="text-sm text-gray-600">
        Nomor:{" "}
        <span className="font-semibold">{permintaan.nomorPermintaan}</span>
      </div>
      <div className="text-sm text-gray-600">
        Tanggal:{" "}
        {new Date(permintaan.tanggalPermintaan).toLocaleString("id-ID")}
      </div>
      <div className="text-sm text-gray-600">
        Pemohon: {permintaan.pemohon?.nama} ({permintaan.pemohon?.unitKerja})
      </div>
      <div className="text-sm text-gray-600">
        Status: <span className="font-semibold">{permintaan.status}</span>
      </div>
      <div className="text-sm text-gray-600">
        Catatan: {permintaan.catatan || "-"}
      </div>
    </div>
    <table className="min-w-full divide-y divide-gray-200 mb-4">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Barang
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Jumlah Diminta
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Jumlah Disetujui
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Satuan
          </th>
        </tr>
      </thead>
      <tbody>
        {permintaan.items.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-2">{item.namaBarang}</td>
            <td className="px-4 py-2">{item.jumlahDiminta}</td>
            <td className="px-4 py-2">{item.jumlahDisetujui ?? "-"}</td>
            <td className="px-4 py-2">{item.satuan}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default BuktiPermintaanPreview;
