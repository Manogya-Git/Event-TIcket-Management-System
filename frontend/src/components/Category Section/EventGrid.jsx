import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import { Calendar, MapPin, Tag } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const EventGrid = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  

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

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10 text-gray-500">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center py-10 text-red-500">
        Failed to load events. Please try again later.
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full flex justify-center py-10 text-gray-500">
        No events available right now.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden w-80 flex flex-col hover:shadow-lg transition-shadow duration-200"
          >
            {/* Event image */}
            <div className="w-full h-56 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event details */}
            <div className="flex flex-col gap-3 px-5 py-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-500 shrink-0" />
                <span>{formatDate(event.start_date)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-500 shrink-0" />
                <span>{event.venue}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag size={16} className="text-gray-500 shrink-0" />
                <span>
                  {Array.isArray(event.prices)
                    ? event.prices.map((p) => `Rs. ${p}`).join(" ")
                    : `Rs. ${event.price}`}
                </span>
              </div>
            </div>

            {/* Buy tickets button */}
            <div className="px-5 pb-5">
              <button onClick={()=> navigate(`/buy-tickets/${event.slug}`)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-base transition-colors duration-150">
                BUY TICKETS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
