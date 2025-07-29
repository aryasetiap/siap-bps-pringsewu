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
  const userRole = localStorage.getItem("userRole");
  const currentNav = navigationItems[userRole] || [];

  return (
    <>
      {/* Sidebar Mobile */}
      <Transition.Root show={isOpenMobile} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
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
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-blue-800 pb-4 pt-5">
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
                <div className="flex flex-shrink-0 items-center px-4">
                  <h2 className="text-3xl font-bold text-white">SIAP</h2>
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {currentNav.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={onCloseMobile}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-blue-700 text-white"
                            : "text-blue-100 hover:bg-blue-600",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            location.pathname === item.href
                              ? "text-white"
                              : "text-blue-900 group-hover:text-white",
                            "mr-4 flex-shrink-0 h-6 w-6"
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
          "hidden md:flex flex-shrink-0 bg-blue-900 border-r border-gray-200 transition-all duration-300 ease-in-out h-full fixed top-0 left-0 pt-4 pb-4 z-40 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className="flex flex-shrink-0 items-center px-4"
          style={{ height: "64px" }}
        >
          {!isCollapsed ? (
            <h2 className="text-3xl font-bold text-white">SIAP</h2>
          ) : (
            <h2 className="text-3xl font-bold text-white">S</h2>
          )}
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  location.pathname === item.href
                    ? "bg-white text-blue-900"
                    : "text-blue-100 hover:bg-white hover:text-blue-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <item.icon
                  className={classNames(
                    location.pathname === item.href
                      ? "text-blue-900"
                      : "text-white group-hover:text-blue-900",
                    isCollapsed ? "mx-auto" : "mr-3",
                    "flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {/* Tooltip saat collapsed */}
                {isCollapsed && (
                  <span className="sr-only group-hover:not-sr-only group-hover:bg-gray-700 group-hover:text-white group-hover:absolute group-hover:left-24 group-hover:px-2 group-hover:py-1 group-hover:rounded-md group-hover:whitespace-nowrap z-50">
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
