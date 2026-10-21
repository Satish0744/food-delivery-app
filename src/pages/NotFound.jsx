import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-app py-20 text-center">
      <p className="text-8xl mb-4">🍽️</p>
      <h1 className="text-4xl font-extrabold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        Looks like this page went out for delivery.
      </p>
      <Link to="/" className="btn-primary inline-block">
        Back to Home
      </Link>
    </div>
  );
}