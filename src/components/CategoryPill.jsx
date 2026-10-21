import { motion } from "framer-motion";

export default function CategoryPill({ category, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 px-3 py-2 rounded-xl min-w-[80px] sm:min-w-[100px] transition-all ${
        isActive
          ? "bg-primary/10 ring-2 ring-primary"
          : "bg-white hover:bg-orange-50"
      }`}
    >
      <span className="text-3xl sm:text-4xl">{category.emoji}</span>
      <span
        className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
          isActive ? "text-primary" : "text-gray-700"
        }`}
      >
        {category.name}
      </span>
    </motion.button>
  );
}