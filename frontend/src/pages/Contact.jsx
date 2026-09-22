import axios from "axios";
import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { BASE_URL } from "../api";

const initialForm = {
  full_name: "",
  email: "",
  contact_number: "",
  subject: "",
  details: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      await axios.post(`${BASE_URL}/contact/`, formData);
      setFormData(initialForm);
      setSuccess("Thanks for reaching out. We will get back to you soon.");
    } catch (requestError) {
      console.error("Failed to send contact message:", requestError);
      setError(
        requestError.response?.data?.detail ||
          "We could not send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-sm border border-slate-400 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10";

  return (
    <main className="min-h-screen border-t-2 border-slate-950 bg-white px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <section className="pt-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Connect With Us
          </h1>
          <p className="mt-4 max-w-md text-base leading-5 text-slate-900">
            Get in touch with our team for all your inquiries, feedback and
            complaint
          </p>

          <div className="mt-10 space-y-4 text-base text-slate-600">
            <div className="flex items-center gap-5">
              <MapPin className="h-5 w-5 shrink-0 text-slate-500" />
              <span>Kupondole, Lalitpur</span>
            </div>
            <div className="flex items-center gap-5">
              <Mail className="h-5 w-5 shrink-0 text-slate-500" />
              <a
                href="mailto:tickets@kgarira.com"
                className="hover:text-slate-950"
              >
                tickets@kgarira.com
              </a>
            </div>
            <div className="flex items-center gap-5">
              <Phone className="h-5 w-5 shrink-0 text-slate-500" />
              <a href="tel:9705427472" className="hover:text-slate-950">
                9705427472
              </a>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className={inputClassName}
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            aria-label="Full Name"
            required
          />
          <input
            className={inputClassName}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            aria-label="Email Address"
            required
          />
          <input
            className={inputClassName}
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            placeholder="Contact number"
            aria-label="Contact number"
            required
          />
          <select
            className={`${inputClassName} appearance-auto`}
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            aria-label="Subject"
            required
          >
            <option value="" disabled>
              Subject
            </option>
            <option value="General inquiry">General inquiry</option>
            <option value="Event booking">Event booking</option>
            <option value="Feedback">Feedback</option>
            <option value="Complaint">Complaint</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            className={`${inputClassName} min-h-52 resize-y`}
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Details"
            aria-label="Details"
            required
          />

          {success && <p className="text-sm text-emerald-700">{success}</p>}
          {error && <p className="text-sm text-rose-700">{error}</p>}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-lime-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-lime-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Contact;
