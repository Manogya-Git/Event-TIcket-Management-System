import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { BASE_URL } from "../api";
import Category from "../components/Category";
import Footer from "../components/Footer";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/events/`)
      .then((response) => {
        const visible = response.data.filter(
          (event) => event.status !== "CANCELLED",
        );
        setEvents(visible);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (events.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % events.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [events.length]);

  const activeEvent = events[activeIndex];

  return (
    <>
      <div className=" bg-[#363535]">
        <section className="flex flex-col">
          {loading && (
            <p className="px-8 py-16 text-center text-neutral-400">
              Loading events...
            </p>
          )}
          {error && (
            <p className="px-8 py-16 text-center text-neutral-400">
              Could not load events. Make sure the Django API is running.
            </p>
          )}
          {!loading && !error && events.length === 0 && (
            <p className="px-8 py-16 text-center text-neutral-400">
              No events yet.
            </p>
          )}

          {activeEvent && <EventCard event={activeEvent} />}

          {events.length > 1 && (
            <div className="flex justify-center gap-3 pb-8 pt-2">
              {events.map((event, index) => (
                <button
                  key={event.id ?? index}
                  type="button"
                  aria-label={`Show event ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-10 bg-white"
                      : "w-10 bg-neutral-600 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
        <Category />
      </div>
    </>
  );
};

export default HomePage;
