import api from "./api";

// ==========================================
// Get All Testimonials - Admin
// ==========================================

export const getTestimonials = async () => {
  const response = await api.get(
    "/testimonials/admin"
  );

  return response.data;
};

// ==========================================
// Get Testimonial By ID
// ==========================================

export const getTestimonialById = async (id) => {
  const response = await api.get(
    `/testimonials/admin/${id}`
  );

  return response.data;
};

// ==========================================
// Update Testimonial
// Used mainly for Approve / Reject
// ==========================================

export const updateTestimonial = async (
  id,
  data
) => {
  const response = await api.patch(
    `/testimonials/admin/${id}`,
    data
  );

  return response.data;
};

// ==========================================
// Delete Testimonial
// ==========================================

export const deleteTestimonial = async (id) => {
  const response = await api.delete(
    `/testimonials/admin/${id}`
  );

  return response.data;
};