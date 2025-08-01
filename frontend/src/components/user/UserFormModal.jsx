import React from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

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
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
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
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {mode === "add" && (
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
            )}
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
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            {mode === "edit" && (
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
            )}
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
                {unitKerjaOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
