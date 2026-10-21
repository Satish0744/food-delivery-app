import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container-app py-10 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-3">About FoodHub</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          We're on a mission to deliver happiness in every bite. Connecting you
          with the best restaurants around, fast and fresh.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {[
          { emoji: "🚀", title: "Fast Delivery", desc: "30-minute average delivery time" },
          { emoji: "🥗", title: "Fresh Food", desc: "Hygienic and quality checked" },
          { emoji: "💯", title: "Best Prices", desc: "Offers and discounts daily" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 text-center"
          >
            <p className="text-5xl mb-3">{item.emoji}</p>
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-3">Our Story</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          FoodHub started in 2020 with a simple idea: make delicious food
          accessible to everyone, everywhere. We partner with hundreds of
          restaurants to bring you a wide variety of cuisines—from North Indian
          curries to South Indian dosas, Chinese noodles to Italian pizzas.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our delivery partners work around the clock to ensure your food
          reaches you hot and fresh. We believe in quality, speed, and
          customer-first service.
        </p>
      </div>
    </div>
  );
}