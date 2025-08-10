import { useState, useCallback } from "react";

/**
 * Custom hook untuk mengelola state loading dan error
 * @param {boolean} initialLoading - Initial loading state
 * @param {string|null} initialError - Initial error message
 * @returns {Object} - { loading, error, setLoading, setError, startLoading, stopLoading, withLoading }
 */
const useLoadingError = (initialLoading = false, initialError = null) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  // Helper untuk memulai proses loading dan reset error
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  // Helper untuk menghentikan proses loading
  const stopLoading = useCallback((errorMsg = null) => {
    setLoading(false);
    setError(errorMsg);
  }, []);

  // Utility untuk membungkus async function dengan loading state
  const withLoading = useCallback(
    async (asyncFn) => {
      startLoading();
      try {
        const result = await asyncFn();
        stopLoading();
        return result;
      } catch (err) {
        let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

        if (err.response) {
          // Error dari respons API
          errorMessage = err.response.data?.message || errorMessage;
        } else if (err.request) {
          // Error request (tidak ada respons)
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
        }

        stopLoading(errorMessage);
        throw err;
      }
    },
    [startLoading, stopLoading]
  );

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
