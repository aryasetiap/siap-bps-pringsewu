import React from "react";
import {
  PencilIcon,
  UserMinusIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const UserTable = ({
  users,
  getRoleColor,
  getStatusColor,
  formatDate,
  onEdit,
  onToggleStatus,
  onDelete,
}) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Pengguna
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Unit Kerja
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                Tidak ada data pengguna
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-blue-50 hover:shadow"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden border border-blue-300 shadow-sm">
                      {user.foto ? (
                        <img
                          src={user.foto}
                          alt={user.nama}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-bold text-blue-700">
                          {user.nama
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">
                        {user.nama}
                      </div>
                      <div className="text-xs text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {user.username}
                  </div>
                  <div className="text-xs text-gray-400">
                    Dibuat: {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role === "admin" ? "Administrator" : "Pegawai"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.unitKerja}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status === "aktif" ? "Aktif" : "Non-aktif"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900 transition"
                      title="Edit Pengguna"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user)}
                      className={
                        user.status === "aktif"
                          ? "p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-900 transition"
                          : "p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-900 transition"
                      }
                      title={
                        user.status === "aktif" ? "Nonaktifkan" : "Aktifkan"
                      }
                    >
                      {user.status === "aktif" ? (
                        <UserMinusIcon className="h-5 w-5" />
                      ) : (
                        <UserPlusIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-100 hover:text-red-700 transition"
                      title="Hapus Pengguna"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;
