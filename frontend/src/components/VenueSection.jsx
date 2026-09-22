import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import VenueCard from "./VenueCard";

const VenueSection = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/venues/`)
      .then((response) => setVenues(response.data || []))
      .catch((requestError) => {
        console.error("Failed to fetch venues:", requestError);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className="bg-white px-6 py-10 sm:px-8 lg:px-12"
      aria-labelledby="venue-section-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <h2
          id="venue-section-title"
          className="mb-10 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
        >
          Venues by Cities
        </h2>

        {loading && (
          <p className="py-12 text-center text-sm text-slate-500">
            Loading venues...
          </p>
        )}

        {!loading && error && (
          <p className="py-12 text-center text-sm text-slate-500">
            Could not load venues right now.
          </p>
        )}

        {!loading && !error && venues.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            No venues available right now.
          </p>
        )}

        {!loading && !error && venues.length > 0 && (
          <div className="flex gap-5 overflow-x-auto px-1 pb-4 sm:justify-start lg:justify-center">
            {venues.map((venue) => (
              <VenueCard key={venue.id || venue.slug} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VenueSection;
