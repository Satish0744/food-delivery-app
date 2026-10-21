import { useParams, Link } from "react-router-dom";
import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { restaurants } from "../data/restaurants";
import { foods } from "../data/foods";
import FoodCard from "../components/FoodCard";
import { formatCurrency } from "../utils/helpers";

export default function Restaurant() {
  const { id } = useParams();
  const restaurant = restaurants.find((r) => r.id === Number(id));

  if (!restaurant)
    return (
      <div className="container-app py-20 text-center">
        <p className="text-5xl mb-3">😔</p>
        <h2 className="text-2xl font-bold">Restaurant not found</h2>
        <Link to="/menu" className="btn-primary inline-block mt-4">
          Browse Menu
        </Link>
      </div>
    );

  const restaurantFoods = foods.filter((f) => f.restaurantId === restaurant.id);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-app pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {restaurant.name}
          </h1>
          <p className="text-white/90 text-sm mt-1">
            {restaurant.cuisine.join(" • ")}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-white text-sm">
            <span className="flex items-center gap-1 bg-green-600 px-2 py-0.5 rounded">
              <FaStar /> {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <FaClock /> {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt /> {restaurant.address}
            </span>
            <span>{formatCurrency(restaurant.priceForTwo)} for two</span>
          </div>
        </div>
      </div>

      {/* Offer banner */}
      <div className="container-app mt-6">
        <div className="bg-orange-50 border-2 border-dashed border-primary rounded-xl p-4 text-primary font-semibold">
          🎁 {restaurant.offer}
        </div>
      </div>

      {/* Menu */}
      <div className="container-app py-8">
        <h2 className="text-2xl font-extrabold mb-5">Menu</h2>
        {restaurantFoods.length === 0 ? (
          <p className="text-gray-500">No items available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {restaurantFoods.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}