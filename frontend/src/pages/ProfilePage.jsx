/**
 * Halaman ProfilePage untuk aplikasi SIAP.
 *
 * Digunakan untuk menampilkan dan mengelola data profil pengguna, termasuk:
 * - Melihat detail profil (nama, username, unit kerja, role, foto)
 * - Mengubah data profil
 * - Mengubah password
 * - Mengunggah foto profil
 *
 * Parameter: Tidak ada parameter langsung (menggunakan state dan props internal)
 *
 * Return:
 * - Komponen React yang menampilkan halaman profil pengguna
 */

import React, { useEffect, useState } from "react";
import ProfileForm from "../components/common/ProfileForm";
import { toast } from "react-toastify";
import * as userService from "../services/userService";
import {
  UserIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

/**
 * Komponen utama halaman profil pengguna.
 *
 * State:
 * - profile: Data profil pengguna yang sedang login
 * - loading: Status loading untuk proses fetch/update
 * - error: Pesan error jika terjadi kegagalan
 * - photoLoading: Status loading khusus untuk upload foto
 */
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Fetch data profil saat komponen pertama kali di-mount
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Mengambil data profil pengguna dari API.
   *
   * Parameter: Tidak ada
   *
   * Return:
   * - void (mengubah state profile, loading, error)
   */
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getProfile();

      // Mapping dari response API ke format yang digunakan oleh ProfileForm
      const userData = {
        id: response.data.id,
        nama: response.data.nama,
        username: response.data.username,
        unitKerja: response.data.unit_kerja || "",
        role: response.data.role,
        foto: response.data.foto || null,
        createdAt: response.data.created_at,
      };

      setProfile(userData);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Gagal memuat data profil");

      // Penanganan error spesifik sesuai status kode API
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Sesi login Anda telah berakhir. Silakan login kembali.");
          // window.location.href = "/login"; // Redirect jika diperlukan
        } else if (err.response.status === 403) {
          toast.error("Anda tidak memiliki izin untuk mengakses data ini.");
        } else {
          toast.error(err.response.data?.message || "Gagal memuat profil.");
        }
      } else if (err.request) {
        toast.error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        toast.error("Terjadi kesalahan saat memuat profil.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mengupdate data profil pengguna ke API.
   *
   * Parameter:
   * - data (Object): Data profil yang akan diupdate (nama, unitKerja)
   *
   * Return:
   * - void (mengubah state loading, memanggil fetchProfile)
   */
  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        nama: data.nama,
        unit_kerja: data.unitKerja,
      };

      await userService.updateProfile(updateData);
      toast.success("Profil berhasil diperbarui!");
      fetchProfile(); // Reload data profil setelah update
    } catch (err) {
      console.error("Error updating profile:", err);

      // Penanganan error spesifik sesuai status kode API
      if (err.response) {
        if (err.response.status === 400) {
          toast.error(err.response.data?.message || "Data profil tidak valid.");
        } else if (err.response.status === 401) {
          toast.error("Sesi login Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error(
            err.response.data?.message || "Gagal memperbarui profil."
          );
        }
      } else if (err.request) {
        toast.error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        toast.error("Terjadi kesalahan saat memperbarui profil.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mengubah password pengguna melalui API.
   *
   * Parameter:
   * - data (Object): Data berisi password baru
   *
   * Return:
   * - void (mengubah state loading)
   */
  const handleChangePassword = async (data) => {
    setLoading(true);
    try {
      await userService.updateProfile({ password: data.passwordBaru });
      toast.success("Password berhasil diubah!");
    } catch (err) {
      console.error("Error changing password:", err);

      // Penanganan error spesifik sesuai status kode API
      if (err.response) {
        if (err.response.status === 400) {
          toast.error(err.response.data?.message || "Password tidak valid.");
        } else if (err.response.status === 401) {
          toast.error("Sesi login Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error(err.response.data?.message || "Gagal mengubah password.");
        }
      } else if (err.request) {
        toast.error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        toast.error("Terjadi kesalahan saat mengubah password.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mengunggah foto profil pengguna ke API.
   *
   * Parameter:
   * - e (Event): Event input file dari user
   *
   * Return:
   * - void (mengubah state photoLoading, memanggil fetchProfile)
   */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (maksimal 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }

    // Validasi tipe file yang diizinkan
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format foto harus JPG, PNG, atau WebP");
      return;
    }

    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);

      await userService.updateProfilePhoto(formData);
      toast.success("Foto profil berhasil diperbarui!");
      fetchProfile(); // Reload data profil setelah upload foto
    } catch (err) {
      console.error("Error uploading photo:", err);

      if (err.response) {
        if (err.response.status === 400) {
          toast.error(err.response.data?.message || "File tidak valid.");
        } else {
          toast.error(err.response.data?.message || "Gagal mengunggah foto.");
        }
      } else {
        toast.error("Terjadi kesalahan saat mengunggah foto.");
      }
    } finally {
      setPhotoLoading(false);
    }
  };

  // Render UI halaman profil
  return (
    <div className="p-6">
      {/* Header Section dengan ikon profil */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-md">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
            <p className="text-gray-600 mt-1">
              Lihat dan edit informasi profil Anda.
            </p>
          </div>
        </div>
      </div>

      {/* State loading saat data profil diambil */}
      {loading && !profile ? (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-500 font-medium">Memuat data profil...</p>
          </div>
        </div>
      ) : error ? (
        // State error jika gagal mengambil data profil
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Gagal Memuat Data
            </h3>
            <p className="text-gray-500 text-center max-w-md mx-auto mb-4">
              {error}
            </p>
            <button
              onClick={fetchProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition shadow-md"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>
          </div>
        </div>
      ) : (
        // State sukses: tampilkan data profil dan form
        profile && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header profil dengan foto */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0 relative">
                  {photoLoading ? (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full shadow-lg relative">
                      {profile.foto ? (
                        <img
                          src={profile.foto}
                          alt={profile.nama}
                          className="w-full h-full object-cover rounded-full border-4 border-white"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center border-4 border-white">
                          <span className="text-white text-3xl font-bold">
                            {profile.nama
                              ? profile.nama.charAt(0).toUpperCase()
                              : "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tombol upload foto profil */}
                  <div className="absolute bottom-0 right-0">
                    <label className="flex cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                        <path
                          fillRule="evenodd"
                          d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        disabled={loading || photoLoading}
                      />
                    </label>
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.nama}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-1 mb-3">
                    <div className="text-sm font-medium text-gray-500">
                      @{profile.username}
                    </div>
                    <div className="hidden sm:block text-gray-300">•</div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {profile.role === "admin" ? "Administrator" : "Pegawai"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {profile.unitKerja || "Unit Kerja tidak tercantum"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form untuk update profil dan password */}
            <div className="p-8">
              <ProfileForm
                profile={profile}
                onUpdate={handleUpdate}
                onChangePassword={handleChangePassword}
                loading={loading}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ProfilePage;
