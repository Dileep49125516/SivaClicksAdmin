import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, X } from "lucide-react";

import {
  createPackage,
  updatePackage,
} from "../../services/packageService";

const iconOptions = [
  "Camera",
  "Video",
  "Image",
  "Album",
  "Drone",
  "Clock",
];

const PackageModal = ({
  packageData,
  onClose,
  onSuccess,
}) => {
  const isEdit = Boolean(packageData);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    popular: false,
    isActive: true,
    features: [
      {
        icon: "Camera",
        text: "",
      },
    ],
  });

  // ==========================================
  // Load Existing Package
  // ==========================================

  useEffect(() => {
    if (packageData) {
      setFormData({
        name: packageData.name || "",
        price: packageData.price || "",
        description:
          packageData.description || "",
        imageUrl: packageData.imageUrl || "",
        popular: packageData.popular || false,
        isActive:
          packageData.isActive !== false,
        features:
          packageData.features?.length > 0
            ? packageData.features.map((feature) => ({
                icon: feature.icon || "Camera",
                text: feature.text || "",
              }))
            : [
                {
                  icon: "Camera",
                  text: "",
                },
              ],
      });
    }
  }, [packageData]);

  // ==========================================
  // Handle Input
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Toggle
  // ==========================================

  const handleToggle = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ==========================================
  // Feature Change
  // ==========================================

  const handleFeatureChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map(
        (feature, featureIndex) =>
          featureIndex === index
            ? {
                ...feature,
                [field]: value,
              }
            : feature
      ),
    }));
  };

  // ==========================================
  // Add Feature
  // ==========================================

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          icon: "Camera",
          text: "",
        },
      ],
    }));
  };

  // ==========================================
  // Remove Feature
  // ==========================================

  const removeFeature = (index) => {
    if (formData.features.length === 1) {
      toast.error(
        "Package must have at least one feature."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter(
        (_, featureIndex) =>
          featureIndex !== index
      ),
    }));
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Package name is required.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      toast.error(
        "Please enter a valid package price."
      );
      return;
    }

    const validFeatures =
      formData.features.filter(
        (feature) => feature.text.trim()
      );

    if (validFeatures.length === 0) {
      toast.error(
        "Please add at least one feature."
      );
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description:
        formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      popular: formData.popular,
      isActive: formData.isActive,
      features: validFeatures.map(
        (feature) => ({
          icon: feature.icon,
          text: feature.text.trim(),
        })
      ),
    };

    try {
      setLoading(true);

      if (isEdit) {
        await updatePackage(
          packageData._id,
          payload
        );

        toast.success(
          "Package updated successfully."
        );
      } else {
        await createPackage(payload);

        toast.success(
          "Package created successfully."
        );
      }

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            isEdit ? "update" : "create"
          } package.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* ======================================
            Header
        ====================================== */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5 sm:px-8">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              Package Management
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              {isEdit
                ? "Edit Package"
                : "Add Package"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* ======================================
            Form
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8"
        >

          {/* Package Name */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Package Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Gold"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* Price */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Price
            </label>

            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 text-slate-500">
                ₹
              </span>

              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="35000"
                className="w-full rounded-r-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe what this package includes..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* Image URL */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Image URL
            </label>

            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/package.jpg"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Optional. You can add a Cloudinary image URL.
            </p>
          </div>

          {/* Toggles */}

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Popular */}

            <button
              type="button"
              onClick={() =>
                handleToggle("popular")
              }
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                formData.popular
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-800">
                  Popular Package
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Highlight this package
                </p>
              </div>

              <div
                className={`h-6 w-11 rounded-full p-1 transition ${
                  formData.popular
                    ? "bg-amber-500"
                    : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    formData.popular
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </button>

            {/* Active */}

            <button
              type="button"
              onClick={() =>
                handleToggle("isActive")
              }
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                formData.isActive
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-800">
                  Active Package
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Show on public website
                </p>
              </div>

              <div
                className={`h-6 w-11 rounded-full p-1 transition ${
                  formData.isActive
                    ? "bg-green-500"
                    : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    formData.isActive
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </button>

          </div>

          {/* ======================================
              Features
          ====================================== */}

          <div>

            <div className="mb-3 flex items-center justify-between">
              <div>
                <label className="font-semibold text-slate-800">
                  Package Features
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Add everything included in this package.
                </p>
              </div>

              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-100"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-3">

              {formData.features.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >

                    {/* Icon */}

                    <select
                      value={feature.icon}
                      onChange={(e) =>
                        handleFeatureChange(
                          index,
                          "icon",
                          e.target.value
                        )
                      }
                      className="w-28 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-amber-500"
                    >
                      {iconOptions.map(
                        (icon) => (
                          <option
                            key={icon}
                            value={icon}
                          >
                            {icon}
                          </option>
                        )
                      )}
                    </select>

                    {/* Text */}

                    <input
                      type="text"
                      value={feature.text}
                      onChange={(e) =>
                        handleFeatureChange(
                          index,
                          "text",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 2 Professional Photographers"
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                    />

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(index)
                      }
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                )
              )}

            </div>
          </div>

          {/* ======================================
              Buttons
          ====================================== */}

          <div className="flex gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Package"
                : "Create Package"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default PackageModal;