import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toastSuccess } from "../utils/toast";

/* ---------------- LOGO ---------------- */

const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <img
      src="https://flowbite.com/docs/images/logo.svg"
      className="h-8"
      alt="Fit-Track Logo"
    />
    <span className="text-2xl font-bold text-white">
      Fit<span className="text-indigo-400">Track</span>
    </span>
  </Link>
);



const NavLinks = () => (
  <div className="hidden md:flex gap-6 text-white">
    <Link to="/" className="hover:text-indigo-400 transition">
      Home
    </Link>
    <Link to="/rag" className="hover:text-indigo-400 transition">
      RAG Bot
    </Link>
    <Link to="/contact" className="hover:text-indigo-400 transition">
      Contact
    </Link>
    <Link to="/about" className="hover:text-indigo-400 transition">
      About us
    </Link>
  </div>
);

/* ---------------- NAVBAR ---------------- */

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    toastSuccess("Logged out successfully 👋");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Logo />
        <NavLinks />

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-md
              hover:bg-indigo-700 transition"
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-md
                hover:bg-indigo-700 transition"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="border border-slate-700 text-slate-300
                px-4 py-1.5 rounded-md hover:text-white
                hover:border-slate-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
