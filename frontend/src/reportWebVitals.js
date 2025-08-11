/**
 * File ini berfungsi untuk mencatat dan melaporkan metrik performa aplikasi SIAP.
 * Metrik yang dicatat meliputi: CLS, FID, FCP, LCP, dan TTFB.
 * Digunakan untuk memantau performa frontend dalam pengelolaan barang, permintaan, dan verifikasi.
 */

/**
 * Fungsi reportWebVitals digunakan untuk mengambil dan melaporkan metrik performa web aplikasi SIAP.
 *
 * Parameter:
 * - onPerfEntry (Function): Fungsi callback yang akan menerima data metrik performa.
 *
 * Return:
 * - void: Tidak mengembalikan nilai, hanya menjalankan callback dengan data metrik.
 */
const reportWebVitals = (onPerfEntry) => {
  // Pastikan parameter yang diberikan adalah fungsi
  if (typeof onPerfEntry === "function") {
    // Import modul web-vitals secara dinamis untuk efisiensi pemuatan
    import("web-vitals").then((webVitals) => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;

      // Setiap metrik performa akan diproses dan dikirim ke callback
      getCLS(onPerfEntry); // Cumulative Layout Shift: mengukur kestabilan layout saat pengelolaan data barang
      getFID(onPerfEntry); // First Input Delay: mengukur responsivitas saat permintaan barang
      getFCP(onPerfEntry); // First Contentful Paint: waktu render konten pertama pada aplikasi SIAP
      getLCP(onPerfEntry); // Largest Contentful Paint: waktu render konten terbesar, penting untuk verifikasi data
      getTTFB(onPerfEntry); // Time to First Byte: waktu respons server saat aplikasi SIAP diakses
    });
  }
};

export default reportWebVitals;
