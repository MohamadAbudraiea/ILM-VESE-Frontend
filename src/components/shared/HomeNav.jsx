import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";

function HomeNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-primary px-4 py-3 shadow-md w-full">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/" className="btn btn-ghost px-0">
            <img
              src="Logo.png"
              alt="Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex gap-6 text-accent text-sm items-center">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-yellow-500"
            onClick={toggleMenu}
          >
            <FaHome color="#fff" />
            <span>Home</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 hover:text-yellow-500"
          >
            <FaEnvelope color="#fff" />
            <span>Contact Us</span>
          </Link>

          <Link
            to="/events"
            className="flex items-center gap-2 hover:text-yellow-500"
          >
            <FaCalendarAlt color="#fff" />
            <span>Events</span>
          </Link>

          <Link
            to="/about us"
            className="flex items-center gap-2 hover:text-yellow-500"
          >
            <FaInfoCircle color="#fff" />
            <span>About Us</span>
          </Link>
        </div>

        {/* Right: Login Dropdown */}
        <div className="text-accent font-bold">
          <details className="dropdown dropdown-end">
            <summary className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
              <FaSignInAlt color="#fff" />
              <span>Login</span>
            </summary>
            <ul className="p-2 mt-2 shadow menu dropdown-content z-[1] bg-base-100 text-neutral rounded-box w-52">
              <li>
                <Link to="/studentLogin">Login as student/parent</Link>
              </li>
              <div className="divider divider-primary my-0" />
              <li>
                <Link to="/staffLogin">Login as staff</Link>
              </li>
            </ul>
          </details>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="btn btn-ghost px-0">
          <img src="/Logo-without-bg.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Hamburger Button */}
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-primary z-50 py-4 shadow-lg">
            <div className="flex flex-col gap-4 text-accent">
              <Link
                to="/"
                className="flex items-center gap-3 py-2 cursor-pointer hover:text-yellow-500 pl-6"
                onClick={toggleMenu}
              >
                <FaHome color="#fff" />
                <span>Home</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 py-2 cursor-pointer hover:text-yellow-500 pl-6"
                onClick={toggleMenu}
              >
                <FaEnvelope color="#fff" />
                <span>Contact Us</span>
              </Link>

              <Link
                to="/events"
                className="flex items-center gap-3 py-2 cursor-pointer hover:text-yellow-500 pl-6"
                onClick={toggleMenu}
              >
                <FaCalendarAlt color="#fff" />
                <span>Events</span>
              </Link>

              <Link
                to="/about us"
                className="flex items-center gap-3 py-2 cursor-pointer hover:text-yellow-500 pl-6"
                onClick={toggleMenu}
              >
                <FaInfoCircle color="#fff" />
                <span>About Us</span>
              </Link>

              <div className="divider divider-accent my-0" />

              <div className="flex flex-col gap-2">
                <Link
                  to="/studentLogin"
                  className="flex items-center gap-3 py-2 cursor-pointer hover:text-yellow-500 pl-6"
                  onClick={toggleMenu}
                >
                  <FaSignInAlt color="#fff" />
                  <span>Login as student/parent</span>
                </Link>

                <Link
                  to="/staffLogin"
                  className="flex items-center gap-3 py-2 cursor-pointer hover:text-yellow-500 pl-6"
                  onClick={toggleMenu}
                >
                  <FaSignInAlt color="#fff" />
                  <span>Login as staff</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeNav;
