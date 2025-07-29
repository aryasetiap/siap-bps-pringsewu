import React from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const BarangTable = ({
  data,
  onEdit,
  onDelete,
  onTambahStok,
  getStatusColor,
  getStatusText,
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kode Barang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Barang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.kode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.nama}
                  </div>
                  <div className="text-sm text-gray-500">{item.satuan}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.kategori}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {item.stok} {item.satuan}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {item.stokMinimum} {item.satuan}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    item.stok,
                    item.stokMinimum
                  )}`}
                >
                  {getStatusText(item.stok, item.stokMinimum)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Barang"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onTambahStok(item)}
                    className="text-green-600 hover:text-green-900"
                    title="Tambah Stok"
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Hapus Barang"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default BarangTable;
