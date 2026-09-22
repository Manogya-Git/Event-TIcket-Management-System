import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BASE_URL } from "../api";
import { useAuth } from "../context/AuthContext";

const EventForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    organizer: "",
    venue: "",
    start_date: "",
    end_date: "",
    status: "DRAFT",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      if (slug) {
        await axios.patch(`${BASE_URL}/events/${slug}/`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await axios.post(`${BASE_URL}/events/`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      navigate("/admin/events");
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [accessToken]);

  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/events/${slug}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = response.data;
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          organizer: data.organizer,
          venue: data.venue,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
        });
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };

    fetchEvent();
  }, [slug, accessToken]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Event
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {slug ? "Edit Event" : "Create Event"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-700"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:text-base"
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:text-base"
                placeholder="Write event details"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-slate-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category ?? ""}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:text-base"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="organizer"
                className="text-sm font-medium text-slate-700"
              >
                Organizer
              </label>
              <input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:text-base"
                placeholder="Organizer name"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="venue"
                className="text-sm font-medium text-slate-700"
              >
                Venue
              </label>
              <input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:text-base"
                placeholder="Venue location"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="start_date"
                className="text-sm font-medium text-slate-700"
              >
                Start date
              </label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="end_date"
                className="text-sm font-medium text-slate-700"
              >
                End date
              </label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:text-base"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="image"
                className="text-sm font-medium text-slate-700"
              >
                Event image
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-medium file:text-white sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
            >
              {slug ? "Update Event" : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
