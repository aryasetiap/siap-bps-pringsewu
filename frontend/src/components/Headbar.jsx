/**
 * Komponen Headbar untuk aplikasi SIAP BPS Pringsewu.
 * Menampilkan header yang berisi tombol sidebar, judul aplikasi, notifikasi, dan menu user.
 * Digunakan pada halaman utama untuk pengelolaan barang, permintaan, dan verifikasi.
 *
 * Parameter:
 * - onToggleSidebarMobile (function): Fungsi untuk toggle sidebar pada mode mobile.
 * - onToggleSidebarCollapse (function): Fungsi untuk collapse/expand sidebar pada desktop.
 * - isSidebarCollapsed (boolean): Status collapse sidebar.
 *
 * Return:
 * - JSX: Komponen header yang interaktif.
 */

import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import * as userService from "../services/userService";
import * as authService from "../services/authService";
import { useProfile } from "../context/ProfileContext";

/**
 * Fungsi utilitas untuk menggabungkan className secara kondisional.
 *
 * Parameter:
 * - ...classes (array): Daftar className yang ingin digabungkan.
 *
 * Return:
 * - string: ClassName yang sudah difilter dan digabung.
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Komponen utama Headbar.
 * Menampilkan header aplikasi SIAP BPS Pringsewu, termasuk tombol sidebar, notifikasi, dan menu user.
 *
 * Parameter:
 * - onToggleSidebarMobile (function): Handler toggle sidebar mobile.
 * - onToggleSidebarCollapse (function): Handler collapse sidebar desktop.
 * - isSidebarCollapsed (boolean): Status collapse sidebar.
 *
 * Return:
 * - JSX: Komponen header.
 */
function Headbar({
  onToggleSidebarMobile,
  onToggleSidebarCollapse,
  isSidebarCollapsed,
}) {
  const navigate = useNavigate();
  const [userPhoto, setUserPhoto] = useState(null);
  // State notifikasi, dapat dikembangkan untuk pengelolaan permintaan/verifikasi barang
  const [notifications] = useState([]);

  // Ambil username dan role dari localStorage, default jika belum login
  const username = localStorage.getItem("username") || "Pengguna";
  const userRole = localStorage.getItem("userRole") || "Tamu";

  // Ambil profile dari context untuk efisiensi akses data user
  const { profile } = useProfile();

  /**
   * Efek untuk mengambil foto user dari context profile.
   * Jika tidak ada, fallback ke API userService.
   */
  useEffect(() => {
    if (profile && profile.foto) {
      setUserPhoto(profile.foto);
    } else {
      const fetchUserPhoto = async () => {
        try {
          const response = await userService.getProfile();
          if (response.data && response.data.foto) {
            setUserPhoto(response.data.foto);
          }
        } catch (error) {
          console.error("Error fetching user photo:", error);
        }
      };
      fetchUserPhoto();
    }
  }, [profile]);

  /**
   * Fungsi untuk logout user dari aplikasi SIAP.
   * Menghapus data autentikasi dan mengarahkan ke halaman login.
   */
  const handleLogout = async () => {
    try {
      await authService.logout(); // Panggil API logout
    } catch (err) {
      // Optional: tampilkan error jika gagal logout
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="bg-white ml-6 shadow-sm p-4 flex justify-between items-center rounded-lg top-0 right-0 z-40 transition-all duration-300 ease-in-out border border-gray-100">
      <div className="flex items-center h-full">
        {/* Tombol Toggle Sidebar Mobile */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
          onClick={onToggleSidebarMobile}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Tombol Toggle Collapse Sidebar Desktop */}
        <button
          type="button"
          className="hidden md:block p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
          onClick={onToggleSidebarCollapse}
        >
          <span className="sr-only">Toggle sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <h1 className="ml-4 text-xl font-semibold text-gray-800">
          <span className="text-blue-600">SIAP</span> BPS Pringsewu
        </h1>
      </div>

      {/* Bagian Kanan Headbar: Info User & Logout */}
      <div className="flex items-center space-x-3">
        {/* Menu Notifikasi: Untuk pengelolaan permintaan/verifikasi barang */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <span className="sr-only">Notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">Notifikasi</p>
              </div>
              <div className="py-1">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        // Gunakan button untuk aksesibilitas
                        <button
                          type="button"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block w-full text-left px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {notif.message}
                        </button>
                      )}
                    </Menu.Item>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Menu User: Menampilkan info user dan aksi logout */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="inline-flex justify-center items-center rounded-lg border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition"
              aria-label="user-menu"
            >
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={username}
                  className="h-7 w-7 rounded-full object-cover mr-2 -ml-1 border border-gray-200"
                />
              ) : (
                <UserCircleIcon
                  className="h-7 w-7 mr-2 -ml-1 text-gray-400"
                  aria-hidden="true"
                />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-900">{username}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {userRole}
                </span>
              </div>
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
              <div className="px-4 py-3">
                <p className="text-sm text-gray-900 font-medium truncate">
                  {username}
                </p>
                <p className="text-sm text-gray-500 truncate capitalize">
                  {userRole}
                </p>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      <UserCircleIcon
                        className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
                        aria-hidden="true"
                      />
                      Profil Saya
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex w-full items-center px-4 py-2 text-sm"
                      )}
                    >
                      <ArrowLeftOnRectangleIcon
                        className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
                        aria-hidden="true"
                      />
                      Keluar
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}

export default Headbar;
