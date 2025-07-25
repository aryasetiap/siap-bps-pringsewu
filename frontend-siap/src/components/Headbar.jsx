import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Headbar({
  onToggleSidebarMobile,
  onToggleSidebarCollapse,
  isSidebarCollapsed,
}) {
  const navigate = useNavigate();

  // Mendapatkan nama pengguna dan role dari localStorage (simulasi)
  const username = localStorage.getItem("username") || "Pengguna";
  const userRole = localStorage.getItem("userRole") || "Tamu";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="bg-white ml-6 shadow-sm p-4 flex justify-between items-center rounded-lg top-0 right-0 z-40 transition-all duration-300 ease-in-out">
      <div className="flex items-center h-full">
        {/* Tombol Toggle Sidebar Mobile (hanya tampil di mobile) */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
          onClick={onToggleSidebarMobile}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Tombol Toggle Collapse Sidebar (hanya tampil di desktop) */}
        <button
          type="button"
          className="hidden md:block p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
          onClick={onToggleSidebarCollapse}
        >
          <span className="sr-only">Toggle sidebar</span>
          {isSidebarCollapsed ? (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        <h1 className="ml-4 text-xl font-semibold text-gray-800">
          <span className="text-blue-600">SIAP</span> BPS Pringsewu
        </h1>
      </div>

      {/* Bagian Kanan Headbar: Info User & Logout */}
      <div className="flex items-center space-x-4">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
              <UserCircleIcon
                className="h-5 w-5 mr-2 -ml-1 text-gray-400"
                aria-hidden="true"
              />
              <span className="capitalize">
                {username} ({userRole})
              </span>
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile" // Ganti dengan path profil Anda
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    <UserCircleIcon
                      className="inline-block h-5 w-5 mr-2 -mt-0.5"
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
                      "block w-full text-left px-4 py-2 text-sm"
                    )}
                  >
                    <ArrowRightEndOnRectangleIcon
                      className="inline-block h-5 w-5 mr-2 -mt-0.5"
                      aria-hidden="true"
                    />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
}

export default Headbar;
