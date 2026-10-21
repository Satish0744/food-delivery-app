import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaTag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/helpers";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getItemPrice,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    total,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  const handleApply = (e) => {
    e.preventDefault();
    const res = applyCoupon(couponCode);
    showToast(res.message, res.success ? "success" : "error");
    if (res.success) setCouponCode("");
  };

  // 🎯 PURE zoom animation — no Y movement
  const zoomCard = {
    hidden: { opacity: 0, scale: 0.75 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.06,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    }),
    exit: { opacity: 0, scale: 0.6, transition: { duration: 0.22 } },
  };

  if (cart.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="max-w-md mx-auto"
        >
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="text-7xl mb-4"
          >
            🛒
          </motion.p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-5">
            Add some delicious food to get started!
          </p>
          <Link
            to="/menu"
            className="btn-primary inline-block hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Browse Menu
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="text-3xl font-extrabold mb-6"
      >
        Your Cart
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.map((item, i) => (
              <motion.div
                key={item.cartId}
                layout
                custom={i}
                variants={zoomCard}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 12px 30px rgba(255, 82, 0, 0.15)",
                }}
                transition={{
                  layout: { duration: 0.25, ease: "easeOut" },
                }}
                className="card p-3 flex gap-3 origin-center will-change-transform"
              >
                <motion.img
                  src={item.image}
                  alt={item.name}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.06 + 0.1,
                    type: "spring",
                    stiffness: 240,
                    damping: 20,
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.customization?.spiceLevel && (
                        <p className="text-xs text-gray-500">
                          Spice: {item.customization.spiceLevel}
                        </p>
                      )}
                      {item.customization?.extras?.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Extras:{" "}
                          {item.customization.extras
                            .map((e) => e.name)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-gray-400 hover:text-red-500 p-1 shrink-0 transition-colors"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => decreaseQty(item.cartId)}
                        className="p-1.5 bg-white rounded shadow-sm hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-[10px]" />
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        initial={{ scale: 1.4, color: "#ff5200" }}
                        animate={{ scale: 1, color: "#111827" }}
                        transition={{ duration: 0.25 }}
                        className="font-bold w-6 text-center text-sm"
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => increaseQty(item.cartId)}
                        className="p-1.5 bg-white rounded shadow-sm hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-[10px]" />
                      </motion.button>
                    </div>
                    <motion.span
                      key={getItemPrice(item)}
                      initial={{ scale: 1.15, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="font-bold"
                    >
                      {formatCurrency(getItemPrice(item))}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{ scale: 1.02 }}
            className="card p-5 sticky top-20 origin-center will-change-transform"
          >
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            {/* Coupon */}
            {!appliedCoupon ? (
              <form onSubmit={handleApply} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Coupon code"
                    className="input-field text-sm flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary text-sm px-4"
                  >
                    Apply
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Try: WELCOME50, FLAT100, SAVE20
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2"
              >
                <span className="text-sm font-semibold text-green-700 flex items-center gap-1">
                  <FaTag /> {appliedCoupon.code} applied
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  Remove
                </button>
              </motion.div>
            )}

            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (5%)</span>
                <span className="font-semibold">{formatCurrency(taxes)}</span>
              </div>
              {discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-between text-green-600"
                >
                  <span>Discount</span>
                  <span className="font-semibold">
                    -{formatCurrency(discount)}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="flex justify-between font-extrabold text-lg border-t border-gray-100 pt-3 mt-3">
              <span>Total</span>
              <motion.span
                key={total}
                initial={{ scale: 1.2, color: "#ff5200" }}
                animate={{ scale: 1, color: "#111827" }}
                transition={{ duration: 0.3 }}
              >
                {formatCurrency(Math.max(0, total))}
              </motion.span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/checkout")}
              className="w-full btn-primary mt-4 py-3"
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}