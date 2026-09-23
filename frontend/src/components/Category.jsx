import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryButtons from "./Category Section/CategoryButtons";
import EventGrid from "./Category Section/EventGrid";
import { BASE_URL } from "../api";
import { Link } from "react-router-dom";

const Category = ({ showAllEventsButton = true }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/category/`)
      .then((response) => setCategories(response.data || []))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <>
      <div className="bg-[#ebe7e7] w-full flex flex-col items-center px-4 py-6">
        <CategoryButtons
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <EventGrid activeCategory={activeCategory} />
        {showAllEventsButton && (
          <Link
            to="/events"
            className="mt-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            List All Events
          </Link>
        )}
      </div>
    </>
  );
};

export default Category;
