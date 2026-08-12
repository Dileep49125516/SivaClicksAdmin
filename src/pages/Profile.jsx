import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/adminService";

const Profile = () => {
  // ==========================================
  // Profile State
  // ==========================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  // ==========================================
  // Password State
  // ==========================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==========================================
  // Fetch Profile
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      setProfile({
        name: response.admin?.name || "",
        email: response.admin?.email || "",
      });
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Profile
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // Profile Input Change
  // ==========================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Password Input Change
  // ==========================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Update Profile
  // ==========================================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!profile.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
      });

      setProfile({
        name: response.admin?.name || profile.name,
        email: response.admin?.email || profile.email,
      });

      toast.success(
        response.message ||
          "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // Change Password
  // ==========================================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword) {
      toast.error(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      toast.error(
        "Please enter your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success(
        response.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Failed to change password:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ======================================
          Header
      ====================================== */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
          Account Settings
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account information and
          security settings.
        </p>
      </div>

      {/* ======================================
          Profile Header Card
      ====================================== */}

      <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
        <div className="relative p-8 sm:p-10">
          {/* Decorative Background */}

          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-3xl font-bold text-slate-950 shadow-lg shadow-amber-500/20">
              {profile.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            {/* Information */}

            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-amber-400">
                Administrator
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {profile.name}
              </h2>

              <p className="mt-1 flex items-center gap-2 text-slate-400">
                <Mail size={16} />

                {profile.email}
              </p>
            </div>

            {/* Security Badge */}

            <div className="sm:ml-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-400">
                <ShieldCheck size={17} />

                Account Secured
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          Personal Information
      ====================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500">
                Update your basic account information.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />

              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* ======================================
          Change Password
      ====================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Lock size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Change Password
              </h2>

              <p className="text-sm text-slate-500">
                Keep your administrator account secure.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-6"
        >
          {/* Current Password */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Current Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={
                  passwordData.currentPassword
                }
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* New Password */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Hint */}

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Password should contain at least 6
            characters.
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={18} />

              {changingPassword
                ? "Changing..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;