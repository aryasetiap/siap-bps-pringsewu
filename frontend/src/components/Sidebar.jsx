/**
 * Sidebar.jsx
 *
 * Komponen Sidebar untuk aplikasi SIAP BPS Pringsewu.
 * Sidebar ini digunakan sebagai navigasi utama aplikasi, baik untuk admin maupun pegawai.
 * Mendukung tampilan mobile dan desktop, serta fitur collapse pada desktop.
 *
 * Fitur bisnis yang didukung:
 * - Pengelolaan barang
 * - Pengajuan dan verifikasi permintaan
 * - Manajemen pengguna
 * - Laporan periodik
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Transition, Dialog } from "@headlessui/react";
import {
  HomeIcon,
  ArchiveBoxIcon,
  UsersIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * Fungsi utilitas untuk menggabungkan beberapa kelas CSS menjadi satu string.
 *
 * Parameter:
 * - classes (...string): Daftar kelas CSS yang ingin digabungkan.
 *
 * Return:
 * - string: Gabungan kelas CSS yang valid.
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Konfigurasi navigasi berdasarkan peran pengguna.
 *
 * Struktur:
 * - admin: Navigasi untuk admin (manajemen barang, pengguna, verifikasi, laporan).
 * - pegawai: Navigasi untuk pegawai (pengajuan dan riwayat permintaan).
 */
const NAVIGATION_ITEMS = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Manajemen Barang", href: "/admin/barang", icon: ArchiveBoxIcon },
    { name: "Manajemen Pengguna", href: "/admin/pengguna", icon: UsersIcon },
    {
      name: "Verifikasi Permintaan",
      href: "/admin/verifikasi",
      icon: CheckCircleIcon,
    },
    {
      name: "Laporan Periodik",
      href: "/admin/laporan",
      icon: DocumentTextIcon,
    },
  ],
  pegawai: [
    {
      name: "Pengajuan Permintaan",
      href: "/pegawai/permintaan",
      icon: ShoppingCartIcon,
    },
    {
      name: "Riwayat Permintaan",
      href: "/pegawai/riwayat",
      icon: ClipboardDocumentListIcon,
    },
  ],
};

/**
 * Komponen Logo dan Header aplikasi SIAP.
 *
 * Parameter:
 * - collapsed (boolean): Status apakah sidebar dalam mode collapse.
 *
 * Return:
 * - React.Element: Logo dan header aplikasi.
 */
function LogoHeader({ collapsed }) {
  return (
    <div className="flex flex-shrink-0 items-center justify-center px-4 mb-4">
      {!collapsed ? (
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-3 shadow-lg">
            <h2 className="text-2xl font-extrabold text-white">S</h2>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">SIAP</h2>
          <p className="text-xs text-blue-200">BPS Pringsewu</p>
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-lg">
          <h2 className="text-2xl font-extrabold text-white">S</h2>
        </div>
      )}
    </div>
  );
}

/**
 * Komponen User Profile.
 * Menampilkan nama dan peran pengguna.
 *
 * Parameter:
 * - collapsed (boolean): Status apakah sidebar dalam mode collapse.
 * - username (string): Nama pengguna.
 * - userRole (string): Peran pengguna.
 *
 * Return:
 * - React.Element|null: Profil pengguna (hanya tampil jika sidebar tidak collapse).
 */
function UserProfile({ collapsed, username, userRole }) {
  if (collapsed) return null;
  return (
    <div className="mx-3 mb-6 rounded-lg bg-blue-700/40 p-3">
      <div className="flex items-center">
        <div className="mr-3 rounded-full bg-blue-800 p-2">
          <UserCircleIcon
            className="h-6 w-6 text-blue-200"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{username}</p>
          <p className="text-xs text-blue-200 capitalize">{userRole}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Komponen Navigasi Sidebar.
 * Menampilkan daftar menu sesuai peran pengguna.
 *
 * Parameter:
 * - navItems (array): Daftar item navigasi.
 * - collapsed (boolean): Status collapse sidebar.
 * - onItemClick (function): Handler klik menu (opsional, untuk mobile).
 *
 * Return:
 * - React.Element: Daftar menu navigasi sidebar.
 */
function SidebarNav({ navItems, collapsed, onItemClick }) {
  const location = useLocation();

  return (
    <nav className={collapsed ? "space-y-1" : "flex-1 space-y-1"}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={onItemClick}
          className={classNames(
            location.pathname === item.href
              ? "bg-blue-600 text-white shadow-md"
              : "text-blue-100 hover:bg-blue-700/50",
            "group flex items-center px-3 py-2.5",
            collapsed
              ? "justify-center text-sm font-medium rounded-lg transition duration-150"
              : "text-base font-medium rounded-lg transition duration-150"
          )}
        >
          <item.icon
            className={classNames(
              location.pathname === item.href
                ? "text-white"
                : "text-blue-300 group-hover:text-white",
              collapsed ? "mx-auto" : "mr-4",
              "flex-shrink-0 h-6 w-6 transition duration-150"
            )}
            aria-hidden="true"
          />
          {!collapsed && <span className="flex-1">{item.name}</span>}
          {/* Tooltip ketika sidebar collapse */}
          {collapsed && (
            <span className="sr-only group-hover:not-sr-only group-hover:absolute group-hover:left-20 group-hover:px-3 group-hover:py-2 group-hover:rounded-md group-hover:bg-gray-800 group-hover:text-white group-hover:whitespace-nowrap group-hover:shadow-lg z-50">
              {item.name}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Komponen utama Sidebar untuk aplikasi SIAP.
 * Sidebar ini digunakan sebagai navigasi utama aplikasi, baik untuk admin maupun pegawai.
 * Mendukung tampilan mobile dan desktop, serta fitur collapse pada desktop.
 *
 * Parameter:
 * - isOpenMobile (boolean): Status sidebar mobile.
 * - onCloseMobile (function): Handler untuk menutup sidebar mobile.
 * - isCollapsed (boolean): Status collapse sidebar desktop.
 *
 * Return:
 * - React.Element: Sidebar dengan navigasi sesuai peran pengguna.
 */
function Sidebar({ isOpenMobile, onCloseMobile, isCollapsed }) {
  // Ambil peran dan nama pengguna dari localStorage
  const userRole = localStorage.getItem("userRole") || "pegawai";
  const username = localStorage.getItem("username") || "Pengguna";
  const currentNav = NAVIGATION_ITEMS[userRole] || [];

  return (
    <>
      {/* Sidebar Mobile */}
      <Transition.Root show={isOpenMobile} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={onCloseMobile}
        >
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel
                className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-blue-800 to-blue-900 pb-4 pt-5 shadow-xl"
                data-testid="mobile-sidebar"
              >
                {/* Tombol tutup sidebar mobile */}
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={onCloseMobile}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {/* Logo dan header aplikasi */}
                <div className="flex flex-col items-center px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-3 shadow-lg">
                    <h2 className="text-2xl font-extrabold text-white">S</h2>
                  </div>
                  <h2
                    className="text-2xl font-bold text-white mb-1"
                    data-testid="sidebar-title"
                  >
                    SIAP
                  </h2>
                  <p
                    className="text-xs text-blue-200 mb-4"
                    data-testid="sidebar-subtitle"
                  >
                    BPS Pringsewu
                  </p>
                </div>
                {/* User profile section */}
                <UserProfile
                  collapsed={false}
                  username={username}
                  userRole={userRole}
                />
                {/* Navigasi menu */}
                <div className="mt-2 flex-1 overflow-y-auto px-3">
                  <SidebarNav
                    navItems={currentNav}
                    collapsed={false}
                    onItemClick={onCloseMobile}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Sidebar Desktop */}
      <div
        className={classNames(
          "md:flex flex-shrink-0 bg-gradient-to-b from-blue-800 to-blue-900 shadow-lg transition-all duration-300 ease-in-out h-full fixed top-0 left-0 pt-5 pb-4 z-40 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
        data-testid="desktop-sidebar"
      >
        {/* Logo Section */}
        <LogoHeader collapsed={isCollapsed} />
        {/* User Profile Section */}
        <UserProfile
          collapsed={isCollapsed}
          username={username}
          userRole={userRole}
        />
        {/* Navigasi menu */}
        <div className="flex-1 flex flex-col overflow-y-auto px-3">
          <SidebarNav navItems={currentNav} collapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
