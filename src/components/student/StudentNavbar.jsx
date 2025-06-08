import { useState } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { Loader2 } from "lucide-react";
import StudentAnnouncements from "./StudentAnnouncements";

function StudentNavbar() {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const { isUserLoggingOut, logout, authStudent } = useAuthStore();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  if (isUserLoggingOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-primary px-4 py-7 shadow-md w-full">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center">
        {/* Left: Profile */}
        <div className="font-bold text-base-100">
          {authStudent.first_name} {authStudent.last_name}
        </div>

        {/* Center: Nav Items */}
        <div className="flex gap-6 text-accent text-sm items-center">
          <Link
            to="/student-dashboard"
            className="flex items-center gap-1 cursor-pointer hover:text-yellow-500"
          >
            <FaHome color="#fff" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/events"
            className="flex items-center gap-1 cursor-pointer hover:text-yellow-500"
          >
            <FaCalendarAlt color="#fff" />
            <span>Events</span>
          </Link>
          <button
            onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
            className="flex items-center gap-1 cursor-pointer hover:text-yellow-500 text-accent text-sm"
          >
            <FaComments color="#fff" />
            <span>Announcment</span>
          </button>
        </div>

        {/* Right: Logout */}
        <Link
          to="/"
          onClick={handleLogout}
          className="flex items-center gap-2 text-accent font-bold cursor-pointer hover:text-yellow-500"
        >
          <FaSignOutAlt color="#fff" />
          <span>Logout</span>
        </Link>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center">
        <div className="font-bold text-base-100">
          {authStudent.first_name} {authStudent.last_name}
        </div>

        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-primary z-50 py-4 shadow-lg">
          <div className="flex flex-col gap-4 text-accent">
            <Link
              to="/student-dashboard"
              className="flex items-center gap-3 py-2 px-6 cursor-pointer hover:text-yellow-500"
              onClick={toggleMenu}
            >
              <FaHome color="#fff" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-3 py-2 px-6 cursor-pointer hover:text-yellow-500"
              onClick={toggleMenu}
            >
              <FaCalendarAlt color="#fff" />
              <span>Events</span>
            </Link>
            <button
              onClick={() => {
                toggleMenu();
                setIsAnnouncementOpen(!isAnnouncementOpen);
              }}
              className="flex items-center gap-3 py-2 px-6 cursor-pointer hover:text-yellow-500 text-left w-full"
            >
              <FaComments color="#fff" />
              <span>Announcment</span>
            </button>

            <div className="divider divider-accent m-0" />

            <Link
              to="/"
              className="flex items-center gap-3 py-2 text-accent font-bold px-6 cursor-pointer hover:text-yellow-500"
              onClick={() => {
                toggleMenu();
                handleLogout();
              }}
            >
              <FaSignOutAlt color="#fff" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <StudentAnnouncements
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
      />
    </div>
  );
}

export default StudentNavbar;
