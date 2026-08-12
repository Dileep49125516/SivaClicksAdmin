import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  MessageSquare,
  Package,
  Star,
  User,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/dashboard/bookings",
    icon: CalendarDays,
  },
  {
    name: "Gallery",
    path: "/dashboard/gallery",
    icon: Image,
  },
  {
    name: "Messages",
    path: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    name: "Packages",
    path: "/dashboard/packages",
    icon: Package,
  },
  {
    name: "Reviews",
    path: "/dashboard/testimonials",
    icon: Star,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: User,
  },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <>
      {/* ==========================
          Mobile Overlay
      ========================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==========================
          Sidebar
      ========================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-[280px] max-w-[85vw] flex-col
          bg-slate-900 text-white
          shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:w-64
          lg:max-w-none
          lg:translate-x-0
          lg:shadow-none
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ==========================
            Logo
        ========================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-5 sm:p-6">

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-amber-400 sm:text-2xl">
              Siva Clicks
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="ml-3 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white active:bg-slate-700 lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        {/* ==========================
            Navigation
        ========================== */}

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3 sm:space-y-2 sm:p-4">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-[46px] items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 sm:px-4 sm:text-base ${
                    isActive
                      ? "bg-amber-500 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={20}
                  className="shrink-0"
                />

                <span className="truncate">
                  {item.name}
                </span>
              </NavLink>
            );
          })}

        </nav>

        {/* ==========================
            Footer
        ========================== */}

        <div className="shrink-0 border-t border-slate-800 p-4">
          <p className="text-center text-[11px] text-slate-500 sm:text-xs">
            © 2026 SivaClicks
          </p>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;