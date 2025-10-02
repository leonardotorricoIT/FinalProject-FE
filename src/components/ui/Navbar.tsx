import { Link, useNavigate } from "react-router";
import { MdLocalMovies } from "react-icons/md";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useUser } from "../../context/UserContext";
import { i18n } from "../../i18n";
import { UserRole } from "../../domain/User";
import ProfileSection from "../ProfileSection";


function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const isLoggedIn = user.isLoggedIn;
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = () => {
    if (!isLoggedIn) {
      return null;
    }
    if (user.role === UserRole.Admin) {
      return (
        <>
          <a href="/" className="hover:text-primary">
            {i18n.navbar.home}
          </a>
          <a href="/admin" className="hover:text-primary">
            {i18n.navbar.movies}
          </a>
          <a href="/admin/reviews" className="hover:text-primary">
            {i18n.navbar.reviews}
          </a>
        </>
      );
    }
    if (user.role === UserRole.User) {
      return null;
    }
  };

  return (
    <nav className="bg-primary-bg px-6 py-3 border-b border-gray-300">
      <div className="flex justify-between items-center">
        <div className="text-xl font-title flex items-center">
          <Link to="/" className="text-xl font-title flex items-center">
            <MdLocalMovies className="text-primary" /> {i18n.cinelog}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">{menuItems()}</div>

        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              {i18n.navbar.signin}
            </button>
          ) : (
            <ProfileSection />
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden">
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-500 w-fit"
            >
              {i18n.navbar.signin}
            </button>
          ) : (
            <ProfileSection />
          )}
          {menuItems()}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
