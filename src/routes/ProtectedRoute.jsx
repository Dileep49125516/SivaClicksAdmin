import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-lg font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;