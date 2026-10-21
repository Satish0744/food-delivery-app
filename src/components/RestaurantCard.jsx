import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar, FaClock } from "react-icons/fa";
import { formatCurrency } from "../utils/helpers";

export default function RestaurantCard({ restaurant }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card overflow-hidden group"
    >
      <Link to={`/restaurant/${restaurant.id}`}>
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <span className="text-white text-sm font-bold bg-primary px-2 py-0.5 rounded">
              {restaurant.offer}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {restaurant.name}
            </h3>
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded font-semibold shrink-0">
              <FaStar className="text-[10px]" /> {restaurant.rating}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-1 mb-2">
            {restaurant.cuisine.join(" • ")}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaClock className="text-gray-400" /> {restaurant.deliveryTime}
            </span>
            <span>{formatCurrency(restaurant.priceForTwo)} for two</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}