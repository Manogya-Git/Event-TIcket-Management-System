import React from "react";
import { Building2 } from "lucide-react";
import { mediaUrl } from "../api";
import { Link } from "react-router-dom";

const VenueCard = ({ venue }) => {
  const image = mediaUrl(venue.image);

  return (
    <Link
      to={`/venues/${venue.slug}`}
      className="group block w-[255px] shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_3px_7px_rgba(15,23,42,0.2)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(15,23,42,0.16)]"
    >
      <div className="h-[210px] w-full overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={venue.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 text-slate-400">
            <Building2 className="h-10 w-10" />
            <span className="text-xs font-medium uppercase tracking-[0.18em]">
              Kgarira venues
            </span>
          </div>
        )}
      </div>
      <div className="flex min-h-[62px] items-center justify-center px-4 py-3">
        <h3 className="truncate text-center text-[22px] font-medium text-slate-900">
          {venue.name}
        </h3>
      </div>
    </Link>
  );
};

export default VenueCard;
