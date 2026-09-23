import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  MapPin,
  Save,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { BASE_URL, mediaUrl } from "../../api";
import { useAuth } from "../../context/AuthContext";

const VenueForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }
    try {
      if (slug) {
        await axios.patch(`${BASE_URL}/venues/${slug}/`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await axios.post(`${BASE_URL}/venues/`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      navigate("/admin/venue");
    } catch (error) {
      console.error("Failed to save venue:", error);
      setError(
        error.response?.data?.detail ||
          "The venue could not be saved. Please check the form and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchVenue = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/venues/${slug}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = response.data;
        setFormData({
          name: data.name || "",
          address: data.address || "",
          capacity: data.capacity ?? "",
          description: data.description || "",
        });
        setImagePreview(mediaUrl(data.image));
      } catch (error) {
        console.error("Failed to fetch venue:", error);
        setError("Unable to load this venue.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [slug, accessToken]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return <p className="p-8 text-slate-600">Loading venue...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/admin/venue")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to venues
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Venue details
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {slug ? "Edit venue" : "Create venue"}
              </h2>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Venue name <span className="text-lime-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. The Grand Hall"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="text-sm font-semibold text-slate-700"
                >
                  Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, city, or landmark"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="capacity"
                  className="text-sm font-semibold text-slate-700"
                >
                  Guest capacity <span className="text-lime-600">*</span>
                </label>
                <div className="relative">
                  <UsersRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="capacity"
                    type="number"
                    min="0"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 500"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Add a short description about the venue"
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Venue image
                </span>
                <label
                  htmlFor="image"
                  className="group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-slate-900 hover:bg-slate-100"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Venue preview"
                      className="h-32 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition group-hover:text-slate-900">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        Choose an image
                      </span>
                      <span className="mt-1 text-xs text-slate-400">
                        JPG, PNG, or WEBP
                      </span>
                    </>
                  )}
                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                {image && (
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <UploadCloud className="h-3.5 w-3.5" />
                    {image.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/admin/venue")}
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : slug ? "Update venue" : "Save venue"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VenueForm;
