/**
 * Halaman Manajemen Pengguna SIAP BPS Pringsewu.
 *
 * Digunakan untuk mengelola data akun pengguna, termasuk penambahan, pengeditan, penghapusan (nonaktif), dan pengubahan status aktif/nonaktif.
 * Fitur utama: pencarian, filter, statistik pengguna, dan modal konfirmasi.
 *
 * Komponen utama:
 * - UserTable: Tabel daftar pengguna
 * - UserFormModal: Modal tambah/edit pengguna
 *
 * Konteks bisnis: Pengelolaan akun pegawai/admin untuk akses sistem SIAP (Statistik Integrasi dan Analisis Pringsewu).
 */

import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import UserTable from "../../components/user/UserTable";
import UserFormModal from "../../components/user/UserFormModal";
import * as userService from "../../services/userService";
import { toast } from "react-toastify";

// Opsi role pengguna
const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "pegawai", label: "Pegawai" },
];

// Opsi unit kerja pengguna
const unitKerjaOptions = [
  "Kepala Kantor",
  "Bagian Umum",
  "Statistik Produksi",
  "Statistik Distribusi",
  "Statistik Sosial",
  "Neraca Wilayah dan Analisis Statistik",
  "Integrasi Pengolahan dan Diseminasi Statistik",
];

/**
 * Komponen utama untuk manajemen pengguna.
 *
 * State:
 * - users: Daftar semua pengguna
 * - filteredUsers: Daftar pengguna setelah filter dan pencarian
 * - searchTerm: Kata kunci pencarian
 * - filterRole: Filter berdasarkan role
 * - filterStatus: Filter berdasarkan status aktif/nonaktif
 * - showModal: Status modal tambah/edit
 * - modalMode: Mode modal ("add" atau "edit")
 * - selectedUser: Data pengguna yang dipilih untuk edit
 * - loading: Status loading proses
 * - formData: Data form tambah/edit pengguna
 * - showConfirmModal: Status modal konfirmasi
 * - confirmAction: Jenis aksi konfirmasi ("delete" atau "toggle")
 * - confirmUser: Data pengguna yang dikonfirmasi
 */
const UserManagement = () => {
  // State utama
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
    unitKerja: "",
    status: "aktif",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  /**
   * Mengambil data semua pengguna dari API saat komponen pertama kali di-mount.
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fungsi untuk mengambil data pengguna dari API dan mapping ke format frontend.
   *
   * Return:
   * - void
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      // Mapping data API ke struktur frontend
      const mapped = res.data.map((u) => ({
        id: u.id,
        nama: u.nama,
        username: u.username,
        role: u.role,
        unitKerja: u.unit_kerja || "",
        status: u.status_aktif ? "aktif" : "nonaktif",
        foto: u.foto || "",
        createdAt: u.created_at,
        updatedAt: u.updated_at,
        lastLogin: u.last_login || "-", // default jika tidak ada
      }));
      setUsers(mapped);
    } catch (err) {
      toast.error("Gagal memuat data pengguna.");
    }
    setLoading(false);
  };

  /**
   * Melakukan filter dan pencarian pada daftar pengguna setiap kali state terkait berubah.
   *
   * Parameter:
   * - searchTerm (string): Kata kunci pencarian
   * - filterRole (string): Role yang difilter
   * - filterStatus (string): Status yang difilter
   * - users (array): Daftar pengguna
   *
   * Return:
   * - void
   */
  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.unitKerja.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }
    if (filterStatus) {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, filterStatus, users]);

  /**
   * Handler untuk perubahan input form tambah/edit pengguna.
   *
   * Parameter:
   * - e (SyntheticEvent): Event perubahan input
   *
   * Return:
   * - void
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Membuka modal tambah pengguna dan reset form.
   *
   * Return:
   * - void
   */
  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      nama: "",
      username: "",
      password: "",
      role: "",
      unitKerja: "",
      status: "aktif",
    });
    setShowModal(true);
  };

  /**
   * Membuka modal edit pengguna dan mengambil detail pengguna dari API.
   *
   * Parameter:
   * - user (object): Data pengguna yang akan diedit
   *
   * Return:
   * - void
   */
  const openEditModal = async (user) => {
    setModalMode("edit");
    setLoading(true);
    try {
      const res = await userService.getUserById(user.id);
      const detail = res.data;
      setSelectedUser(detail);
      setFormData({
        nama: detail.nama,
        username: detail.username,
        password: "",
        role: detail.role,
        unitKerja: detail.unit_kerja || "",
        status: detail.status_aktif ? "aktif" : "nonaktif",
        foto: detail.foto || "",
      });
      setShowModal(true);
    } catch (err) {
      toast.error("Gagal mengambil detail pengguna.");
    }
    setLoading(false);
  };

  /**
   * Membuka modal konfirmasi untuk aksi delete/toggle status.
   *
   * Parameter:
   * - action (string): Jenis aksi ("delete" atau "toggle")
   * - user (object): Data pengguna yang akan dikonfirmasi
   *
   * Return:
   * - void
   */
  const openConfirmModal = (action, user) => {
    setConfirmAction(action);
    setConfirmUser(user);
    setShowConfirmModal(true);
  };

  /**
   * Handler submit form tambah/edit pengguna.
   * Melakukan validasi manual sebelum request ke API.
   *
   * Parameter:
   * - e (SyntheticEvent): Event submit form
   *
   * Return:
   * - void
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi field wajib
    if (!formData.nama || !formData.role || !formData.unitKerja) {
      toast.error("Semua field wajib diisi!");
      return;
    }
    // Validasi field khusus tambah
    if (
      modalMode === "add" &&
      (!formData.username || !formData.password || formData.password.length < 6)
    ) {
      toast.error(
        "Username dan password wajib diisi (password min. 6 karakter)!"
      );
      return;
    }
    setLoading(true);
    try {
      let payload;
      if (modalMode === "add") {
        payload = {
          nama: formData.nama,
          username: formData.username,
          password: formData.password,
          role: formData.role,
          unit_kerja: formData.unitKerja,
          foto: formData.foto || undefined,
        };
        await userService.createUser(payload);
        toast.success("Pengguna berhasil ditambahkan!");
      } else {
        // Saat edit, username tidak boleh diubah
        payload = {
          nama: formData.nama,
          password: formData.password || undefined,
          role: formData.role,
          unit_kerja: formData.unitKerja,
          status_aktif: formData.status === "aktif",
          foto: formData.foto || undefined,
        };
        await userService.updateUser(selectedUser.id, payload);
        toast.success("Pengguna berhasil diupdate!");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Gagal menyimpan data pengguna."
      );
    }
    setLoading(false);
  };

  /**
   * Handler untuk menghapus (menonaktifkan) pengguna.
   *
   * Return:
   * - void
   */
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await userService.deleteUserById(confirmUser.id);
      toast.success("Pengguna berhasil dihapus (nonaktif).");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal menghapus pengguna.");
    }
    setLoading(false);
    setShowConfirmModal(false);
  };

  /**
   * Handler untuk mengubah status aktif/nonaktif pengguna.
   *
   * Return:
   * - void
   */
  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await userService.updateUser(confirmUser.id, {
        status_aktif: confirmUser.status !== "aktif",
      });
      fetchUsers();
      toast.success("Status pengguna berhasil diubah!");
    } catch (err) {
      toast.error("Gagal mengubah status pengguna.");
    }
    setLoading(false);
    setShowConfirmModal(false);
  };

  /**
   * Mendapatkan warna badge berdasarkan role.
   *
   * Parameter:
   * - role (string): Role pengguna
   *
   * Return:
   * - string: Kelas warna Tailwind
   */
  const getRoleColor = (role) =>
    role === "admin"
      ? "text-purple-700 bg-purple-100"
      : "text-blue-700 bg-blue-100";

  /**
   * Mendapatkan warna badge berdasarkan status.
   *
   * Parameter:
   * - status (string): Status pengguna
   *
   * Return:
   * - string: Kelas warna Tailwind
   */
  const getStatusColor = (status) =>
    status === "aktif"
      ? "text-green-700 bg-green-100"
      : "text-red-700 bg-red-100";

  /**
   * Format tanggal ke format lokal Indonesia.
   *
   * Parameter:
   * - dateString (string): Tanggal dalam format ISO
   *
   * Return:
   * - string: Tanggal terformat (dd-mm-yyyy)
   */
  const formatDate = (dateString) => {
    if (dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Render UI
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center space-x-3">
        <UsersIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Kelola akun pengguna sistem SIAP BPS Pringsewu secara efisien dan aman.
      </p>
      {/* Statistik Pengguna */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow border flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Admin</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter((user) => user.role === "admin").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ShieldCheckIcon className="w-7 h-7 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Pegawai</p>
            <p className="text-2xl font-bold text-blue-600">
              {users.filter((user) => user.role === "pegawai").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="w-7 h-7 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Nonaktif</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter((user) => user.status === "nonaktif").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <TrashIcon className="w-7 h-7 text-red-600" />
          </div>
        </div>
      </div>
      {/* Kontrol Filter dan Tambah */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="relative flex-1 md:max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, username, atau unit kerja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-4">
          <select
            name="filterRole"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Role</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <select
            name="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non-aktif</option>
          </select>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Tambah Pengguna
          </button>
        </div>
      </div>
      {/* Tabel Pengguna */}
      <UserTable
        users={filteredUsers}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onEdit={openEditModal}
        onToggleStatus={(user) => openConfirmModal("toggle", user)}
        onDelete={(user) => openConfirmModal("delete", user)}
      />
      {/* Modal Tambah/Edit Pengguna */}
      <UserFormModal
        show={showModal}
        mode={modalMode}
        formData={formData}
        roleOptions={roleOptions}
        unitKerjaOptions={unitKerjaOptions}
        loading={loading}
        onChange={handleInputChange}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
      {/* Modal Konfirmasi Aksi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
              onClick={() => setShowConfirmModal(false)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {confirmAction === "delete"
                ? "Konfirmasi Hapus Pengguna"
                : confirmUser.status === "aktif"
                ? "Konfirmasi Nonaktifkan Pengguna"
                : "Konfirmasi Aktifkan Pengguna"}
            </h3>
            <p className="mb-6 text-gray-600">
              {confirmAction === "delete"
                ? `Apakah Anda yakin ingin menghapus (nonaktifkan) pengguna "${confirmUser.nama}"?`
                : confirmUser.status === "aktif"
                ? `Apakah Anda yakin ingin menonaktifkan pengguna "${confirmUser.nama}"?`
                : `Apakah Anda yakin ingin mengaktifkan kembali pengguna "${confirmUser.nama}"?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={
                  confirmAction === "delete"
                    ? handleDeleteUser
                    : handleToggleStatus
                }
                className={`px-4 py-2 ${
                  confirmAction === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg disabled:opacity-50 transition`}
              >
                {loading
                  ? "Memproses..."
                  : confirmAction === "delete"
                  ? "Hapus"
                  : confirmUser.status === "aktif"
                  ? "Nonaktifkan"
                  : "Aktifkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
