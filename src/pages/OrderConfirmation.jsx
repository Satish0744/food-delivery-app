import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/helpers";

export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders } = useAuth();
  const order = orders.find((o) => o.id === id);

  if (!order)
    return (
      <div className="container-app py-20 text-center">
        <p className="text-5xl mb-3">❌</p>
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Link to="/" className="btn-primary inline-block mt-4">
          Go Home
        </Link>
      </div>
    );

  return (
    <div className="container-app py-10 max-w-2xl">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Order Placed! 🎉
        </h1>
        <p className="text-gray-600">
          Thanks {order.customer.name}, your order is confirmed.
        </p>
      </motion.div>

      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="font-bold text-lg">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Delivery OTP</p>
            <p className="font-bold text-2xl text-primary tracking-widest">
              {order.otp}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.cartId} className="flex justify-between">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-extrabold text-lg border-t border-gray-100 pt-3 mt-3">
          <span>Total Paid</span>
          <span>{formatCurrency(order.amount)}</span>
        </div>
      </div>

      <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-700 mb-4">
        📍 Delivering to: <strong>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</strong>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/track/${order.id}`} className="btn-primary flex-1 text-center">
          Track Order
        </Link>
        <Link to="/menu" className="btn-outline flex-1 text-center">
          Order More
        </Link>
      </div>
    </div>
  );
}