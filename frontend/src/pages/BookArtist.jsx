import React from "react";
import { useNavigate } from "react-router-dom";
import ArtistBookingForm from "../components/ArtistBookingForm";

const BookArtist = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-[#0b0b0b] text-white">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-3.5 py-2 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-lime-400 hover:bg-neutral-900 hover:text-lime-300"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 text-xs transition-colors group-hover:border-lime-400 group-hover:text-lime-300"
            >
              ←
            </span>
            Back
          </button>
        </div>

        <ArtistBookingForm />
      </main>
    </div>
  );
};

export default BookArtist;
