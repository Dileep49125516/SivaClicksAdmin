import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Camera,
} from "lucide-react";

import {
  getPackages,
  deletePackage,
  updatePackage,
} from "../services/packageService";

import PackageModal from "../components/packages/PackageModal";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState(null);

  // ==========================================
  // Fetch Packages
  // ==========================================

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const response = await getPackages();

      setPackages(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load packages."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchPackages();
  }, []);

  // ==========================================
  // Add Package
  // ==========================================

  const handleAdd = () => {
    setSelectedPackage(null);
    setShowModal(true);
  };

  // ==========================================
  // Edit Package
  // ==========================================

  const handleEdit = (packageData) => {
    setSelectedPackage(packageData);
    setShowModal(true);
  };

  // ==========================================
  // Delete Package
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmed) return;

    try {
      await deletePackage(id);

      toast.success(
        "Package deleted successfully."
      );

      setPackages((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete package."
      );
    }
  };

  // ==========================================
  // Toggle Active Status
  // ==========================================

  const handleToggleActive = async (packageData) => {
    try {
      const response = await updatePackage(
        packageData._id,
        {
          isActive: !packageData.isActive,
        }
      );

      setPackages((prev) =>
        prev.map((item) =>
          item._id === packageData._id
            ? response.data
            : item
        )
      );

      toast.success(
        packageData.isActive
          ? "Package deactivated."
          : "Package activated."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update package."
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            Services
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800">
            Packages
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your photography packages and pricing.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-600"
        >
          <Plus size={20} />
          Add Package
        </button>
      </div>

      {/* ==========================================
          Loading
      ========================================== */}

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

          <p className="mt-4 text-slate-500">
            Loading packages...
          </p>
        </div>
      ) : packages.length === 0 ? (
        /* ==========================================
           Empty State
        ========================================== */

        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <Camera
              size={30}
              className="text-amber-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-800">
            No packages yet
          </h2>

          <p className="mt-2 text-slate-500">
            Create your first photography package.
          </p>

          <button
            onClick={handleAdd}
            className="mt-6 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
          >
            Create Package
          </button>
        </div>
      ) : (
        /* ==========================================
           Package Grid
        ========================================== */

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Popular Badge */}

              {item.popular && (
                <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  <Star size={14} fill="currentColor" />
                  Popular
                </div>
              )}

              {/* Image */}

              {item.imageUrl ? (
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-slate-100">
                  <Camera
                    size={42}
                    className="text-slate-300"
                  />
                </div>
              )}

              {/* Content */}

              <div className="p-6">

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-2xl font-bold text-amber-500">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Status */}

                  {item.isActive ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      <CheckCircle size={14} />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      <XCircle size={14} />
                      Inactive
                    </span>
                  )}
                </div>

                {/* Description */}

                {item.description && (
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}

                {/* Features */}

                <div className="mt-5 space-y-3">
                  {item.features?.map(
                    (feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <CheckCircle
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-500"
                        />

                        <span>
                          {feature.text}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Actions */}

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">

                  <button
                    onClick={() =>
                      handleEdit(item)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleToggleActive(item)
                    }
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      item.isActive
                        ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {item.isActive
                      ? "Hide"
                      : "Activate"}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          Add / Edit Modal
      ========================================== */}

      {showModal && (
        <PackageModal
          packageData={selectedPackage}
          onClose={() => {
            setShowModal(false);
            setSelectedPackage(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedPackage(null);
            fetchPackages();
          }}
        />
      )}
    </div>
  );
};

export default Packages;