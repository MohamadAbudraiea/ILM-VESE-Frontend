import { useState } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaUserCheck,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import TeacherAnnouncementPanel from "./TeacherAnnouncements";

function TeacherNavbar() {
  const { isUserLoggingOut, logout, authTeacher } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          {authTeacher.first_name} {authTeacher.last_name}
        </div>

        {/* Center: Nav Items */}
        <div className="flex gap-6 text-accent text-sm items-center">
          <Link
            to="/teacher-dashboard"
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

          {/* Only show Take Absence link if section_id is available */}
          {authTeacher.section_id && (
            <Link
              to="/teacher-take-absence"
              className="flex items-center gap-1 cursor-pointer hover:text-yellow-500"
            >
              <FaUserCheck color="#fff" />
              <span>Take Absence</span>
            </Link>
          )}
          <button
            onClick={() => setIsAnnouncementOpen(true)}
            className="flex items-center gap-1 cursor-pointer hover:text-yellow-500 text-accent text-sm"
          >
            <FaComments color="#fff" />
            <span>Announcements</span>
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
        {/* Profile - Left Side */}
        <div className="font-bold text-base-100">
          {authTeacher.first_name} {authTeacher.last_name}
        </div>

        {/* Hamburger Button - Right Side */}
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-primary z-50 py-4 shadow-lg">
            <div className="flex flex-col gap-4 text-accent">
              <Link
                to="/teacher-dashboard"
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
              {authTeacher.section_id && (
                <Link
                  to="/teacher-take-absence"
                  className="flex items-center gap-3 py-2 px-6 cursor-pointer hover:text-yellow-500"
                  onClick={toggleMenu}
                >
                  <FaUserCheck color="#fff" />
                  <span>Take Absence</span>
                </Link>
              )}
              <button
                onClick={() => {
                  toggleMenu();
                  setIsAnnouncementOpen(true);
                }}
                className="flex items-center gap-3 py-2 px-6 cursor-pointer hover:text-yellow-500 text-left w-full"
              >
                <FaComments color="#fff" />
                <span>Announcements</span>
              </button>

              <div className="divider divider-accent my-0" />

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
      </div>

      {/* Announcements Panel */}
      <TeacherAnnouncementPanel
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
      />
    </div>
  );
}

export default TeacherNavbar;
