import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { BASE_URL } from "../api";
import { formatDate } from "../utils/dateUtils";
import axios from "axios";

const CheckoutLayout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/events/${slug}/`);
        setEvent(response.data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-svh bg-black flex flex-col items-center justify-center text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-lime-400" />
        <p className="mt-4 text-neutral-400">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-svh bg-black flex flex-col items-center justify-center px-6 text-center text-white">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <p className="mt-2 text-neutral-400">
          {error || "The event you are looking for does not exist."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full border border-neutral-700 px-5 py-2 text-sm text-neutral-300 hover:border-lime-400 hover:text-lime-400 transition-colors"
        >
          Back to events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-black text-white">
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* TODO: Stepper goes here once built */}

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Left: event details (persists across all checkout steps) */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
              <img
                src={event.image}
                alt={event.title}
                className="h-72 w-full object-cover md:h-96"
              />
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-col gap-2 text-neutral-400 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-lime-400" />
                {formatDate(event.start_date)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-lime-400" />
                {event.venue}
              </span>
            </div>

            {event.description && (
              <p className="mt-6 max-w-2xl leading-relaxed text-neutral-300">
                {event.description}
              </p>
            )}
          </div>

          {/* Right: swaps between TicketSelection / PersonalDetails / Payment */}
          <Outlet context={{ event }} />
        </div>
      </main>
    </div>
  );
};

export default CheckoutLayout;