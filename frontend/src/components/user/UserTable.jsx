/**
 * ============================================================
 * Komponen UserTable
 * ============================================================
 * Komponen ini digunakan untuk menampilkan daftar pengguna dalam aplikasi SIAP.
 * Tabel ini memuat informasi pengguna seperti nama, username, role, unit kerja, status, dan aksi yang dapat dilakukan.
 * Mendukung pengelolaan pengguna seperti edit, aktivasi/non-aktivasi, dan penghapusan.
 *
 * Parameter:
 * - users (Array<Object>): Daftar data pengguna yang akan ditampilkan.
 * - getRoleColor (Function): Fungsi untuk menentukan warna label berdasarkan role pengguna.
 * - getStatusColor (Function): Fungsi untuk menentukan warna label berdasarkan status pengguna.
 * - formatDate (Function): Fungsi untuk memformat tanggal pembuatan akun.
 * - onEdit (Function): Fungsi callback ketika tombol edit ditekan.
 * - onToggleStatus (Function): Fungsi callback ketika tombol aktivasi/non-aktivasi ditekan.
 * - onDelete (Function): Fungsi callback ketika tombol hapus ditekan.
 *
 * Return:
 * - React.Element: Tabel pengguna yang interaktif.
 */

import React from "react";
import {
  PencilIcon,
  UserMinusIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

/**
 * ============================================================
 * Komponen UserTable
 * ============================================================
 * Komponen utama untuk menampilkan tabel data pengguna SIAP.
 *
 * Parameter:
 * - users (Array<Object>): Daftar pengguna.
 * - getRoleColor (Function): Fungsi penentu warna label role.
 * - getStatusColor (Function): Fungsi penentu warna label status.
 * - formatDate (Function): Fungsi pemformat tanggal.
 * - onEdit (Function): Callback edit pengguna.
 * - onToggleStatus (Function): Callback aktivasi/non-aktivasi pengguna.
 * - onDelete (Function): Callback hapus pengguna.
 *
 * Return:
 * - React.Element: Tabel pengguna.
 */
const UserTable = ({
  users,
  getRoleColor,
  getStatusColor,
  formatDate,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  /**
   * ============================================================
   * Fungsi renderFoto
   * ============================================================
   * Menampilkan foto pengguna jika tersedia, atau inisial nama jika tidak ada foto.
   *
   * Parameter:
   * - user (Object): Data pengguna.
   *
   * Return:
   * - React.Element: Elemen foto atau inisial pengguna.
   */
  const renderFoto = (user) => {
    if (user.foto) {
      return (
        <img
          src={user.foto}
          alt={user.nama}
          className="h-10 w-10 object-cover rounded-full"
        />
      );
    }
    // Ambil dua huruf pertama dari nama sebagai inisial
    const inisial = user.nama
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
    return <span className="text-sm font-bold text-blue-700">{inisial}</span>;
  };

  /**
   * ============================================================
   * Fungsi renderRoleLabel
   * ============================================================
   * Menampilkan label role pengguna dengan warna sesuai.
   *
   * Parameter:
   * - role (string): Role pengguna.
   *
   * Return:
   * - React.Element: Label role.
   */
  const renderRoleLabel = (role) => (
    <span
      className={`inline-flex px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getRoleColor(
        role
      )}`}
    >
      {role === "admin" ? "Administrator" : "Pegawai"}
    </span>
  );

  /**
   * ============================================================
   * Fungsi renderStatusLabel
   * ============================================================
   * Menampilkan label status pengguna dengan warna sesuai.
   *
   * Parameter:
   * - status (string): Status pengguna.
   *
   * Return:
   * - React.Element: Label status.
   */
  const renderStatusLabel = (status) => (
    <span
      className={`inline-flex px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(
        status
      )}`}
    >
      {status === "aktif" ? "Aktif" : "Non-aktif"}
    </span>
  );

  /**
   * ============================================================
   * Fungsi renderAksi
   * ============================================================
   * Menampilkan tombol aksi edit, aktivasi/non-aktivasi, dan hapus pada setiap baris pengguna.
   *
   * Parameter:
   * - user (Object): Data pengguna.
   *
   * Return:
   * - React.Element: Tombol aksi.
   */
  const renderAksi = (user) => (
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
        title={user.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
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
  );

  /**
   * ============================================================
   * Render utama tabel pengguna
   * ============================================================
   * Menampilkan tabel dengan data pengguna, atau pesan jika data kosong.
   */
  return (
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
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  {/* Tampilkan pesan jika tidak ada data pengguna */}
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
                        {renderFoto(user)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {user.nama}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.id}
                        </div>
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
                    {renderRoleLabel(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.unitKerja}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusLabel(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {renderAksi(user)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
