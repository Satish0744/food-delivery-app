import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import {
  FaTimes,
  FaCheckCircle,
  FaLock,
  FaSpinner,
  FaCopy,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency, generateOrderId, generateOtp } from "../utils/helpers";

const UPI_ID = "8431953397@yl";
const UPI_NAME = "FoodHub";

export default function Checkout() {
  const { cart, subtotal, deliveryFee, taxes, discount, total, clearCart } =
    useCart();
  const { user, placeOrder } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    pincode: "",
    payment: "cod",
  });
  const [errors, setErrors] = useState({});

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});

  if (cart.length === 0) return <Navigate to="/cart" replace />;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter valid 10-digit phone";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter valid email";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Enter valid 6-digit pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const finalizeOrder = () => {
    const order = {
      id: generateOrderId(),
      otp: generateOtp(),
      items: cart,
      amount: Math.max(0, total),
      subtotal,
      deliveryFee,
      taxes,
      discount,
      customer: form,
      status: "placed",
      placedAt: new Date().toISOString(),
      timeline: [
        { status: "placed", label: "Order Placed", at: new Date().toISOString() },
      ],
    };
    placeOrder(order);
    clearCart();
    showToast("Order placed successfully! 🎉", "success");
    navigate(`/order-confirmation/${order.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the form errors", "error");
      return;
    }
    // COD → place directly
    if (form.payment === "cod") {
      finalizeOrder();
    } else {
      // UPI or Card → open payment modal
      setShowPaymentModal(true);
    }
  };

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleCardChange = (k, v) => {
    let formatted = v;
    if (k === "number") {
      formatted = v.replace(/\D/g, "").slice(0, 16);
      formatted = formatted.replace(/(.{4})/g, "$1 ").trim();
    }
    if (k === "expiry") {
      formatted = v.replace(/\D/g, "").slice(0, 4);
      if (formatted.length > 2)
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
    }
    if (k === "cvv") formatted = v.replace(/\D/g, "").slice(0, 3);
    setCard((p) => ({ ...p, [k]: formatted }));
    setCardErrors((p) => ({ ...p, [k]: "" }));
  };

  const validateCard = () => {
    const errs = {};
    if (card.number.replace(/\s/g, "").length !== 16)
      errs.number = "Enter 16-digit card number";
    if (!card.name.trim()) errs.name = "Cardholder name required";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = "Enter MM/YY";
    if (card.cvv.length !== 3) errs.cvv = "3-digit CVV";
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCardPay = () => {
    if (!validateCard()) {
      showToast("Please fix card details", "error");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);
      showToast("Payment successful! ✅", "success");
      finalizeOrder();
    }, 1800);
  };

  const handleUpiPaid = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);
      showToast("Payment received! ✅", "success");
      finalizeOrder();
    }, 1500);
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    showToast("UPI ID copied!", "success");
  };

  // UPI payment link (works with any UPI app)
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    UPI_NAME
  )}&am=${Math.max(0, total)}&cu=INR&tn=${encodeURIComponent(
    "FoodHub Order"
  )}`;

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="card p-5"
          >
            <h2 className="font-bold text-lg mb-4">Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.name}>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                />
              </Field>
              <Field label="Email" error={errors.email} full>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Address" error={errors.address} full>
                <textarea
                  className="input-field min-h-[80px]"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Flat / House no, Building, Street"
                />
              </Field>
              <Field label="City" error={errors.city}>
                <input
                  className="input-field"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Bangalore"
                />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input
                  className="input-field"
                  value={form.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  placeholder="560001"
                  maxLength={6}
                />
              </Field>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="card p-5"
          >
            <h2 className="font-bold text-lg mb-4">Payment Method</h2>
            <div className="space-y-2">
              {[
                { id: "cod", label: "Cash on Delivery", emoji: "💵" },
                { id: "card", label: "Credit / Debit Card", emoji: "💳" },
                { id: "upi", label: "UPI (Pay via QR)", emoji: "📱" },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    form.payment === p.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.id}
                    checked={form.payment === p.id}
                    onChange={(e) => handleChange("payment", e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-xl">{p.emoji}</span>
                  <span className="font-semibold text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="card p-5 sticky top-20"
          >
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm max-h-60 overflow-y-auto mb-3">
              {cart.map((item) => (
                <div key={item.cartId} className="flex justify-between">
                  <span className="text-gray-600 truncate mr-2">
                    {item.quantity}x {item.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row
                label="Delivery"
                value={deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
              />
              <Row label="Taxes" value={formatCurrency(taxes)} />
              {discount > 0 && (
                <Row
                  label="Discount"
                  value={`-${formatCurrency(discount)}`}
                  green
                />
              )}
            </div>
            <div className="flex justify-between font-extrabold text-lg border-t border-gray-100 pt-3 mt-3">
              <span>Total</span>
              <span>{formatCurrency(Math.max(0, total))}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full btn-primary mt-4 py-3"
            >
              {form.payment === "cod"
                ? "Place Order"
                : form.payment === "upi"
                ? "Pay via UPI →"
                : "Pay with Card →"}
            </motion.button>
          </motion.div>
        </div>
      </form>

      {/* ══════════ PAYMENT MODAL ══════════ */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => !processing && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-extrabold">
                  {form.payment === "upi" ? "UPI Payment" : "Card Payment"}
                </h3>
                <button
                  onClick={() => !processing && setShowPaymentModal(false)}
                  disabled={processing}
                  className="text-gray-400 hover:text-gray-700 p-1 disabled:opacity-40"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-5">
                {/* Amount */}
                <div className="text-center mb-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Amount to Pay
                  </p>
                  <p className="text-3xl font-extrabold text-primary mt-1">
                    {formatCurrency(Math.max(0, total))}
                  </p>
                </div>

                {/* ═══════ UPI FLOW ═══════ */}
                {form.payment === "upi" && (
                  <div>
                    <div className="bg-white border-2 border-gray-100 rounded-xl p-5 flex flex-col items-center mb-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring" }}
                        className="bg-white p-3 rounded-lg"
                      >
                        <QRCode
                          value={upiLink}
                          size={180}
                          bgColor="#ffffff"
                          fgColor="#111827"
                          level="H"
                        />
                      </motion.div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Scan with any UPI app
                      </p>
                      <div className="flex gap-2 mt-2">
                        {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                          <span
                            key={app}
                            className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* UPI ID */}
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5 mb-4">
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase">
                          UPI ID
                        </p>
                        <p className="font-bold text-sm truncate">{UPI_ID}</p>
                      </div>
                      <button
                        onClick={copyUpi}
                        className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline shrink-0"
                      >
                        <FaCopy /> Copy
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mb-4">
                      Complete the payment in your UPI app, then click below.
                    </p>

                    <button
                      onClick={handleUpiPaid}
                      disabled={processing}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {processing ? (
                        <>
                          <FaSpinner className="animate-spin" /> Verifying
                          payment...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle /> I've Paid • Confirm Order
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* ═══════ CARD FLOW ═══════ */}
                {form.payment === "card" && (
                  <div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Card Number
                        </label>
                        <input
                          className="input-field font-mono tracking-wider"
                          value={card.number}
                          onChange={(e) =>
                            handleCardChange("number", e.target.value)
                          }
                          placeholder="1234 5678 9012 3456"
                        />
                        {cardErrors.number && (
                          <p className="text-xs text-red-500 mt-1">
                            {cardErrors.number}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Cardholder Name
                        </label>
                        <input
                          className="input-field uppercase"
                          value={card.name}
                          onChange={(e) =>
                            handleCardChange("name", e.target.value.toUpperCase())
                          }
                          placeholder="JOHN DOE"
                        />
                        {cardErrors.name && (
                          <p className="text-xs text-red-500 mt-1">
                            {cardErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">
                            Expiry
                          </label>
                          <input
                            className="input-field font-mono"
                            value={card.expiry}
                            onChange={(e) =>
                              handleCardChange("expiry", e.target.value)
                            }
                            placeholder="MM/YY"
                          />
                          {cardErrors.expiry && (
                            <p className="text-xs text-red-500 mt-1">
                              {cardErrors.expiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">
                            CVV
                          </label>
                          <input
                            type="password"
                            className="input-field font-mono"
                            value={card.cvv}
                            onChange={(e) =>
                              handleCardChange("cvv", e.target.value)
                            }
                            placeholder="•••"
                          />
                          {cardErrors.cvv && (
                            <p className="text-xs text-red-500 mt-1">
                              {cardErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-3 mb-4">
                      <FaLock className="text-green-600" /> Your card details are
                      encrypted & secure
                    </div>

                    <p className="text-[11px] text-blue-600 bg-blue-50 rounded px-2 py-1.5 mb-3 text-center">
                      🧪 Demo mode — use any 16-digit number (e.g.,
                      4242424242424242)
                    </p>

                    <button
                      onClick={handleCardPay}
                      disabled={processing}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {processing ? (
                        <>
                          <FaSpinner className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <FaLock /> Pay {formatCurrency(Math.max(0, total))}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children, error, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, value, green }) {
  return (
    <div className={`flex justify-between ${green ? "text-green-600" : ""}`}>
      <span className={green ? "" : "text-gray-600"}>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}