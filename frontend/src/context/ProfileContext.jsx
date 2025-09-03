/**
 * File ini berisi Context untuk pengelolaan data profil user pada aplikasi SIAP.
 * Digunakan untuk mengambil, menyimpan, dan memperbarui data profil user termasuk foto.
 * Cocok digunakan pada fitur pengelolaan barang, permintaan, dan verifikasi yang membutuhkan data user.
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import * as userService from "../services/userService";

/**
 * ProfileContext digunakan untuk menyediakan state dan fungsi terkait profil user.
 */
const ProfileContext = createContext();

/**
 * Hook custom untuk mengakses context profil user.
 *
 * Return:
 * - object: Berisi state dan fungsi terkait profil user.
 */
export const useProfile = () => useContext(ProfileContext);

/**
 * Komponen Provider untuk ProfileContext.
 * Menyediakan state dan fungsi untuk mengambil dan memperbarui data profil user.
 *
 * Parameter:
 * - children (ReactNode): Komponen anak yang membutuhkan akses ke data profil.
 *
 * Return:
 * - ReactNode: Komponen Provider yang membungkus children.
 */
export const ProfileProvider = ({ children }) => {
  // State untuk menyimpan data profil user
  const [profile, setProfile] = useState(null);
  // State untuk menandakan proses loading data profil
  const [loading, setLoading] = useState(false);

  /**
   * Fungsi ini digunakan untuk mengambil data profil user dari backend.
   * Data foto juga disimpan di localStorage untuk akses cepat pada fitur lain.
   *
   * Parameter: Tidak ada.
   *
   * Return:
   * - void
   */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userService.getProfile();
      setProfile(response.data);

      // Simpan foto di localStorage untuk akses cepat pada fitur lain
      if (response.data.foto) {
        localStorage.setItem("userPhoto", response.data.foto);
      }
    } catch (error) {
      // Error handling untuk proses pengambilan data profil
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi ini digunakan untuk memperbarui foto profil user.
   * Foto baru juga diupdate di localStorage agar sinkron dengan data terbaru.
   *
   * Parameter:
   * - formData (FormData): Data foto yang akan diupload.
   *
   * Return:
   * - object: Data profil user terbaru setelah update.
   *
   * Throws:
   * - error: Jika proses update gagal.
   */
  const updateProfilePhoto = async (formData) => {
    setLoading(true);
    try {
      const response = await userService.updateProfilePhoto(formData);
      setProfile(response.data);

      // Update foto di localStorage agar konsisten di seluruh aplikasi
      if (response.data.foto) {
        localStorage.setItem("userPhoto", response.data.foto);
      }
      return response.data;
    } catch (error) {
      // Error handling untuk proses update foto profil
      console.error("Error updating profile photo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect ini digunakan untuk mengambil data profil saat komponen pertama kali di-mount.
   * Penting untuk memastikan data user tersedia pada fitur pengelolaan barang, permintaan, dan verifikasi.
   */
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Provider ini membungkus children dan menyediakan state serta fungsi terkait profil user.
   * State dan fungsi ini dapat digunakan pada fitur pengelolaan barang, permintaan, dan verifikasi.
   */
  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        fetchProfile,
        updateProfilePhoto,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
