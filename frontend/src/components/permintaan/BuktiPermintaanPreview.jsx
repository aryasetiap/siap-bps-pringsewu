/**
 * File: BuktiPermintaanPreview.jsx
 *
 * Komponen ini digunakan untuk menampilkan bukti permintaan barang pada aplikasi SIAP BPS Pringsewu.
 * Menampilkan informasi umum permintaan, status, catatan, serta daftar item barang yang diminta dan disetujui.
 *
 * Digunakan dalam proses pengelolaan dan verifikasi permintaan barang oleh unit kerja.
 */

import React from "react";
import {
  DocumentIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

/**
 * Fungsi getStatusColor
 *
 * Fungsi ini digunakan untuk menentukan kelas warna Tailwind CSS berdasarkan status permintaan barang.
 * Warna digunakan untuk membedakan status seperti "Disetujui", "Ditolak", "Menunggu", dll.
 *
 * Parameter:
 * - status (string): Status permintaan barang.
 *
 * Return:
 * - string: Kelas Tailwind CSS untuk warna latar dan teks sesuai status.
 */
const getStatusColor = (status) => {
  if (!status) return "bg-yellow-100 text-yellow-800";

  const statusLower = status.toLowerCase();
  if (statusLower.includes("disetujui sebagian"))
    return "bg-blue-100 text-blue-800";
  if (statusLower.includes("disetujui")) return "bg-green-100 text-green-800";
  if (statusLower.includes("ditolak")) return "bg-red-100 text-red-800";
  if (statusLower.includes("menunggu")) return "bg-yellow-100 text-yellow-800";

  return "bg-gray-100 text-gray-800";
};

/**
 * Fungsi renderItemRow
 *
 * Fungsi ini digunakan untuk merender satu baris item pada tabel permintaan barang.
 * Menampilkan nama barang, jumlah diminta, jumlah disetujui (dengan warna sesuai status), dan satuan.
 *
 * Parameter:
 * - item (Object): Data item barang.
 *   - id (string|number): ID unik barang.
 *   - namaBarang (string): Nama barang.
 *   - jumlahDiminta (number): Jumlah barang yang diminta.
 *   - jumlahDisetujui (number|null): Jumlah barang yang disetujui.
 *   - satuan (string): Satuan barang.
 * - index (number): Index item pada array.
 *
 * Return:
 * - JSX.Element: Baris tabel untuk satu item barang.
 */
const renderItemRow = (item, index) => (
  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{item.namaBarang}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="text-sm text-gray-900 font-medium">
        {item.jumlahDiminta}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      {item.jumlahDisetujui !== null && item.jumlahDisetujui !== undefined ? (
        <span
          className={`text-sm font-medium ${
            item.jumlahDisetujui === 0
              ? "text-red-600"
              : item.jumlahDisetujui < item.jumlahDiminta
              ? "text-orange-600"
              : "text-green-600"
          }`}
        >
          {item.jumlahDisetujui}
        </span>
      ) : (
        <span className="text-sm text-gray-500">-</span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="text-sm text-gray-500">{item.satuan}</div>
    </td>
  </tr>
);

/**
 * Komponen BuktiPermintaanPreview
 *
 * Komponen utama untuk menampilkan seluruh informasi permintaan barang, termasuk header, tabel item, dan footer.
 * Digunakan untuk proses verifikasi dan dokumentasi permintaan barang di aplikasi SIAP BPS Pringsewu.
 *
 * Parameter:
 * - permintaan (Object): Data permintaan barang.
 *   - nomorPermintaan (string): Nomor permintaan barang.
 *   - tanggalPermintaan (string): Tanggal permintaan barang.
 *   - pemohon (Object): Data pemohon (nama, unitKerja).
 *   - status (string): Status permintaan barang.
 *   - catatan (string): Catatan tambahan permintaan.
 *   - items (Array): Daftar item barang yang diminta.
 *
 * Return:
 * - JSX.Element: Tampilan preview bukti permintaan barang.
 */
const BuktiPermintaanPreview = ({ permintaan }) => {
  // Destrukturisasi data permintaan dengan nilai default agar tidak error jika data tidak lengkap
  const {
    nomorPermintaan = "",
    tanggalPermintaan = "",
    pemohon = {},
    status = "",
    catatan = "",
    items = [],
  } = permintaan || {};

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      {/* Header: Informasi umum permintaan barang */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center mb-3">
              <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">
                Bukti Permintaan {nomorPermintaan}
              </h2>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              <span>
                Tanggal:{" "}
                {tanggalPermintaan
                  ? new Date(tanggalPermintaan).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="h-4 w-4 mr-1.5" />
              <span>
                Pemohon:{" "}
                <span className="font-medium">{pemohon?.nama || "-"}</span> (
                {pemohon?.unitKerja || "-"})
              </span>
            </div>
          </div>
          <div className="mt-2 md:mt-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                status
              )}`}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              {status}
            </span>
          </div>
        </div>
        {/* Catatan permintaan, jika ada */}
        {catatan && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-start">
              <PencilSquareIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Catatan:
                </p>
                <p className="text-sm text-gray-700">{catatan}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabel daftar item permintaan barang */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Barang
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Diminta
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Disetujui
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Satuan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render setiap item permintaan barang */}
            {items.map(renderItemRow)}
          </tbody>
        </table>
      </div>

      {/* Footer: Informasi jumlah item dan copyright */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span>Total Item: {items.length}</span>
          <span>SIAP BPS Pringsewu © {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default BuktiPermintaanPreview;
