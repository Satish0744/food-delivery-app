import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaThumbsUp,
  FaCheckCircle,
  FaPen,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { initialReviews } from "../data/reviews";
import { useToast } from "../context/ToastContext";

const CARDS_PER_PAGE = 4;
const AUTO_SLIDE_MS = 4000;

export default function Reviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [likedIds, setLikedIds] = useState([]);

  // Carousel state
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);

  // 🔁 Auto slide
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [isPaused, totalPages]);

  // Clamp page if review count changes
  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [page, totalPages]);

  // Stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const avg = total ? sum / total : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
      percent: total
        ? (reviews.filter((r) => r.rating === star).length / total) * 100
        : 0,
    }));
    return { total, avg, dist };
  }, [reviews]);

  // Current page slice
  const visibleReviews = useMemo(() => {
    const start = page * CARDS_PER_PAGE;
    return reviews.slice(start, start + CARDS_PER_PAGE);
  }, [reviews, page]);

  const handleLike = (id) => {
    const alreadyLiked = likedIds.includes(id);
    setLikedIds((prev) =>
      alreadyLiked ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, likes: r.likes + (alreadyLiked ? -1 : 1) } : r
      )
    );
    showToast(
      alreadyLiked ? "Like removed" : "Thanks for your feedback!",
      "success"
    );
  };

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  const renderStars = (rating, size = "text-sm") => (
    <div className={`flex gap-0.5 ${size} text-yellow-400`}>
      {[1, 2, 3, 4, 5].map((s) => {
        if (rating >= s) return <FaStar key={s} />;
        if (rating >= s - 0.5) return <FaStarHalfAlt key={s} />;
        return <FaRegStar key={s} className="text-gray-300" />;
      })}
    </div>
  );

  return (
    <div className="container-app py-8 sm:py-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Customer Reviews ⭐
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            See what our customers are saying
          </p>
        </div>
        <Link
          to="/feedback"
          className="btn-primary flex items-center gap-2 w-fit hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          <FaPen className="text-xs" /> Write a Review
        </Link>
      </div>

      {/* ─── Stats card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 sm:p-6 mb-8"
      >
        <div className="grid sm:grid-cols-3 gap-6 items-center">
          <div className="text-center sm:text-left sm:border-r border-gray-100 sm:pr-6">
            <p className="text-5xl font-extrabold text-gray-900">
              {stats.avg.toFixed(1)}
            </p>
            <div className="flex justify-center sm:justify-start mt-1">
              {renderStars(stats.avg, "text-lg")}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {stats.total} reviews
            </p>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            {stats.dist.map((d) => (
              <div
                key={d.star}
                className="flex items-center gap-2 rounded px-1 py-0.5"
              >
                <span className="text-xs font-semibold w-3 text-gray-700">
                  {d.star}
                </span>
                <FaStar className="text-yellow-400 text-xs" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Carousel Header ─── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Recent Reviews
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous reviews"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next reviews"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* ─── Carousel ─── */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {visibleReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                whileHover={{ y: -6 }}
                className="card p-5 hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 truncate">
                        {review.name}
                      </h3>
                      {review.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          <FaCheckCircle /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {renderStars(review.rating, "text-xs")}
                      <span className="text-xs text-gray-400">
                        {new Date(review.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-700 leading-relaxed mb-3 flex-1 line-clamp-4">
                  {review.comment}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 min-w-0 flex-1 pr-2">
                    <span className="font-semibold text-gray-700 block truncate">
                      {review.dish}
                    </span>
                    <span className="block truncate">{review.restaurant}</span>
                  </div>
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shrink-0 ${
                      likedIds.includes(review.id)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    <FaThumbsUp
                      className={
                        likedIds.includes(review.id) ? "text-primary" : ""
                      }
                    />
                    {review.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Dots indicator ─── */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx)}
            aria-label={`Go to page ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              page === idx
                ? "w-8 bg-primary"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Auto-slide status hint */}
      <p className="text-center text-xs text-gray-400 mt-2">
        {isPaused ? "⏸ Paused" : "▶ Auto-sliding every 4s"}
      </p>

      {/* ─── CTA banner ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 sm:p-8 text-center text-white"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
          Ordered from us recently?
        </h2>
        <p className="opacity-90 text-sm mb-4">
          Share your experience and help others choose better!
        </p>
        <Link
          to="/feedback"
          className="inline-block bg-white text-primary font-bold px-6 py-2.5 rounded-lg hover:bg-gray-100 hover:scale-105 transition-transform"
        >
          Write a Review
        </Link>
      </motion.div>
    </div>
  );
}