import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Save, UploadCloud } from "lucide-react";
import { BASE_URL, mediaUrl } from "../../api";
import { useAuth } from "../../context/AuthContext";

const ArtistForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchArtist = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/artists/${slug}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setName(response.data.name || "");
        setImagePreview(mediaUrl(response.data.image));
      } catch (requestError) {
        console.error("Failed to fetch artist:", requestError);
        setError("Unable to load this artist.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [slug, accessToken]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (!selectedImage) return;
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const data = new FormData();
    data.append("name", name);
    if (image) data.append("image", image);

    try {
      const request = slug
        ? axios.patch(`${BASE_URL}/artists/${slug}/`, data, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        : axios.post(`${BASE_URL}/artists/`, data, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

      await request;
      navigate("/admin/artists");
    } catch (requestError) {
      console.error("Failed to save artist:", requestError);
      setError(
        requestError.response?.data?.detail ||
          "The artist could not be saved. Please check the form and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-slate-600">Loading artist...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/admin/artists")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to artists
        </button>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Artist details
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {slug ? "Edit artist" : "Create artist"}
            </h1>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="artist-name"
                className="text-sm font-semibold text-slate-700"
              >
                Artist name <span className="text-lime-600">*</span>
              </label>
              <input
                id="artist-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="e.g. The Local Band"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Artist image
              </span>
              <label
                htmlFor="artist-image"
                className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-slate-900 hover:bg-slate-100"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Artist preview"
                    className="h-40 w-full rounded-xl object-cover"
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
                  id="artist-image"
                  type="file"
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
                onClick={() => navigate("/admin/artists")}
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
                {saving ? "Saving..." : slug ? "Update artist" : "Save artist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistForm;
