import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Bars3Icon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import * as userService from "../services/userService";
import { useProfile } from "../context/ProfileContext";

// Fungsi untuk memformat className secara kondisional
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Headbar({
  onToggleSidebarMobile,
  onToggleSidebarCollapse,
  isSidebarCollapsed,
}) {
  const navigate = useNavigate();
  const [userPhoto, setUserPhoto] = useState(null);
  // Keep notifications state but remove the setter from destructuring to avoid warning
  const [notifications] = useState([]);

  // Using constants instead of state since we don't update them in this component
  const username = localStorage.getItem("username") || "Pengguna";
  const userRole = localStorage.getItem("userRole") || "Tamu";

  // Gunakan profile atau hapus deklarasinya
  const { profile } = useProfile();

  // Gunakan profile untuk mendapatkan foto (lebih baik daripada API call lagi)
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
  }, [profile]); // Tambahkan profile sebagai dependency

  const handleLogout = () => {
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
        {/* Notifications */}
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
                        // Change anchor tag to button to fix accessibility warning
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

        {/* User Menu */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center items-center rounded-lg border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition">
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
