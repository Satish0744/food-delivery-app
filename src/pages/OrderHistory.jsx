import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/helpers";

export default function OrderHistory() {
  const { orders } = useAuth();

  if (orders.length === 0)
    return (
      <div className="container-app py-20 text-center">
        <p className="text-7xl mb-4">📦</p>
        <h2 className="text-2xl font-extrabold mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-5">Place your first order to see it here!</p>
        <Link to="/menu" className="btn-primary inline-block">
          Start Ordering
        </Link>
      </div>
    );

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-extrabold mb-6">Order History</h1>
      <div className="space-y-3">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-4"
          >
            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
              <div>
                <p className="font-bold text-lg">{order.id}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.placedAt).toLocaleString("en-IN")}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded capitalize ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-primary"
                }`}
              >
                {order.status.replace("-", " ")}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="font-bold">{formatCurrency(order.amount)}</span>
              <Link
                to={`/track/${order.id}`}
                className="text-primary text-sm font-semibold hover:underline"
              >
                Track Order →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}