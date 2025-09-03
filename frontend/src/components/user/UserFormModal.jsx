/**
 * File: UserFormModal.jsx
 * Komponen ini digunakan untuk menampilkan modal form tambah/edit pengguna
 * dalam aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * Modal ini mendukung pengelolaan data pengguna, termasuk penambahan, pengeditan,
 * pengaturan status, role, dan unit kerja pengguna.
 */

import React from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

/**
 * Komponen UserFormModal
 * Menampilkan modal form untuk tambah/edit pengguna.
 *
 * Parameter:
 * - show (boolean): Menentukan apakah modal ditampilkan.
 * - mode ('add'|'edit'): Mode form, 'add' untuk tambah pengguna, 'edit' untuk edit pengguna.
 * - formData (object): Data pengguna yang sedang diedit atau ditambah.
 * - roleOptions (array): Daftar opsi role pengguna.
 * - unitKerjaOptions (array): Daftar opsi unit kerja.
 * - loading (boolean): Status loading saat proses submit.
 * - onChange (function): Handler perubahan input form.
 * - onClose (function): Handler untuk menutup modal.
 * - onSubmit (function): Handler submit form.
 *
 * Return:
 * - React.Element: Modal form pengguna.
 */
const UserFormModal = ({
  show,
  mode,
  formData,
  roleOptions,
  unitKerjaOptions,
  loading,
  onChange,
  onClose,
  onSubmit,
}) => {
  // Jika modal tidak ditampilkan, return null
  if (!show) return null;

  /**
   * Fungsi renderUsernameInput
   * Menampilkan input username hanya pada mode tambah pengguna.
   *
   * Return:
   * - React.Element: Input username.
   */
  const renderUsernameInput = () => (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Username
      </label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Username"
        required
      />
    </div>
  );

  /**
   * Fungsi renderStatusInput
   * Menampilkan input status hanya pada mode edit pengguna.
   *
   * Return:
   * - React.Element: Input status.
   */
  const renderStatusInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Status
      </label>
      <select
        name="status"
        value={formData.status}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Non-aktif</option>
      </select>
    </div>
  );

  /**
   * Fungsi renderRoleOptions
   * Membuat daftar opsi role pengguna.
   *
   * Return:
   * - Array<React.Element>: Opsi role.
   */
  const renderRoleOptions = () =>
    roleOptions.map((role) => (
      <option key={role.value} value={role.value}>
        {role.label}
      </option>
    ));

  /**
   * Fungsi renderUnitKerjaOptions
   * Membuat daftar opsi unit kerja pengguna.
   *
   * Return:
   * - Array<React.Element>: Opsi unit kerja.
   */
  const renderUnitKerjaOptions = () =>
    unitKerjaOptions.map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        {/* Tombol tutup modal */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
        {/* Header modal: ikon dan judul */}
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3 shadow">
            {mode === "add" ? (
              <PlusIcon className="h-6 w-6" />
            ) : (
              <PencilIcon className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {mode === "add" ? "Tambah Pengguna Baru" : "Edit Pengguna"}
          </h3>
        </div>
        {/* Form pengguna */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input nama lengkap */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama lengkap"
                required
                autoFocus
              />
            </div>
            {/* Input username hanya pada mode tambah */}
            {mode === "add" && renderUsernameInput()}
            {/* Input password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {mode === "add" ? "Password" : "Password Baru"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required={mode === "add"}
              />
            </div>
            {/* Input role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Role</option>
                {renderRoleOptions()}
              </select>
            </div>
            {/* Input status hanya pada mode edit */}
            {mode === "edit" && renderStatusInput()}
            {/* Input unit kerja */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Kerja
              </label>
              <select
                name="unitKerja"
                value={formData.unitKerja}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Unit Kerja</option>
                {renderUnitKerjaOptions()}
              </select>
            </div>
          </div>
          {/* Tombol aksi */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Menyimpan..." : mode === "add" ? "Tambah" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
