import { useState } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { UserRole } from "@/constants/enums";
import UserProfileDropdown from "@/components/common/UserProfileDropdown";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Link, useLocation } from "react-router-dom";

const PublicHeader = () => {
  const { isAuthenticated, isInitialized, role } = useAppSelector(
    (state) => state.auth
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="w-full py-2 font-medium text-sm text-primary-foreground text-center bg-gradient-to-r from-primary to-primary/0">
        <p>
          <span className="px-3 py-1 rounded-md text-primary bg-white mr-2">
            New
          </span>
          Connect with top employers today
        </p>
      </div>
      <nav className="z-30 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur text-slate-800 text-sm">
        <Link to="/">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 bg-primary"
              role="img"
              aria-label="logo"
              style={{
                maskImage: "url(/blue.png)",
                WebkitMaskImage: "url(/blue.png)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
            <span className="text-xl font-bold text-gray-900">ZeekNet</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to="/" className={isActive('/') ? "text-primary font-medium" : "hover:text-primary transition"}>
            Home
          </Link>
          <Link to="/jobs" className={isActive('/jobs') ? "text-primary font-medium" : "hover:text-primary transition"}>
            Find Jobs
          </Link>
          <Link to="/companies" className={isActive('/companies') ? "text-primary font-medium" : "hover:text-primary transition"}>
            Companies
          </Link>
          <Link to="/articles" className={isActive('/articles') ? "text-primary font-medium" : "hover:text-primary transition"}>
            Articles
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isInitialized && isAuthenticated ? (
            <>
              {role === UserRole.SEEKER && <NotificationBell />}
              <UserProfileDropdown />
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/auth/register"
                className="px-6 py-2 bg-primary hover:bg-primary/90 transition text-white rounded-md"
              >
                Get started
              </Link>
              <Link
                to="/auth/login"
                className="hover:bg-slate-100 transition px-6 py-2 border border-primary rounded-md"
              >
                Login
              </Link>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden active:scale-90 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </nav>


      <div
        className={`fixed inset-0 z-[100] bg-white/95 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} className={isActive('/') ? "text-primary font-medium" : ""}>
          Home
        </Link>
        <Link to="/jobs" onClick={() => setMenuOpen(false)} className={isActive('/jobs') ? "text-primary font-medium" : ""}>
          Find Jobs
        </Link>
        <Link to="/companies" onClick={() => setMenuOpen(false)} className={isActive('/companies') ? "text-primary font-medium" : ""}>
          Companies
        </Link>
        <Link to="/articles" onClick={() => setMenuOpen(false)} className={isActive('/articles') ? "text-primary font-medium" : ""}>
          Articles
        </Link>

        {!isAuthenticated && (
          <>
            <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/auth/register" onClick={() => setMenuOpen(false)}>
              Get started
            </Link>
          </>
        )}

        <button
          onClick={() => setMenuOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default PublicHeader;