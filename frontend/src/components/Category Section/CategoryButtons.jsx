import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import {
  LayoutGrid,
  Music,
  Users,
  Music2,
  Guitar,
  Theater,
  Mic2,
  Image,
  Trophy,
  HandCoins,
  Sparkles,
} from "lucide-react";

// Map category names (lowercase) to icons — fallback to Sparkles if unmatched
const ICON_MAP = {
  "live music": Music,
  festival: Users,
  dance: Music2,
  acoustic: Guitar,
  theatre: Theater,
  "comedy show": Mic2,
  exhibition: Image,
  sports: Trophy,
  fundraiser: HandCoins,
  activities: Sparkles,
};

const getIcon = (name) => ICON_MAP[name?.toLowerCase()] || Sparkles;

const CategoryButtons = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/category/`)
      .then((response) => {
        console.log("Categories:", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const baseBtn =
    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-150";
  const inactiveBtn =
    "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800";
  const activeBtn = "bg-green-500 text-white";

  return (
    <div className="w-full flex flex-col items-center px-4 py-6">
      <h2 className="text-2xl font-bold text-black mb-4 text-center">
        Events Based on Categories
      </h2>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {/* All button */}
        <button
          className={`${baseBtn} ${
            activeCategory === "All" ? activeBtn : inactiveBtn
          }`}
          onClick={() => setActiveCategory("All")}
        >
          <LayoutGrid size={16} />
          All
        </button>

        {/* Backend categories */}
        {categories.map((category) => {
          const Icon = getIcon(category.name);
          return (
            <button
              key={category.id}
              className={`${baseBtn} ${
                activeCategory === category.name ? activeBtn : inactiveBtn
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <Icon size={16} />
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryButtons;
