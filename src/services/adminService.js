import api from "./api";

// ==========================================
// Login Admin
// ==========================================
export const loginAdmin = async (data) => {
  const response = await api.post("/admin/login", data);
  return response.data;
};

// ==========================================
// Logout Admin
// ==========================================
export const logoutAdmin = async () => {
  const response = await api.post("/admin/logout");
  return response.data;
};

// ==========================================
// Get Admin Profile
// ==========================================
export const getProfile = async () => {
  const response = await api.get("/admin/profile");
  return response.data;
};

// ==========================================
// Update Admin Profile
// ==========================================
export const updateProfile = async (data) => {
  const response = await api.patch(
    "/admin/profile",
    data
  );

  return response.data;
};

// ==========================================
// Change Admin Password
// ==========================================
export const changePassword = async (data) => {
  const response = await api.patch(
    "/admin/profile/password",
    data
  );

  return response.data;
};