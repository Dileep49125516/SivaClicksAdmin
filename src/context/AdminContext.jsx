import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getProfile,
  loginAdmin,
  logoutAdmin,
} from "../services/adminService";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      setAdmin(response.admin);
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Login
  // ==========================

  const login = async (formData) => {
    const response = await loginAdmin(formData);

    setAdmin(response.admin);

    toast.success(response.message);

    return response;
  };

  // ==========================
  // Logout
  // ==========================

  const logout = async () => {
    await logoutAdmin();

    setAdmin(null);

    toast.success("Logged out successfully");
  };

  // ==========================
  // Check Login on App Start
  // ==========================

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};