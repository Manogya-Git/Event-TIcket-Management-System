import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Building2, MapPin, UsersRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL, mediaUrl } from "../api";

const IndividualVenue = () => {
  const { slug } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/venues/${slug}/`)
      .then((response) => setVenue(response.data))
      .catch((requestError) => {
        console.error("Failed to fetch venue:", requestError);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="p-8 text-center text-slate-600">Loading venue...</p>;
  }

  if (error || !venue) {
    return (
      <div className="p-8 text-center text-slate-600">
        <p>Could not load this venue.</p>
        <Link
          to="/venues"
          className="mt-4 inline-block font-semibold text-green-600"
        >
          Back to venues
        </Link>
      </div>
    );
  }

  const image = mediaUrl(venue.image);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/venues"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to venues
        </Link>

        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm sm:flex">
          <div className="h-80 bg-slate-100 sm:h-auto sm:w-1/2">
            {image ? (
              <img
                src={image}
                alt={venue.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center text-slate-400">
                <Building2 size={56} />
              </div>
            )}
          </div>
          <div className="space-y-5 p-8 sm:w-1/2">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {venue.name}
            </h1>
            <p className="whitespace-pre-line leading-7 text-slate-600">
              {venue.description || "No description available."}
            </p>
            {venue.address && (
              <p className="flex items-start gap-3 text-slate-600">
                <MapPin size={20} className="mt-0.5 shrink-0" />
                {venue.address}
              </p>
            )}
            {venue.capacity !== undefined && venue.capacity !== null && (
              <p className="flex items-center gap-3 text-slate-600">
                <UsersRound size={20} className="shrink-0" />
                Capacity: {venue.capacity}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndividualVenue;
