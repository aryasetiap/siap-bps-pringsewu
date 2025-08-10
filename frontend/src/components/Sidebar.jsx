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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigationItems = {
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

function Sidebar({ isOpenMobile, onCloseMobile, isCollapsed }) {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole") || "pegawai";
  const username = localStorage.getItem("username") || "Pengguna";
  const currentNav = navigationItems[userRole] || [];

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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-blue-800 to-blue-900 pb-4 pt-5 shadow-xl">
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

                {/* Logo and header */}
                <div className="flex flex-col items-center px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-3 shadow-lg">
                    <h2 className="text-2xl font-extrabold text-white">S</h2>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">SIAP</h2>
                  <p className="text-xs text-blue-200 mb-4">BPS Pringsewu</p>
                </div>

                {/* User profile section */}
                <div className="mx-3 mb-6 rounded-lg bg-blue-700/40 p-3">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-blue-800 p-2">
                      <UserCircleIcon
                        className="h-6 w-6 text-blue-200"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {username}
                      </p>
                      <p className="text-xs text-blue-200 capitalize">
                        {userRole}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-2 flex-1 overflow-y-auto px-3">
                  <nav className="space-y-1">
                    {currentNav.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={onCloseMobile}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-blue-100 hover:bg-blue-700/50",
                          "group flex items-center px-3 py-2.5 text-base font-medium rounded-lg transition duration-150"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            location.pathname === item.href
                              ? "text-white"
                              : "text-blue-300 group-hover:text-white",
                            "mr-4 flex-shrink-0 h-6 w-6 transition duration-150"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Sidebar Desktop */}
      <div
        className={classNames(
          "hidden md:flex flex-shrink-0 bg-gradient-to-b from-blue-800 to-blue-900 shadow-lg transition-all duration-300 ease-in-out h-full fixed top-0 left-0 pt-5 pb-4 z-40 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className="flex flex-shrink-0 items-center justify-center px-4 mb-4">
          {!isCollapsed ? (
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

        {/* User Profile Section - Only show when not collapsed */}
        {!isCollapsed && (
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
        )}

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto px-3">
          <nav className="flex-1 space-y-1">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  location.pathname === item.href
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-700/50",
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition duration-150",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <item.icon
                  className={classNames(
                    location.pathname === item.href
                      ? "text-white"
                      : "text-blue-300 group-hover:text-white",
                    isCollapsed ? "mx-auto" : "mr-3",
                    "flex-shrink-0 h-6 w-6 transition duration-150"
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <span className="sr-only group-hover:not-sr-only group-hover:absolute group-hover:left-20 group-hover:px-3 group-hover:py-2 group-hover:rounded-md group-hover:bg-gray-800 group-hover:text-white group-hover:whitespace-nowrap group-hover:shadow-lg z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
