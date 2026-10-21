import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 mt-16">
      <div className="container-app py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              🍔
            </div>
            <span className="font-extrabold text-xl text-white">
              Food<span className="text-primary">Hub</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Delivering happiness in every bite. Order your favourite food from
            the best restaurants near you.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            <li><Link to="/signup" className="hover:text-primary">Sign Up</Link></li>
            <li><Link to="/orders" className="hover:text-primary">Order History</Link></li>
            <li><Link to="/track" className="hover:text-primary">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            {[FaFacebook, FaInstagram, FaTwitter, FaGithub].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-app py-4 text-center text-sm">
          © {new Date().getFullYear()} FoodHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}