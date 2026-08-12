import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* ==========================
          Sidebar
      ========================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ==========================
          Main Area
      ========================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}

        <Topbar
          setSidebarOpen={setSidebarOpen}
        />

        {/* Scrollable Page Content */}

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;