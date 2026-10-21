import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import { foods } from "../data/foods";
import { categories } from "../data/categories";
import FoodCard from "../components/FoodCard";
import CategoryPill from "../components/CategoryPill";
import VegNonVegFilter from "../components/VegNonVegFilter";

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [typeFilter, setTypeFilter] = useState(params.get("filter") || "all");
  const [sortBy, setSortBy] = useState("default");

  // Sync URL changes to state
  useEffect(() => {
    setCategory(params.get("category") || "all");
    setTypeFilter(params.get("filter") || "all");
  }, [params]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(params);
    if (value === "all") newParams.delete(key);
    else newParams.set(key, value);
    setParams(newParams);
  };

  const filtered = useMemo(() => {
    let list = [...foods];
    if (category !== "all") list = list.filter((f) => f.category === category);
    if (typeFilter !== "all") list = list.filter((f) => f.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, typeFilter, search, sortBy]);

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Our Menu 🍽️
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Explore our wide variety of dishes
        </p>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
         
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for dishes..."
            className="input-field pl-11 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="default">Sort: Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
        </select>
      </div>

      {/* Veg/Non-Veg toggle */}
      <div className="mb-5">
        <VegNonVegFilter
          active={typeFilter}
          onChange={(val) => updateFilter("filter", val)}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => updateFilter("category", c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              category === c.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🍽️</p>
          <h3 className="text-xl font-bold text-gray-800">No dishes found</h3>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your filters or search
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            Showing <span className="font-bold text-gray-800">{filtered.length}</span>{" "}
            {typeFilter !== "all" ? `${typeFilter === "veg" ? "veg" : "non-veg"} ` : ""}
            dishes
          </p>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}