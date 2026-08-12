import api from "./api";

// Get all packages
export const getPackages = async () => {
  const response = await api.get("/packages");
  return response.data;
};

// Get single package
export const getPackageById = async (id) => {
  const response = await api.get(`/packages/${id}`);
  return response.data;
};

// Create package
export const createPackage = async (data) => {
  const response = await api.post(
    "/packages",
    data
  );

  return response.data;
};

// Update package
export const updatePackage = async (id, data) => {
  const response = await api.put(
    `/packages/${id}`,
    data
  );

  return response.data;
};

// Delete package
export const deletePackage = async (id) => {
  const response = await api.delete(
    `/packages/${id}`
  );

  return response.data;
};