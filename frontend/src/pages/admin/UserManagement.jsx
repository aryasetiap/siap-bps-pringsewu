import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import UserTable from "../../components/user/UserTable";
import UserFormModal from "../../components/user/UserFormModal";
import * as userService from "../../services/userService";
import { toast } from "react-toastify";

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "pegawai", label: "Pegawai" },
];

const unitKerjaOptions = [
  "Kepala Kantor",
  "Bagian Umum",
  "Statistik Produksi",
  "Statistik Distribusi",
  "Statistik Sosial",
  "Neraca Wilayah dan Analisis Statistik",
  "Integrasi Pengolahan dan Diseminasi Statistik",
];

const UserManagement = () => {
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

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Gagal memuat data pengguna.");
    }
    setLoading(false);
  };

  // Filter and search
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

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Modal handlers
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
  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      nama: user.nama,
      username: user.username,
      password: "",
      role: user.role,
      unitKerja: user.unitKerja,
      status: user.status,
    });
    setShowModal(true);
  };

  // CRUD handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi manual
    if (
      !formData.nama ||
      !formData.username ||
      !formData.role ||
      !formData.unitKerja
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }
    if (
      modalMode === "add" &&
      (!formData.password || formData.password.length < 6)
    ) {
      toast.error("Password minimal 6 karakter!");
      return;
    }
    setLoading(true);
    try {
      if (modalMode === "add") {
        await userService.createUser(formData);
        toast.success("Pengguna berhasil ditambahkan!");
      } else {
        await userService.updateUser(selectedUser.id, formData);
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

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "aktif" ? false : true;
    if (
      !window.confirm(
        `Apakah Anda yakin ingin ${
          newStatus ? "mengaktifkan" : "menonaktifkan"
        } pengguna ini?`
      )
    )
      return;
    setLoading(true);
    try {
      await userService.toggleUserStatus(user.id, newStatus);
      fetchUsers();
      toast.success("Status pengguna berhasil diubah!");
    } catch (err) {
      toast.error("Gagal mengubah status pengguna.");
    }
    setLoading(false);
  };

  // Badge helpers
  const getRoleColor = (role) =>
    role === "admin"
      ? "text-purple-700 bg-purple-100"
      : "text-blue-700 bg-blue-100";
  const getStatusColor = (status) =>
    status === "aktif"
      ? "text-green-700 bg-green-100"
      : "text-red-700 bg-red-100";
  const formatDate = (dateString) => {
    if (dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <p className="text-gray-600">
          Kelola akun pengguna sistem SIAP BPS Pringsewu
        </p>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Total Pengguna
              </p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Administrator</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter((user) => user.role === "admin").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Pengguna Aktif
              </p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter((user) => user.status === "aktif").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Unit Kerja</p>
              <p className="text-2xl font-bold text-orange-600">
                {unitKerjaOptions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, username, atau unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Role</option>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non-aktif</option>
            </select>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Tambah Pengguna
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <UserTable
        users={filteredUsers}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
      />
      {/* Add/Edit Modal */}
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
    </div>
  );
};

export default UserManagement;
