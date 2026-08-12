import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  Eye,
  X,
  Phone,
  CalendarDays,
} from "lucide-react";

import {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../services/messageService";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ==========================================
  // Fetch Messages
  // ==========================================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await getMessages();

      setMessages(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ==========================================
  // Mark Read / Unread
  // ==========================================

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateMessageStatus(
        id,
        status
      );

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id
            ? response.data
            : message
        )
      );

      if (selectedMessage?._id === id) {
        setSelectedMessage(response.data);
      }

      toast.success(
        status === "Read"
          ? "Message marked as read"
          : "Message marked as unread"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update message"
      );
    }
  };

  // ==========================================
  // Delete Message
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      await deleteMessage(id);

      setMessages((prev) =>
        prev.filter((message) => message._id !== id)
      );

      setSelectedMessage(null);

      toast.success(
        "Message deleted successfully"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete message"
      );
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredMessages = messages.filter(
    (message) => {
      const searchText = search.toLowerCase();

      return (
        message.name
          ?.toLowerCase()
          .includes(searchText) ||
        message.email
          ?.toLowerCase()
          .includes(searchText) ||
        message.subject
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  const unreadCount = messages.filter(
    (message) => message.status === "Unread"
  ).length;

  return (
    <div className="space-y-6">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-800">
              Messages
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="mt-2 text-slate-500">
            Manage customer enquiries and messages.
          </p>
        </div>

        {/* Search */}

        <div className="relative w-full sm:w-80">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* ==========================================
          Stats
      ========================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Messages
            </p>

            <Mail className="text-amber-500" size={22} />
          </div>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {messages.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Unread
            </p>

            <Mail className="text-amber-500" size={22} />
          </div>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Read
            </p>

            <MailOpen
              className="text-green-500"
              size={22}
            />
          </div>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {messages.length - unreadCount}
          </p>
        </div>

      </div>

      {/* ==========================================
          Messages
      ========================================== */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">

            <Mail
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              No messages found
            </h2>

            <p className="mt-2 text-slate-500">
              Customer enquiries will appear here.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`flex flex-col gap-4 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between ${
                  message.status === "Unread"
                    ? "bg-amber-50/40"
                    : ""
                }`}
              >

                {/* Message Info */}

                <div className="flex min-w-0 items-start gap-4">

                  <div
                    className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      message.status === "Unread"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {message.status === "Unread" ? (
                      <Mail size={20} />
                    ) : (
                      <MailOpen size={20} />
                    )}
                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`truncate ${
                          message.status === "Unread"
                            ? "font-bold text-slate-800"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {message.name}
                      </h3>

                      {message.status === "Unread" && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {message.email}
                    </p>

                    <p className="mt-2 font-medium text-slate-700">
                      {message.subject}
                    </p>

                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {message.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        message.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>
                </div>

                {/* Actions */}

                <div className="flex shrink-0 items-center gap-2">

                  <button
                    onClick={() =>
                      setSelectedMessage(message)
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(
                        message._id,
                        message.status === "Unread"
                          ? "Read"
                          : "Unread"
                      )
                    }
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                    title={
                      message.status === "Unread"
                        ? "Mark as read"
                        : "Mark as unread"
                    }
                  >
                    {message.status === "Unread" ? (
                      <MailOpen size={18} />
                    ) : (
                      <Mail size={18} />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(message._id)
                    }
                    className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                    title="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ==========================================
          Message Modal
      ========================================== */}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 p-6">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Message Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Customer enquiry
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={22} />
              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-6 p-6">

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {selectedMessage.email}
                  </p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
                      <Phone size={16} />
                      {selectedMessage.phone}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
                    <CalendarDays size={16} />
                    {new Date(
                      selectedMessage.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Subject
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-800">
                  {selectedMessage.subject}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="whitespace-pre-wrap leading-7 text-slate-700">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Modal Actions */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() =>
                    handleStatusChange(
                      selectedMessage._id,
                      selectedMessage.status ===
                        "Unread"
                        ? "Read"
                        : "Unread"
                    )
                  }
                  className="flex-1 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600"
                >
                  {selectedMessage.status ===
                  "Unread"
                    ? "Mark as Read"
                    : "Mark as Unread"}
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      selectedMessage._id
                    )
                  }
                  className="flex-1 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;