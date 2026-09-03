import React from "react";
import { formatDate } from "../utils/dateUtils";
import { mediaUrl } from "../api";

const Icon = ({ children }) => (
  <span className="mt-0.5 shrink-0 text-white">{children}</span>
);

const EventCard = ({ event }) => {
  if (!event) return null;

  const tickets = event.tickets ?? [];
  const prices = tickets
    .map((ticket) => Number(ticket.price))
    .filter((price) => Number.isFinite(price));
  const imageSrc = mediaUrl(event.image);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-6 py-10 md:flex-row md:items-center md:gap-16 md:px-10 md:py-14">
      <div className="w-full max-w-xl shrink-0 md:w-[46%]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={event.title}
            className="aspect-square w-full rounded-sm object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-sm bg-neutral-800 text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-6 text-left md:w-[54%]">
        <div className="flex items-start gap-3">
          <Icon>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M19 11a7 7 0 0 1-14 0M12 18v4M8 22h8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Icon>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {event.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-lg text-white">
          <Icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Icon>
          <p>{formatDate(event.start_date)}</p>
        </div>

        <div className="flex items-center gap-3 text-lg uppercase tracking-wide text-white">
          <Icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 21V8.5L12 3l8 5.5V21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M9 21v-7h6v7" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Icon>
          <p>{event.venue}</p>
        </div>

        <div className="flex items-start gap-3 text-lg text-white">
          <Icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 9a3 3 0 0 0 0 6h16a3 3 0 0 0 0-6H4Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="M8 9v6M16 9v6" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Icon>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            {prices.length > 0
              ? prices.map((price, index) => (
                  <span key={`${price}-${index}`}>Rs. {price.toFixed(1)}</span>
                ))
              : "Tickets TBA"}
          </p>
        </div>

        <button
          type="button"
          className="mt-2 rounded-md bg-lime-400 px-8 py-2.5 text-sm font-bold tracking-wide text-black uppercase transition-colors hover:bg-lime-300"
        >
          Buy Tickets
        </button>
      </div>
    </div>
    
  );
};

export default EventCard;
