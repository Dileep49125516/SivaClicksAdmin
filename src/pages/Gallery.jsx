import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Image as ImageIcon,
  Trash2,
  Eye,
  X,
  Search,
  Images,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getGallery,
  deleteGalleryImage,
} from "../services/galleryService";

import GalleryModal from "../components/gallery/GalleryModal";

const categories = [
  "All",
  "Wedding",
  "Pre-Wedding",
  "Birthday",
  "Baby Shoot",
  "Events",
  "Portrait",
  "Others",
];

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  // ==========================
  // Fetch Gallery
  // ==========================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await getGallery();

      setGallery(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load gallery"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Gallery
  // ==========================

  useEffect(() => {
    fetchGallery();
  }, []);

  // ==========================
  // Delete Image
  // ==========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    try {
      await deleteGalleryImage(id);

      toast.success(
        "Gallery image deleted successfully"
      );

      setGallery((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete image"
      );
    }
  };

  // ==========================
  // Filter Gallery
  // ==========================

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      const searchText = search.toLowerCase();

      const matchesSearch =
        item.title?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.description
          ?.toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [gallery, activeCategory, search]);

  return (
    <div className="space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100">
              <Images
                size={22}
                className="text-amber-600"
              />
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Photography Collection
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Gallery
          </h1>

          <p className="mt-2 max-w-xl text-slate-500">
            Manage and showcase your photography
            collection from one place.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <Plus size={19} />
          Add Image
        </button>
      </div>

      {/* ==========================
          Stats
      ========================== */}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Images
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {gallery.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                <ImageIcon
                  size={21}
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {new Set(
                gallery.map((item) => item.category)
              ).size}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Showing
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {filteredGallery.length}
            </p>
          </div>
        </div>
      )}

      {/* ==========================
          Search + Filters
      ========================== */}

      {!loading && gallery.length > 0 && (
        <div className="space-y-4">

          {/* Search */}

          <div className="relative max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search gallery..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          {/* Categories */}

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==========================
          Loading
      ========================== */}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(
            (item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            )
          )}
        </div>
      ) : gallery.length === 0 ? (

        /* ==========================
           Empty State
        ========================== */

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50">
            <ImageIcon
              size={36}
              className="text-amber-500"
            />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-800">
            Your gallery is empty
          </h2>

          <p className="mx-auto mt-2 max-w-md text-slate-500">
            Start building your photography
            collection by uploading your first image.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={19} />
            Upload First Image
          </button>
        </div>

      ) : filteredGallery.length === 0 ? (

        /* ==========================
           No Search Results
        ========================== */

        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <Search
            size={40}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            No images found
          </h2>

          <p className="mt-2 text-slate-500">
            Try another search or category.
          </p>
        </div>

      ) : (

        /* ==========================
           Gallery Grid
        ========================== */

        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filteredGallery.map((item) => (
              <motion.div
                layout
                key={item._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}

                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  {/* Category */}

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                      {item.category}
                    </span>
                  </div>

                  {/* Preview */}

                  <button
                    onClick={() =>
                      setPreviewImage(item)
                    }
                    className="absolute bottom-4 left-4 flex translate-y-3 items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Eye size={16} />
                    Preview
                  </button>

                  {/* Delete */}

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="absolute bottom-4 right-4 flex translate-y-3 items-center justify-center rounded-xl bg-red-500 p-2.5 text-white opacity-0 shadow-lg transition duration-300 hover:bg-red-600 group-hover:translate-y-0 group-hover:opacity-100"
                    title="Delete image"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {/* Details */}

                <div className="p-5">
                  <h2 className="truncate text-lg font-semibold text-slate-900">
                    {item.title}
                  </h2>

                  {item.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-400">
                      No description added.
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ==========================
          Add Image Modal
      ========================== */}

      {showModal && (
        <GalleryModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchGallery}
        />
      )}

      {/* ==========================
          Image Preview
      ========================== */}

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() =>
              setPreviewImage(null)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.25,
              }}
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {/* Close */}

              <button
                onClick={() =>
                  setPreviewImage(null)
                }
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
              >
                <X size={20} />
              </button>

              {/* Image */}

              <img
                src={previewImage.imageUrl}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />

              {/* Preview Details */}

              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {previewImage.title}
                    </h2>

                    <p className="mt-1 text-sm text-amber-600">
                      {previewImage.category}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(
                        previewImage._id
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                {previewImage.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {previewImage.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;