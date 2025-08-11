/**
 * DashboardLayout.jsx
 *
 * Komponen layout utama untuk dashboard aplikasi SIAP BPS Pringsewu.
 * Digunakan untuk mengelola tampilan sidebar, headbar, dan konten utama.
 *
 * Konteks bisnis:
 * - Menyediakan struktur halaman untuk fitur pengelolaan barang, permintaan, dan verifikasi.
 * - Sidebar dapat dikolaps atau dibuka pada mode desktop dan mobile.
 */

import React, { useState } from "react";
import Headbar from "./Headbar";
import Sidebar from "./Sidebar";

/**
 * DashboardLayout
 *
 * Komponen ini digunakan untuk membungkus seluruh halaman dashboard SIAP.
 * Mengatur tampilan sidebar (desktop & mobile), headbar, dan konten utama.
 *
 * Parameter:
 * - children (ReactNode): Komponen atau elemen yang akan ditampilkan sebagai konten utama dashboard.
 *
 * Return:
 * - JSX.Element: Struktur layout dashboard dengan sidebar, headbar, dan konten utama.
 */
function DashboardLayout({ children }) {
  // State untuk mengatur visibilitas sidebar pada mode mobile (overlay)
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // State untuk mengatur status collapse sidebar pada mode desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /**
   * toggleSidebarMobile
   *
   * Fungsi ini digunakan untuk membuka atau menutup sidebar pada mode mobile.
   *
   * Parameter: -
   *
   * Return: void
   */
  const toggleSidebarMobile = () => setIsSidebarMobileOpen((prev) => !prev);

  /**
   * closeSidebarMobile
   *
   * Fungsi ini digunakan untuk menutup sidebar pada mode mobile.
   *
   * Parameter: -
   *
   * Return: void
   */
  const closeSidebarMobile = () => setIsSidebarMobileOpen(false);

  /**
   * toggleSidebarCollapse
   *
   * Fungsi ini digunakan untuk mengubah status collapse sidebar pada mode desktop.
   *
   * Parameter: -
   *
   * Return: void
   */
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  // Penyesuaian margin kiri konten utama berdasarkan status collapse sidebar
  const mainContentMargin = isSidebarCollapsed ? "md:ml-20" : "md:ml-64";

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      {/* Sidebar: Navigasi utama untuk fitur pengelolaan barang, permintaan, dan verifikasi */}
      <Sidebar
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={closeSidebarMobile}
        isCollapsed={isSidebarCollapsed}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Headbar: Menampilkan tombol navigasi dan informasi pengguna */}
        <Headbar
          onToggleSidebarMobile={toggleSidebarMobile}
          onToggleSidebarCollapse={toggleSidebarCollapse}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Content: Area utama untuk menampilkan data dan fitur aplikasi SIAP */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100vh-100px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
