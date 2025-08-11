/**
 * Komponen ProfileForm digunakan untuk menampilkan dan mengelola form profil pengguna
 * pada aplikasi SIAP. Pengguna dapat memperbarui informasi profil dan mengubah password.
 * Komponen ini terdiri dari dua tab: Informasi Profil dan Ubah Password.
 *
 * Parameter:
 * - profile (Object): Data profil pengguna yang berisi nama dan unit kerja.
 * - onUpdate (Function): Fungsi callback untuk menyimpan perubahan profil.
 * - onChangePassword (Function): Fungsi callback untuk mengubah password.
 * - loading (Boolean): Status loading untuk menonaktifkan tombol saat proses berlangsung.
 *
 * Return:
 * - JSX: Komponen form profil dan ubah password.
 */

import React, { useState } from "react";
import {
  UserIcon,
  KeyIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/**
 * ProfileForm
 * Komponen utama untuk form profil dan ubah password pengguna.
 *
 * Parameter:
 * - profile (Object): Data profil pengguna.
 * - onUpdate (Function): Fungsi untuk update profil.
 * - onChangePassword (Function): Fungsi untuk ubah password.
 * - loading (Boolean): Status loading tombol.
 *
 * Return:
 * - JSX: Form profil dan ubah password.
 */
const ProfileForm = ({ profile, onUpdate, onChangePassword, loading }) => {
  // State untuk form profil
  const [form, setForm] = useState({
    nama: profile.nama,
    unitKerja: profile.unitKerja,
  });

  // State untuk form password
  const [password, setPassword] = useState({
    passwordBaru: "",
    konfirmasi: "",
  });

  // State untuk error password
  const [passwordError, setPasswordError] = useState("");

  // State untuk tab aktif
  const [activeTab, setActiveTab] = useState("profile"); // "profile" atau "password"

  /**
   * handleChange
   * Fungsi untuk menangani perubahan input pada form profil.
   *
   * Parameter:
   * - e (Event): Event perubahan input.
   *
   * Return:
   * - void
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * handlePasswordChange
   * Fungsi untuk menangani perubahan input pada form password.
   * Menghapus pesan error saat ada perubahan.
   *
   * Parameter:
   * - e (Event): Event perubahan input.
   *
   * Return:
   * - void
   */
  const handlePasswordChange = (e) => {
    setPasswordError("");
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit
   * Fungsi untuk submit form profil.
   * Memanggil fungsi onUpdate dari parent.
   *
   * Parameter:
   * - e (Event): Event submit form.
   *
   * Return:
   * - void
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  /**
   * handlePasswordSubmit
   * Fungsi untuk submit form ubah password.
   * Melakukan validasi password sebelum mengirim ke parent.
   *
   * Parameter:
   * - e (Event): Event submit form.
   *
   * Return:
   * - void
   */
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validasi panjang password minimal 6 karakter
    if (password.passwordBaru.length < 6) {
      setPasswordError("Password harus minimal 6 karakter");
      return;
    }

    // Validasi konfirmasi password
    if (password.passwordBaru !== password.konfirmasi) {
      setPasswordError("Konfirmasi password tidak cocok!");
      return;
    }

    onChangePassword(password);
    setPassword({ passwordBaru: "", konfirmasi: "" });
  };

  return (
    <div>
      {/* Tab navigasi untuk form profil dan ubah password */}
      <div className="flex mb-6 border-b border-gray-200">
        <TabButton
          isActive={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
          icon={<UserIcon className="h-5 w-5 mr-2" />}
          label="Informasi Profil"
        />
        <TabButton
          isActive={activeTab === "password"}
          onClick={() => setActiveTab("password")}
          icon={<KeyIcon className="h-5 w-5 mr-2" />}
          label="Ubah Password"
        />
      </div>

      {/* Tab Informasi Profil */}
      {activeTab === "profile" && (
        <div className="animate-fadeIn">
          <ProfileInfoForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      )}

      {/* Tab Ubah Password */}
      {activeTab === "password" && (
        <div className="animate-fadeIn">
          <PasswordForm
            password={password}
            passwordError={passwordError}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

/**
 * TabButton
 * Komponen tombol tab navigasi.
 *
 * Parameter:
 * - isActive (Boolean): Status aktif tab.
 * - onClick (Function): Fungsi klik tab.
 * - icon (JSX): Ikon tab.
 * - label (String): Label tab.
 *
 * Return:
 * - JSX: Tombol tab.
 */
const TabButton = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center py-3 px-4 ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
        : "text-gray-500 hover:text-gray-700"
    } transition`}
    type="button"
  >
    {icon}
    {label}
  </button>
);

/**
 * ProfileInfoForm
 * Komponen form untuk informasi profil pengguna.
 *
 * Parameter:
 * - form (Object): State form profil.
 * - handleChange (Function): Fungsi perubahan input.
 * - handleSubmit (Function): Fungsi submit form.
 * - loading (Boolean): Status loading tombol.
 *
 * Return:
 * - JSX: Form profil.
 */
const ProfileInfoForm = ({ form, handleChange, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nama Lengkap
      </label>
      <input
        type="text"
        name="nama"
        value={form.nama}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Unit Kerja
      </label>
      <input
        type="text"
        name="unitKerja"
        value={form.unitKerja}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        required
      />
    </div>
    <div className="pt-4">
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Menyimpan...
          </>
        ) : (
          <>
            <CheckIcon className="h-4 w-4 mr-2" />
            Simpan Perubahan
          </>
        )}
      </button>
    </div>
  </form>
);

/**
 * PasswordForm
 * Komponen form untuk ubah password pengguna.
 *
 * Parameter:
 * - password (Object): State form password.
 * - passwordError (String): Pesan error password.
 * - handlePasswordChange (Function): Fungsi perubahan input password.
 * - handlePasswordSubmit (Function): Fungsi submit form password.
 * - loading (Boolean): Status loading tombol.
 *
 * Return:
 * - JSX: Form ubah password.
 */
const PasswordForm = ({
  password,
  passwordError,
  handlePasswordChange,
  handlePasswordSubmit,
  loading,
}) => (
  <form onSubmit={handlePasswordSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Password Baru
      </label>
      <input
        type="password"
        name="passwordBaru"
        value={password.passwordBaru}
        onChange={handlePasswordChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        required
      />
      <p className="mt-1 text-xs text-gray-500">Minimal 6 karakter</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Konfirmasi Password Baru
      </label>
      <input
        type="password"
        name="konfirmasi"
        value={password.konfirmasi}
        onChange={handlePasswordChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        required
      />
    </div>
    {/* Menampilkan error jika validasi gagal */}
    {passwordError && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
        <p className="text-sm text-red-600">{passwordError}</p>
      </div>
    )}
    <div className="pt-4">
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Menyimpan...
          </>
        ) : (
          <>
            <KeyIcon className="h-4 w-4 mr-2" />
            Ubah Password
          </>
        )}
      </button>
    </div>
  </form>
);

export default ProfileForm;
