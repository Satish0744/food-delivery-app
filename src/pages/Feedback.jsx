import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { foods } from "../data/foods";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const RATING_LABELS = {
  1: "Very Poor 😞",
  2: "Poor 😕",
  3: "Average 😐",
  4: "Good 😊",
  5: "Excellent 🤩",
};

export default function Feedback() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dish: "",
    rating: 0,
    comment: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.rating) errs.rating = "Please select a rating";
    if (!form.comment.trim()) errs.comment = "Please write your feedback";
    else if (form.comment.trim().length < 10)
      errs.comment = "Feedback must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the errors", "error");
      return;
    }
    const existing = JSON.parse(localStorage.getItem("feedback") || "[]");
    const newFeedback = {
      id: Date.now(),
      name: form.name,
      avatar: form.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      rating: form.rating,
      dish: form.dish || "General Feedback",
      restaurant: "FoodHub",
      date: new Date().toISOString().split("T")[0],
      comment: form.comment,
      verified: !!user,
      likes: 0,
    };
    localStorage.setItem("feedback", JSON.stringify([newFeedback, ...existing]));
    setSubmitted(true);
    showToast("Thank you for your feedback! 🎉", "success");
  };

  // Success screen
  if (submitted) {
    return (
      <div className="container-app py-16 max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="card p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"
          >
            <FaCheckCircle className="text-5xl text-green-500" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Thank You! 🎉
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Your feedback means the world to us. We'll use it to serve you
            better!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: user?.name || "",
                  email: user?.email || "",
                  dish: "",
                  rating: 0,
                  comment: "",
                });
              }}
              className="flex-1 btn-outline text-sm"
            >
              Write Another
            </button>
            <Link to="/reviews" className="flex-1 btn-primary text-center text-sm">
              View All Reviews
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeRating = hoveredStar || form.rating;

  return (
    <div className="container-app py-8 sm:py-10 max-w-3xl">
      {/* Back link */}
      <Link
        to="/reviews"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition mb-5 group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Reviews
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Share Your Feedback 💬
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto">
          Your opinion helps us improve and serve you better. Let us know how we
          did!
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="card p-5 sm:p-8"
      >
        {/* Personal info */}
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Your Name *
            </label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Email *
            </label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Dish selector */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Which dish are you reviewing? <span className="text-gray-400">(optional)</span>
          </label>
          <select
            className="input-field"
            value={form.dish}
            onChange={(e) => handleChange("dish", e.target.value)}
          >
            <option value="">Select a dish (or leave blank)</option>
            {foods.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rating stars */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Your Rating *
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="flex gap-1 sm:gap-2"
              onMouseLeave={() => setHoveredStar(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChange("rating", star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  className="p-1 transition-colors"
                  aria-label={`Rate ${star} stars`}
                >
                  <FaStar
                    className={`text-3xl sm:text-4xl transition-colors ${
                      star <= activeRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {activeRating > 0 && (
              <motion.span
                key={activeRating}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-semibold text-primary"
              >
                {RATING_LABELS[activeRating]}
              </motion.span>
            )}
          </div>
          {errors.rating && (
            <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Your Feedback *
          </label>
          <textarea
            className="input-field min-h-[120px] resize-none"
            value={form.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            placeholder="Tell us about your experience — taste, packaging, delivery, anything!"
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            {errors.comment ? (
              <p className="text-xs text-red-500">{errors.comment}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {form.comment.length}/500
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline flex-1 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 order-1 sm:order-2 hover:shadow-lg transition-all"
          >
            Submit Feedback
          </button>
        </div>

        {!user && (
          <p className="text-xs text-gray-500 text-center mt-4">
            💡{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>{" "}
            to get your review marked as verified
          </p>
        )}
      </motion.form>
    </div>
  );
}