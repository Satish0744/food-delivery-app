import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { restaurants } from "../data/restaurants";
import { categories } from "../data/categories";
import { foods } from "../data/foods";
import RestaurantCard from "../components/RestaurantCard";
import CategoryPill from "../components/CategoryPill";
import FoodCard from "../components/FoodCard";
import { useToast } from "../context/ToastContext";
import { FaSearch, FaTag, FaTruck, FaShieldAlt } from "react-icons/fa";
import Reviews from "./Reviews";
import Feedback from "./Feedback";


export default function Home() {
  const { showToast } = useToast();
  const popularFoods = foods.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10 sm:py-16 lg:py-20">
        <div className="container-app grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              🎉 Free delivery on first order
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Delicious food,
              <br />
              <span className="text-primary">delivered fast.</span>
            </h1>
            <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-lg">
              Order from your favourite restaurants and get piping hot food at
              your doorstep in 30 minutes or less.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/menu" className="btn-primary px-6 py-3">
                Order Now
              </Link>
              <Link to="/about" className="btn-outline px-6 py-3">
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
              {[
                { icon: FaTruck, label: "Fast Delivery" },
                { icon: FaShieldAlt, label: "Safe & Hygienic" },
                { icon: FaTag, label: "Best Offers" },
              ].map((f, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow-md flex items-center justify-center text-primary">
                    <f.icon className="text-xl" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold mt-2 text-gray-700">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
              alt="Delicious food"
              className="w-full h-[420px] object-cover rounded-3xl shadow-2xl"
            />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <p className="font-bold text-sm">30 min</p>
                <p className="text-xs text-gray-500">Avg. Delivery</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Explore Categories
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              What are you craving today?
            </p>
          </div>
          <Link to="/menu" className="text-primary font-semibold text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <Link key={c.id} to={`/menu?category=${c.id}`} className="shrink-0">
              <CategoryPill category={c} isActive={false} onClick={() => {}} />
            </Link>
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section className="container-app py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Popular Restaurants
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Hand-picked restaurants near you
            </p>
          </div>
          <Link to="/menu" className="text-primary font-semibold text-sm hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.slice(0, 6).map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* Popular dishes */}
      <section className="container-app py-10">
        <div className="mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Trending Dishes
          </h2>
          <p className="text-gray-500 text-sm mt-1">Ordered by many</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularFoods.map((f) => (
            <FoodCard key={f.id} food={f} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container-app py-10">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Get 50% OFF on your first order!
          </h2>
          <p className="opacity-90 mb-5 text-sm sm:text-base">
            Use code{" "}
            <span className="bg-white/20 px-3 py-1 rounded-lg font-bold">
              WELCOME50
            </span>{" "}
            at checkout
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Grab the deal
          </Link>
        </div>
      </section>
      <Reviews></Reviews>
      <Feedback></Feedback>
    </div>
  );
}