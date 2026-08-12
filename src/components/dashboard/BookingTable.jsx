const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Confirmed":
      return "bg-blue-100 text-blue-700";

    case "Completed":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const BookingTable = ({ bookings = [] }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Recent Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-slate-500">
              <th className="pb-3">Customer</th>
              <th className="pb-3">Package</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-4 font-medium">
                    {booking.fullName}
                  </td>

                  <td>
                    {booking.package}
                  </td>

                  <td>
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-8 text-center text-slate-500"
                >
                  No recent bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;