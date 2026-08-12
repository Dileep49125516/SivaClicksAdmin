import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Check,
  Trash2,
  Star,
  MessageSquare,
} from "lucide-react";

import {
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../services/testimonialService";

const Testimonials = () => {
  const [testimonials, setTestimonials] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState(null);

  // ==========================================
  // Fetch Testimonials
  // ==========================================

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response =
        await getTestimonials();

      setTestimonials(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load testimonials:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Testimonials
  // ==========================================

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ==========================================
  // Approve Testimonial
  // ==========================================

  const handleApprove = async (id) => {
    try {
      setActionId(id);

      await updateTestimonial(id, {
        approved: true,
      });

      toast.success(
        "Testimonial approved successfully."
      );

      setTestimonials((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                approved: true,
              }
            : item
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve testimonial."
      );
    } finally {
      setActionId(null);
    }
  };

  // ==========================================
  // Delete Testimonial
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);

      await deleteTestimonial(id);

      toast.success(
        "Testimonial deleted successfully."
      );

      setTestimonials((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete testimonial."
      );
    } finally {
      setActionId(null);
    }
  };

  // ==========================================
  // Render Stars
  // ==========================================

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Testimonials
          </h1>

          <p className="mt-2 text-slate-500">
            Manage customer reviews and ratings.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

          <p className="mt-4 text-slate-500">
            Loading testimonials...
          </p>
        </div>

      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ======================================
          Header
      ====================================== */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
          Customer Feedback
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-800">
          Testimonials
        </h1>

        <p className="mt-2 text-slate-500">
          Review and manage customer ratings
          and testimonials.
        </p>
      </div>

      {/* ======================================
          Stats
      ====================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-amber-50 p-3">
              <MessageSquare
                className="text-amber-500"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Reviews
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {testimonials.length}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3">
              <Check
                className="text-green-600"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Approved
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {
                  testimonials.filter(
                    (item) =>
                      item.approved
                  ).length
                }
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-orange-50 p-3">
              <Star
                className="fill-amber-400 text-amber-400"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {
                  testimonials.filter(
                    (item) =>
                      !item.approved
                  ).length
                }
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ======================================
          Empty State
      ====================================== */}

      {testimonials.length === 0 ? (
        <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <MessageSquare
              size={30}
              className="text-slate-400"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-800">
            No testimonials yet
          </h2>

          <p className="mt-2 text-slate-500">
            Customer reviews will appear here
            once they are submitted.
          </p>

        </div>
      ) : (
        /* ====================================
           Testimonials Grid
        ==================================== */

        <div className="grid gap-6 lg:grid-cols-2">

          {testimonials.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-lg"
            >

              {/* Top Section */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-amber-400">
                    {item.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {item.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {item.email}
                    </p>
                  </div>

                </div>

                {/* Status */}

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.approved
                    ? "Approved"
                    : "Pending"}
                </span>

              </div>

              {/* Rating */}

              <div className="mt-5 flex items-center gap-3">

                {renderStars(
                  item.rating
                )}

                <span className="text-sm font-semibold text-slate-600">
                  {item.rating}/5
                </span>

              </div>

              {/* Review */}

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">

                <p className="leading-7 text-slate-600">
                  "{item.review}"
                </p>

              </div>

              {/* Service */}

              {item.service && (
                <div className="mt-4">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {item.service}
                  </span>
                </div>
              )}

              {/* Actions */}

              <div className="mt-6 flex gap-3">

                {!item.approved && (
                  <button
                    onClick={() =>
                      handleApprove(
                        item._id
                      )
                    }
                    disabled={
                      actionId === item._id
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Check size={18} />

                    {actionId === item._id
                      ? "Processing..."
                      : "Approve"}
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(
                      item._id
                    )
                  }
                  disabled={
                    actionId === item._id
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={18} />

                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Testimonials;