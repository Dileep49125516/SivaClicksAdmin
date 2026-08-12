import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAdmin } from "../../context/AdminContext";

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const { admin, logout } = useAdmin();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-5 md:px-6">

      {/* ==========================
          Left Side
      ========================== */}

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">

        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="shrink-0 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 lg:hidden"
        >
          <Menu size={23} />
        </button>

        {/* Heading */}

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-amber-400 sm:text-xl">
            Siva clicks
          </h2>

          <p className="hidden truncate text-sm text-slate-500 sm:block">
            Welcome back, {admin?.name}
          </p>
        </div>
      </div>

      {/* ==========================
          Right Side
      ========================== */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Admin Name - Tablet/Desktop */}

        <div className="hidden max-w-[180px] text-right md:block">
          <p className="truncate text-sm font-medium text-slate-800">
            {admin?.name}
          </p>

          <p className="text-xs text-slate-500">
            Administrator
          </p>
        </div>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600 active:bg-red-700 sm:rounded-xl sm:px-4 sm:text-sm"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Topbar;