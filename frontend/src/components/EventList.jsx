import axios from "axios";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";

const EventList = () => {
  const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/events/`)
      .then((response) => setEvents(response.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white p-8">Loading events...</p>;
  if (error) return <p className="text-white p-8">Something went wrong.</p>;

  return (
    <div className="px-8 py-6">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="w-full flex-shrink-0">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {events.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show event ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-10 bg-white"
                : "w-10 bg-neutral-600 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;
