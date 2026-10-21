import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/helpers";

const VegBadge = ({ type }) => (
  <div
    className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
      type === "veg" ? "border-veg" : "border-nonveg"
    }`}
  >
    <div
      className={`w-2.5 h-2.5 rounded-full ${
        type === "veg" ? "bg-veg" : "bg-nonveg"
      }`}
    />
  </div>
);

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState(
    food.customizations?.spiceLevel?.[0] || "Mild"
  );
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toggleExtra = (extra) => {
    setExtras((prev) =>
      prev.find((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra]
    );
  };

  const totalPrice =
    (food.price + extras.reduce((s, e) => s + e.price, 0)) * quantity;

  const handleAdd = () => {
    if (food.customizations) {
      setShowModal(true);
    } else {
      addToCart(food, {});
      showToast(`${food.name} added to cart!`, "success");
    }
  };

  const confirmAdd = () => {
    addToCart(food, { spiceLevel, extras }, quantity);
    showToast(`${food.name} added to cart!`, "success");
    setShowModal(false);
    setExtras([]);
    setQuantity(1);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="card p-4 flex flex-col h-full"
      >
        <div className="relative">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-40 object-cover rounded-xl"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-white rounded p-0.5">
            <VegBadge type={food.type} />
          </div>
        </div>

        <div className="mt-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base text-gray-900 line-clamp-1">
              {food.name}
            </h3>
            <span className="flex items-center gap-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded font-semibold shrink-0">
              <FaStar className="text-[9px]" /> {food.rating}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 flex-1">
            {food.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-lg text-gray-900">
              {formatCurrency(food.price)}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className="btn-primary text-sm px-4 py-1.5 flex items-center gap-1"
            >
              <FaPlus className="text-xs" /> Add
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Customization Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">{food.name}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-700 p-1"
                  >
                    <FaTimes />
                  </button>
                </div>

                {food.customizations?.spiceLevel && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">
                      Spice Level
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {food.customizations.spiceLevel.map((level) => (
                        <button
                          key={level}
                          onClick={() => setSpiceLevel(level)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                            spiceLevel === level
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {food.customizations?.extras?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">
                      Add Extras
                    </h4>
                    <div className="space-y-2">
                      {food.customizations.extras.map((extra) => {
                        const isSelected = extras.some(
                          (e) => e.name === extra.name
                        );
                        return (
                          <label
                            key={extra.name}
                            className={`flex justify-between items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {extra.name}
                            </span>
                            <span className="text-sm font-semibold text-gray-700">
                              +{formatCurrency(extra.price)}
                            </span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleExtra(extra)}
                              className="hidden"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-sm text-gray-700">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="font-bold w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={confirmAdd}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  Add to Cart • {formatCurrency(totalPrice)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}