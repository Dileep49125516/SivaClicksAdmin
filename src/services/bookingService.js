import api from "./api";

export const getBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(
    `/bookings/${id}/status`,
    { status }
  );

  return response.data;
};