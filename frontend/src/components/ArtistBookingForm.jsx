import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import { BASE_URL } from "../api";

const ArtistBookingForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    event_name: "",
    event_category: "",
    company_name: "",
    company_address: "",
    event_date: "",
    message: "",
    artist: "",
  });
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/`);
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/artists/`);
        setArtists(response.data || []);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    };

    fetchCategories();
    fetchArtists();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3.5 text-sm text-white placeholder-neutral-500 transition duration-200 hover:border-neutral-700 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        artist: Number(formData.artist),
        event_category: Number(formData.event_category),
      };

      await axios.post(`${BASE_URL}/booking/artist-inquiries/`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Artist inquiry sent successfully!");
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        event_name: "",
        event_category: "",
        company_name: "",
        company_address: "",
        event_date: "",
        message: "",
        artist: "",
      });
    } catch (error) {
      console.error(error);

      let errorMessage = "Failed to send inquiry. Please try again.";
      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage =
          errorData.message ||
          Object.entries(errorData)
            .map(([field, errs]) => `${field}: ${errs}`)
            .join(" | ") ||
          errorMessage;
      } else if (error.request) {
        errorMessage =
          "Could not reach the server. Please check your connection.";
      }

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
        <div className="mb-8 border-b border-neutral-800 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-lime-400">
            Artist inquiry
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Book an Artist
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Share your details and we&apos;ll connect you with the right artist.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.toLowerCase().includes("success")
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="group">
              <label
                htmlFor="full_name"
                className="text-sm font-medium text-neutral-300"
              >
                Full Name<span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
                required
              />
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-300"
              >
                Email<span className="text-lime-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>

            <div className="group">
              <label
                htmlFor="phone_number"
                className="text-sm font-medium text-neutral-300"
              >
                Phone Number<span className="text-lime-400">*</span>
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Your phone number"
                className={inputClass}
                required
              />
            </div>

            <div className="group">
              <label
                htmlFor="event_date"
                className="text-sm font-medium text-neutral-300"
              >
                Event Date<span className="text-lime-400">*</span>
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-400" />
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  onClick={(event) => event.currentTarget.showPicker?.()}
                  className={`${inputClass} cursor-pointer pr-12`}
                  required
                />
              </div>
            </div>

            <div className="group md:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-neutral-300"
              >
                Address<span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
                className={inputClass}
                required
              />
            </div>

            <div className="group">
              <label
                htmlFor="artist"
                className="text-sm font-medium text-neutral-300"
              >
                Artist<span className="text-lime-400">*</span>
              </label>
              <select
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
                required
              >
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label
                htmlFor="event_name"
                className="text-sm font-medium text-neutral-300"
              >
                Event Name<span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                id="event_name"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="Event name"
                className={inputClass}
                required
              />
            </div>

            <div className="group">
              <label
                htmlFor="event_category"
                className="text-sm font-medium text-neutral-300"
              >
                Event Category<span className="text-lime-400">*</span>
              </label>
              <select
                id="event_category"
                name="event_category"
                value={formData.event_category}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label
                htmlFor="company_name"
                className="text-sm font-medium text-neutral-300"
              >
                Company Name<span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company name"
                className={inputClass}
                required
              />
            </div>

            <div className="group">
              <label
                htmlFor="company_address"
                className="text-sm font-medium text-neutral-300"
              >
                Company Address<span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                id="company_address"
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                placeholder="Company address"
                className={inputClass}
                required
              />
            </div>

            <div className="group md:col-span-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-neutral-300"
              >
                Message<span className="text-lime-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your event"
                rows="5"
                className={`${inputClass} resize-none`}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-semibold text-neutral-950 transition-colors duration-200 hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArtistBookingForm;
