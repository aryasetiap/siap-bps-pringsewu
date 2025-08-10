import React, { useState } from "react";
import {
  UserIcon,
  KeyIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ProfileForm = ({ profile, onUpdate, onChangePassword, loading }) => {
  const [form, setForm] = useState({
    nama: profile.nama,
    unitKerja: profile.unitKerja,
  });
  const [password, setPassword] = useState({
    passwordBaru: "",
    konfirmasi: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "password"

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) => {
    setPasswordError("");
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (password.passwordBaru.length < 6) {
      setPasswordError("Password harus minimal 6 karakter");
      return;
    }

    if (password.passwordBaru !== password.konfirmasi) {
      setPasswordError("Konfirmasi password tidak cocok!");
      return;
    }

    onChangePassword(password);
    setPassword({ passwordBaru: "", konfirmasi: "" });
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center py-3 px-4 ${
            activeTab === "profile"
              ? "text-blue-600 border-b-2 border-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          } transition`}
        >
          <UserIcon className="h-5 w-5 mr-2" />
          Informasi Profil
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center py-3 px-4 ${
            activeTab === "password"
              ? "text-blue-600 border-b-2 border-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          } transition`}
        >
          <KeyIcon className="h-5 w-5 mr-2" />
          Ubah Password
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === "profile" && (
        <div className="animate-fadeIn">
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
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="animate-fadeIn">
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
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
