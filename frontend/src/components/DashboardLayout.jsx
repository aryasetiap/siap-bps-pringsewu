import React, { useState } from "react";
import Headbar from "./Headbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  // State untuk sidebar mobile (overlay)
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  // State untuk status collapse sidebar di desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebarMobile = () => setIsSidebarMobileOpen((v) => !v);
  const closeSidebarMobile = () => setIsSidebarMobileOpen(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((v) => !v);

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={closeSidebarMobile}
        isCollapsed={isSidebarCollapsed}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Headbar */}
        <Headbar
          onToggleSidebarMobile={toggleSidebarMobile}
          onToggleSidebarCollapse={toggleSidebarCollapse}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Content */}
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
