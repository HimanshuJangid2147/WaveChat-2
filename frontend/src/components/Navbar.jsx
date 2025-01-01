import { LogOut, Settings, UserPen, LogIn, CircleEllipsis } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logoPath from '../assets/Wave-Chat_svg.svg'

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // We define reusable styles to maintain consistency
  const buttonStyles = `
    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
    bg-[#0a2a3d] hover:bg-[#0a2a3d]/80
    border border-slate-600/20
    transition-all duration-200 ease-in-out
    text-[#cdfdff]
  `;

  const mobileItemStyles = `
    block py-2 text-sm font-medium text-[#cdfdff]
    hover:bg-[#0a2a3d]/60 rounded-lg px-3
    transition-all duration-200
  `;

  return (
    <header className="bg-gradient-to-b from-[#002233] to-[#001522] shadow-lg sticky w-full top-0 z-10 backdrop-blur-lg font-redhat border-b border-slate-600/10">
      {/* Removed max-w-7xl and mx-auto for full width */}
      <div className="h-16 flex items-center justify-between px-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
        >
          <div className="h-10 w-10 flex items-center justify-center bg-[#0a2a3d] rounded-lg group-hover:bg-[#0a2a3d]/80 transition-colors">
            <img
              src={logoPath}
              alt="Wave Chat Logo"
              className="h-8 w-8"
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.target.onerror = null; 
                e.target.src = "/fallback-logo.svg"; 
              }}
            />
          </div>
          <span className="text-lg font-semibold tracking-wide text-[#cdfdff] group-hover:text-[#9afcff] transition-colors">
            Wave Chat
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-3">
            {isAuthPage ? (
              <Link
                to="/settings"
                className={buttonStyles}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-[#9afcff]" />
                <span className="hidden sm:inline text-[#cdfdff]">Settings</span>
              </Link>
            ) : authUser ? (
              <>
                <Link
                  to="/settings"
                  className={buttonStyles}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-[#9afcff]" />
                  <span className="hidden sm:inline text-[#cdfdff]">Settings</span>
                </Link>
                <Link
                  to="/profile"
                  className={buttonStyles}
                  aria-label="Profile"
                >
                  <UserPen className="w-5 h-5 text-[#9afcff]" />
                  <span className="hidden sm:inline text-[#cdfdff]">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className={`${buttonStyles} hover:bg-red-500/10`}
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="hidden sm:inline text-red-400">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/settings"
                  className={buttonStyles}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-[#9afcff]" />
                  <span className="hidden sm:inline text-[#cdfdff]">Settings</span>
                </Link>
                <Link
                  to="/login"
                  className={buttonStyles}
                  aria-label="Login"
                >
                  <LogIn className="w-5 h-5 text-[#9afcff]" />
                  <span className="hidden sm:inline text-[#cdfdff]">Login</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden flex items-center justify-center p-2 rounded-lg bg-[#0a2a3d] hover:bg-[#0a2a3d]/80 transition-all text-[#cdfdff]"
            aria-label="Toggle menu"
          >
            <CircleEllipsis className="w-6 h-6 text-[#9afcff]" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Now full width */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gradient-to-b from-[#001522] to-[#002233] border-t border-slate-600/10 py-4 px-4 space-y-2">
          {isAuthPage ? (
            <Link
              to="/settings"
              onClick={toggleMenu}
              className={mobileItemStyles}
            >
              <Settings className="inline w-5 h-5 text-[#9afcff] mr-2" />
              Settings
            </Link>
          ) : authUser ? (
            <>
              <Link
                to="/settings"
                onClick={toggleMenu}
                className={mobileItemStyles}
              >
                <Settings className="inline w-5 h-5 text-[#9afcff] mr-2" />
                Settings
              </Link>
              <Link
                to="/profile"
                onClick={toggleMenu}
                className={mobileItemStyles}
              >
                <UserPen className="inline w-5 h-5 text-[#9afcff] mr-2" />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className={`${mobileItemStyles} w-full text-left hover:bg-red-500/10`}
              >
                <LogOut className="inline w-5 h-5 text-red-400 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/settings"
                onClick={toggleMenu}
                className={mobileItemStyles}
              >
                <Settings className="inline w-5 h-5 text-[#9afcff] mr-2" />
                Settings
              </Link>
              <Link
                to="/login"
                onClick={toggleMenu}
                className={mobileItemStyles}
              >
                <LogIn className="inline w-5 h-5 text-[#9afcff] mr-2" />
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;