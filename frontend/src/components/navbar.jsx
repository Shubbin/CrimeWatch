import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js"; // adjust path

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo or Brand */}
          <div className="text-2xl font-bold">
            <Link to="/" onClick={handleLinkClick}>
              CrimeWatch
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`hover:text-green-400 transition ${
                isActive("/") ? "text-green-400 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={`hover:text-green-400 transition ${
                isActive("/contact") ? "text-green-400 font-semibold" : ""
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`hover:text-green-400 transition ${
                isActive("/about") ? "text-green-400 font-semibold" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/DashboardPage"
              onClick={handleLinkClick}
              className={`hover:text-green-400 transition ${
                isActive("/DashboardPage") ? "text-green-400 font-semibold" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/viewcriminals"
              onClick={handleLinkClick}
              className={`hover:text-green-400 transition ${
                isActive("/viewcriminals") ? "text-green-400 font-semibold" : ""
              }`}
            >
              View Criminals
            </Link>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="hover:text-red-500 transition font-semibold ml-4"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`block py-2 px-3 rounded hover:bg-green-600 transition ${
              isActive("/") ? "bg-green-600 font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className={`block py-2 px-3 rounded hover:bg-green-600 transition ${
              isActive("/contact") ? "bg-green-600 font-semibold" : ""
            }`}
          >
            Contact Us
          </Link>
          <Link
            to="/about"
            onClick={handleLinkClick}
            className={`block py-2 px-3 rounded hover:bg-green-600 transition ${
              isActive("/about") ? "bg-green-600 font-semibold" : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/DashboardPage"
            onClick={handleLinkClick}
            className={`block py-2 px-3 rounded hover:bg-green-600 transition ${
              isActive("/DashboardPage") ? "bg-green-600 font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/viewcriminals"
            onClick={handleLinkClick}
            className={`block py-2 px-3 rounded hover:bg-green-600 transition ${
              isActive("/viewcriminals") ? "bg-green-600 font-semibold" : ""
            }`}
          >
            View Criminals
          </Link>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="block w-full text-left py-2 px-3 rounded hover:bg-red-600 transition font-semibold text-red-400"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </nav>
  );
}
