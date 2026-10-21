import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, orders, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Logged out", "info");
    navigate("/");
  };

  return (
    <div className="container-app py-8 max-w-2xl">
      <div className="card p-6 text-center mb-5">
        <FaUserCircle className="text-7xl text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-extrabold">{user?.name}</h1>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card p-4 text-center">
          <p className="text-3xl font-extrabold text-primary">{orders.length}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-extrabold text-primary">
            ₹{orders.reduce((s, o) => s + o.amount, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>
      </div>

      <div className="space-y-2">
        <Link to="/orders" className="card p-4 flex justify-between items-center hover:bg-orange-50 transition">
          <span className="font-semibold">📦 Order History</span>
          <span>→</span>
        </Link>
        <Link to="/track" className="card p-4 flex justify-between items-center hover:bg-orange-50 transition">
          <span className="font-semibold">🚚 Track Order</span>
          <span>→</span>
        </Link>
        <button
          onClick={handleLogout}
          className="card p-4 flex justify-between items-center hover:bg-red-50 w-full text-left"
        >
          <span className="font-semibold text-red-600 flex items-center gap-2">
            <FaSignOutAlt /> Logout
          </span>
        </button>
      </div>
    </div>
  );
}