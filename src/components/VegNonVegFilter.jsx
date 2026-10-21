import { motion } from "framer-motion";

export default function VegNonVegFilter({ active, onChange }) {
  const filters = [
    { id: "all", label: "All", color: "bg-gray-800" },
    { id: "veg", label: "Veg", color: "bg-veg" },
    { id: "non-veg", label: "Non-Veg", color: "bg-nonveg" },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl w-fit">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`relative px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            active === f.id ? "text-white" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {active === f.id && (
            <motion.span
              layoutId="vegFilterBg"
              className={`absolute inset-0 ${f.color} rounded-lg`}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {f.id === "veg" && (
              <span className="w-3 h-3 border-2 border-white bg-white flex items-center justify-center rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-veg" />
              </span>
            )}
            {f.id === "non-veg" && (
              <span className="w-3 h-3 border-2 border-white bg-white flex items-center justify-center rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-nonveg" />
              </span>
            )}
            {f.label}
          </span>
        </button>
      ))}
    </div>
  );
}