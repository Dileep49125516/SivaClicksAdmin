import api from "./api";

export const getGallery = async () => {
  const response = await api.get("/gallery");
  return response.data;
};

export const uploadGalleryImage = async (formData) => {
  const response = await api.post(
    "/gallery",
    formData
  );

  return response.data;
};

export const deleteGalleryImage = async (id) => {
  const response = await api.delete(
    `/gallery/${id}`
  );

  return response.data;
};