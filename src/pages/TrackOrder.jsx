import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const STAGES = [
  { key: "placed", label: "Order Placed", emoji: "📝" },
  { key: "confirmed", label: "Restaurant Confirmed", emoji: "👨‍🍳" },
  { key: "preparing", label: "Preparing Food", emoji: "🍳" },
  { key: "out-for-delivery", label: "Out for Delivery", emoji: "🛵" },
  { key: "delivered", label: "Delivered", emoji: "✅" },
];

export default function TrackOrder() {
  const { id } = useParams();
  const { orders } = useAuth();
  const { showToast } = useToast();
  const [searchId, setSearchId] = useState(id || "");
  const [searchResult, setSearchResult] = useState(
    id ? orders.find((o) => o.id === id) : null
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const found = orders.find((o) => o.id === searchId.trim().toUpperCase());
    if (found) setSearchResult(found);
    else {
      setSearchResult(null);
      showToast("Order not found", "error");
    }
  };

  const currentStageIndex = searchResult
    ? STAGES.findIndex((s) => s.key === searchResult.status)
    : 0;

  return (
    <div className="container-app py-8 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-2">Track Order</h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter your order ID to track delivery
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          className="input-field"
          placeholder="Enter Order ID (e.g., ORD123456)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn-primary px-5">Track</button>
      </form>

      {searchResult ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-bold">{searchResult.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">OTP</p>
              <p className="font-bold text-primary text-xl tracking-widest">
                {searchResult.otp}
              </p>
            </div>
          </div>

          <div className="space-y-1 relative">
            {STAGES.map((stage, idx) => {
              const isDone = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage.key} className="flex gap-4 relative">
                  {idx !== STAGES.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 w-0.5 h-12 ${
                        idx < currentStageIndex ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isDone
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isDone ? <FaCheck /> : stage.emoji}
                  </div>
                  <div className="pb-6">
                    <p
                      className={`font-semibold ${
                        isCurrent ? "text-primary" : isDone ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-xs text-primary mt-0.5"
                      >
                        In progress...
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-orange-50 rounded-lg p-3 text-sm mt-3">
            📍 Delivering to: {searchResult.customer.address}, {searchResult.customer.city}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-5xl mb-3">📦</p>
          <p>No order to track. Enter an order ID above.</p>
          <Link to="/menu" className="text-primary font-semibold hover:underline mt-2 inline-block">
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
}