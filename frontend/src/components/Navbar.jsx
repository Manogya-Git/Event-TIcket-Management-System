import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-lime-400" : "text-white hover:text-lime-400"
    }`;

  return (
    <nav className=" flex flex-wrap items-center justify-between gap-4 bg-black px-6 py-4 md:px-10 sticky top-0 z-50">
      <Link to="/" className="text-[1.65rem] font-extrabold tracking-tight text-lime-400">
        k garira?
      </Link>

      <div className="flex items-center gap-7">
        <button
          type="button"
          className="rounded-md bg-lime-400 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-lime-300"
        >
          List Your Events
        </button>
        <NavLink to="/book-venue" className={linkClass}>
          Book Venue
        </NavLink>
        <NavLink to="/book-artist" className={linkClass}>
          Book Artist
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
