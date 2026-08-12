import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import Gallery from "../pages/Gallery";
import Messages from "../pages/Messages";
import Packages from "../pages/Packages";
import Testimonials from "../pages/Testimonials";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* ==========================
            Dashboard
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Bookings */}
          <Route
            path="bookings"
            element={<Bookings />}
          />

          {/* Gallery */}
          <Route
            path="gallery"
            element={<Gallery />}
          />

          {/* Messages */}
          <Route
            path="messages"
            element={<Messages />}
          />

          {/* Packages */}
          <Route
            path="packages"
            element={<Packages />}
          />

          {/* Testimonials */}
          <Route
            path="testimonials"
            element={<Testimonials />}
          />

          {/* Profile */}
          <Route
            path="profile"
            element={<Profile />}
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;