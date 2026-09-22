import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import ArtistCard from "./ArtistCard";

const ArtistSection = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/artists/`)
      .then((response) => setArtists(response.data || []))
      .catch((requestError) => {
        console.error("Failed to fetch artists:", requestError);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className="bg-slate-50 px-6 py-10 sm:px-8 lg:px-12"
      aria-labelledby="artist-section-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <h2
          id="artist-section-title"
          className="mb-10 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
        >
          Featured Artists
        </h2>

        {loading && (
          <p className="py-12 text-center text-sm text-slate-500">
            Loading artists...
          </p>
        )}

        {!loading && error && (
          <p className="py-12 text-center text-sm text-slate-500">
            Could not load artists right now.
          </p>
        )}

        {!loading && !error && artists.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            No artists available right now.
          </p>
        )}

        {!loading && !error && artists.length > 0 && (
          <div className="flex gap-5 overflow-x-auto px-1 pb-4 sm:justify-start lg:justify-center">
            {artists.map((artist) => (
              <ArtistCard key={artist.id || artist.slug} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistSection;
