import { useState } from "react";
import toast from "react-hot-toast";

import { uploadGalleryImage } from "../../services/galleryService";

const categories = [
  "Wedding",
  "Pre-Wedding",
  "Birthday",
  "Baby Shoot",
  "Events",
  "Portrait",
  "Others",
];

const GalleryModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append(
        "description",
        formData.description
      );
      data.append("image", formData.image);

      await uploadGalleryImage(data);

      toast.success(
        "Gallery image uploaded successfully."
      );

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to upload image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add Gallery Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a new photography image.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Title */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter image title"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
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
              placeholder="Enter description"
              rows="3"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          {/* Image */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full rounded-xl border border-slate-300 p-3"
            />

            <p className="mt-2 text-xs text-slate-500">
              Maximum file size: 5MB
            </p>
          </div>

          {/* Buttons */}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Uploading..."
                : "Upload Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryModal;