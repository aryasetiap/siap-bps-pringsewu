/**
 * useLoadingError.js
 *
 * Hook custom untuk mengelola state loading dan error pada aplikasi SIAP.
 * Digunakan dalam proses pengelolaan barang, permintaan, dan verifikasi,
 * agar status loading dan error dapat diatur secara konsisten di seluruh komponen.
 *
 * Author: [Nama Anda]
 */

import { useState, useCallback } from "react";

/**
 * Hook custom untuk mengelola state loading dan error.
 *
 * Parameter:
 * - initialLoading (boolean): Status awal loading, default false.
 * - initialError (string|null): Pesan error awal, default null.
 *
 * Return:
 * - Object:
 *   - loading (boolean): Status loading saat ini.
 *   - error (string|null): Pesan error saat ini.
 *   - setLoading (function): Setter untuk status loading.
 *   - setError (function): Setter untuk pesan error.
 *   - startLoading (function): Memulai proses loading dan reset error.
 *   - stopLoading (function): Menghentikan proses loading dan set error.
 *   - withLoading (function): Membungkus async function dengan state loading dan error.
 */
const useLoadingError = (initialLoading = false, initialError = null) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  /**
   * Memulai proses loading dan mereset pesan error.
   *
   * Return:
   * - void
   */
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  /**
   * Menghentikan proses loading dan mengatur pesan error jika ada.
   *
   * Parameter:
   * - errorMsg (string|null): Pesan error yang ingin ditampilkan, default null.
   *
   * Return:
   * - void
   */
  const stopLoading = useCallback((errorMsg = null) => {
    setLoading(false);
    setError(errorMsg);
  }, []);

  /**
   * Membungkus fungsi async dengan state loading dan error.
   * Cocok digunakan pada proses pengelolaan barang, permintaan, dan verifikasi
   * agar status loading dan error terupdate secara otomatis.
   *
   * Parameter:
   * - asyncFn (function): Fungsi async yang akan dijalankan.
   *
   * Return:
   * - Promise: Hasil dari asyncFn.
   *
   * Jika terjadi error, pesan error akan diatur sesuai respons API atau koneksi.
   */
  const withLoading = useCallback(
    async (asyncFn) => {
      startLoading();
      try {
        const result = await asyncFn();
        stopLoading();
        return result;
      } catch (err) {
        // Penanganan error respons API dan koneksi
        let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

        if (err.response) {
          // Error dari respons API (misal: gagal verifikasi barang)
          errorMessage = err.response.data?.message || errorMessage;
        } else if (err.request) {
          // Error request (tidak ada respons dari server)
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
        }

        stopLoading(errorMessage);
        throw err; // Error tetap dilempar agar bisa ditangani di komponen pemanggil
      }
    },
    [startLoading, stopLoading]
  );

  // Return seluruh utilitas pengelolaan loading dan error
  return {
    loading,
    error,
    setLoading,
    setError,
    startLoading,
    stopLoading,
    withLoading,
  };
};

export default useLoadingError;
