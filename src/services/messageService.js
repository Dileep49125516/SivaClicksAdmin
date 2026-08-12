import api from "./api";

// Public - Customer sends message
export const createMessage = async (data) => {
  const response = await api.post(
    "/messages",
    data
  );

  return response.data;
};

// Admin - Get all messages
export const getMessages = async () => {
  const response = await api.get("/messages");
  return response.data;
};

// Admin - Get one message
export const getMessageById = async (id) => {
  const response = await api.get(
    `/messages/${id}`
  );

  return response.data;
};

// Admin - Update status
export const updateMessageStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/messages/${id}/status`,
    { status }
  );

  return response.data;
};

// Admin - Delete
export const deleteMessage = async (id) => {
  const response = await api.delete(
    `/messages/${id}`
  );

  return response.data;
};