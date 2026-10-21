import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/menu?filter=veg", label: "Veg" },
    { to: "/menu?filter=non-veg", label: "Non-Veg" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "info");
    setProfileOpen(false);
    navigate("/");
  };

  const closeMobile = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
            🍔
          </div>
          <span className="font-extrabold text-xl text-gray-900 hidden sm:block">
            Food<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold rounded-lg transition ${
                  isActive
                    ? "text-primary bg-orange-50"
                    : "text-gray-700 hover:text-primary hover:bg-orange-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative p-2 hover:bg-orange-50 rounded-lg transition"
          >
            <FaShoppingCart className="text-xl text-gray-700" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 p-1.5 hover:bg-orange-50 rounded-lg transition"
              >
                <FaUserCircle className="text-2xl text-primary" />
                <span className="hidden sm:block text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-sm font-medium"
                    >
                      <FaUserCircle /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-sm font-medium"
                    >
                      📦 Order History
                    </Link>
                    <Link
                      to="/track"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-sm font-medium"
                    >
                      🚚 Track Order
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 w-full text-left"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-outline text-sm py-2 px-4">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg hover:bg-orange-50"
          >
            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="container-app py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `px-3 py-2.5 text-sm font-semibold rounded-lg ${
                      isActive
                        ? "text-primary bg-orange-50"
                        : "text-gray-700 hover:bg-orange-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user && (
                <>
                  <NavLink
                    to="/orders"
                    onClick={closeMobile}
                    className="px-3 py-2.5 text-sm font-semibold rounded-lg text-gray-700 hover:bg-orange-50"
                  >
                    📦 Order History
                  </NavLink>
                  <NavLink
                    to="/track"
                    onClick={closeMobile}
                    className="px-3 py-2.5 text-sm font-semibold rounded-lg text-gray-700 hover:bg-orange-50"
                  >
                    🚚 Track Order
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={closeMobile}
                    className="px-3 py-2.5 text-sm font-semibold rounded-lg text-gray-700 hover:bg-orange-50"
                  >
                    👤 My Profile
                  </NavLink>
                </>
              )}
              {!user && (
                <div className="flex gap-2 mt-2">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex-1 btn-outline text-center text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobile}
                    className="flex-1 btn-primary text-center text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}