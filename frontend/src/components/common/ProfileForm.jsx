import React, { useState } from "react";
const ProfileForm = ({ profile, onUpdate, onChangePassword, loading }) => {
  const [form, setForm] = useState({
    nama: profile.nama,
    unitKerja: profile.unitKerja,
  });
  const [password, setPassword] = useState({
    passwordBaru: "",
    konfirmasi: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPassword({ ...password, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.passwordBaru !== password.konfirmasi) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    onChangePassword(password);
    setPassword({ passwordBaru: "", konfirmasi: "" });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
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
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru
          </label>
          <input
            type="password"
            name="passwordBaru"
            value={password.passwordBaru}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Ubah Password"}
        </button>
      </form>
    </div>
  );
};
export default ProfileForm;
