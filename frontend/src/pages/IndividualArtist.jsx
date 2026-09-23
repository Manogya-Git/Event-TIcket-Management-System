import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mic2 } from "lucide-react";
import { BASE_URL, mediaUrl } from "../api";

const IndividualArtist = () => {
  const { slug } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/artists/${slug}/`)
      .then((response) => setArtist(response.data))
      .catch((requestError) => {
        console.error("Failed to fetch artist:", requestError);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="p-8 text-center text-slate-600">Loading artist...</p>;
  }

  if (error || !artist) {
    return (
      <div className="p-8 text-center text-slate-600">
        <p>Could not load this artist.</p>
        <Link
          to="/artists"
          className="mt-4 inline-block font-semibold text-green-600"
        >
          Back to artists
        </Link>
      </div>
    );
  }

  const image = mediaUrl(artist.image);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/artists"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to artists
        </Link>

        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm sm:flex">
          <div className="h-80 bg-slate-100 sm:h-auto sm:w-1/2">
            {image ? (
              <img
                src={image}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center text-slate-400">
                <Mic2 size={56} />
              </div>
            )}
          </div>
          <div className="space-y-4 p-8 sm:flex sm:w-1/2 sm:flex-col sm:justify-center">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {artist.name}
            </h1>
            <p className="whitespace-pre-line leading-7 text-slate-600">
              {artist.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndividualArtist;
