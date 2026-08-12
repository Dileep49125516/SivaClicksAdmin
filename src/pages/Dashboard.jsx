import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  Image,
  Package,
} from "lucide-react";

import StatCard from "../components/common/StatCard";
import BookingTable from "../components/dashboard/BookingTable";

import { getDashboardStats } from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Fetch Dashboard Stats
  // ==========================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await getDashboardStats();

      setStats(response.stats);
    } catch (error) {
      console.error(
        "Failed to fetch dashboard stats:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Dashboard
  // ==========================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

          <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ==========================
          Page Header
      ========================== */}

      <div className="px-1">
        <h1 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">
          Welcome Back 👋
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Manage bookings, gallery and photography
          services from one place.
        </p>
      </div>

      {/* ==========================
          Statistics
      ========================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 xl:grid-cols-4">

        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings ?? 0}
          icon={CalendarDays}
          color="bg-blue-500"
        />

        <StatCard
          title="Pending"
          value={stats?.pendingBookings ?? 0}
          icon={Clock3}
          color="bg-yellow-500"
        />

        <StatCard
          title="Gallery Images"
          value={stats?.galleryImages ?? 0}
          icon={Image}
          color="bg-green-500"
        />

        <StatCard
          title="Packages"
          value={stats?.packages ?? 0}
          icon={Package}
          color="bg-purple-500"
        />

      </div>

      {/* ==========================
          Recent Bookings
      ========================== */}

      <div className="w-full overflow-hidden rounded-2xl">
        <BookingTable
          bookings={stats?.recentBookings || []}
        />
      </div>

    </div>
  );
};

export default Dashboard;