import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import {
  getBookings,
  deleteBooking,
  updateBookingStatus,
} from "../services/bookingService";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  
  const [selectedBooking, setSelectedBooking] =
    useState(null);

 

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await getBookings();

      setBookings(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch bookings:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Update Status
  // ==========================

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await updateBookingStatus(
        id,
        status
      );

      toast.success(
        response.message ||
          "Booking status updated successfully"
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                status,
              }
            : booking
        )
      );

      
      setSelectedBooking((prev) =>
        prev?._id === id
          ? {
              ...prev,
              status,
            }
          : prev
      );
    } catch (error) {
      console.error(
        "Failed to update booking:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update booking"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      await deleteBooking(id);

      toast.success(
        "Booking deleted successfully"
      );

      setBookings((prevBookings) =>
        prevBookings.filter(
          (booking) => booking._id !== id
        )
      );

      
      if (selectedBooking?._id === id) {
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error(
        "Failed to delete booking:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete booking"
      );
    }
  };

  // ==========================
  // Load Bookings
  // ==========================

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================
  // Status Colors
  // ==========================

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-medium text-slate-500">
          Loading bookings...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Bookings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all photography bookings from
            here.
          </p>
        </div>

        {/* Booking Table */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead>
                <tr className="border-b bg-slate-50 text-left text-sm text-slate-500">

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Contact
                  </th>

                  <th className="px-6 py-4">
                    Service
                  </th>

                  <th className="px-6 py-4">
                    Package
                  </th>

                  <th className="px-6 py-4">
                    Event Date
                  </th>

                  <th className="px-6 py-4">
                    Location
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b last:border-b-0 hover:bg-slate-50"
                    >

                      {/* Customer */}

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-800">
                          {booking.fullName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {booking.email}
                        </p>
                      </td>

                      {/* Contact */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.phone}
                      </td>

                      {/* Service */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.service}
                      </td>

                      {/* Package */}

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        {booking.package}
                      </td>

                      {/* Event Date */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {new Date(
                          booking.eventDate
                        ).toLocaleDateString("en-IN")}
                      </td>

                      {/* Location */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.location}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <select
                          value={booking.status}
                          disabled={
                            updatingId ===
                            booking._id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              booking._id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-2 text-sm font-medium outline-none ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              setSelectedBooking(
                                booking
                              )
                            }
                            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                booking._id
                              )
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* Booking Count */}

        <p className="text-sm text-slate-500">
          Total bookings:{" "}
          <span className="font-semibold text-slate-700">
            {bookings.length}
          </span>
        </p>

      </div>

      {/* ==========================
          Booking Details Modal
      ========================== */}

      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b p-6">

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Booking Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete information about this booking
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={22} />
              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-6 p-6">

              {/* Customer Information */}

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Customer Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-sm text-slate-500">
                      Full Name
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {selectedBooking.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {selectedBooking.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-all font-medium text-slate-800">
                      {selectedBooking.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {selectedBooking.location}
                    </p>
                  </div>

                </div>
              </div>

              {/* Booking Information */}

              <div className="border-t pt-6">

                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Booking Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-sm text-slate-500">
                      Service
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {selectedBooking.service}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Package
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {selectedBooking.package}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Event Date
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {new Date(
                        selectedBooking.eventDate
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                </div>

              </div>

              {/* Requirements */}

              <div className="border-t pt-6">

                <h3 className="mb-3 text-lg font-semibold text-slate-800">
                  Customer Requirements
                </h3>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {selectedBooking.requirements ||
                      "No special requirements provided."}
                  </p>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t bg-slate-50 p-6">

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-xl bg-slate-800 px-5 py-2.5 font-medium text-white transition hover:bg-slate-700"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Bookings;