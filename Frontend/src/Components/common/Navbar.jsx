import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isLoginPage  = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isAuthPage   = isLoginPage || isSignupPage;

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 sticky top-0 z-50 backdrop-blur-md bg-base-100/80">

      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary text-2xl font-black">&lt;/&gt;</span>
          <span className="text-xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            CodeForge
          </span>
        </Link>
      </div>

      {/* Center nav links — hide on auth pages */}
      {!isAuthPage && (
        <div className="hidden md:flex items-center gap-1 flex-none">
          {[
            { label: "Problems",    to: "/problems"    },
            { label: "Leaderboard", to: "/leaderboard" },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="btn btn-ghost btn-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Right buttons */}
      <div className="flex-none flex items-center gap-2 ml-4">

        {/* On login page → show only Sign Up */}
        {isLoginPage && (
          <Link to="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </Link>
        )}

        {/* On signup page → show only Login */}
        {isSignupPage && (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}

        {/* On all other pages → show both + admin */}
        {!isAuthPage && (
          <>
            <Link to="/login"  className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            <div className="divider divider-horizontal mx-1" />
            <Link to="/admin/login" className="btn btn-outline btn-warning btn-sm">
              🔐 Admin
            </Link>
          </>
        )}

      </div>

    </div>
  );
};

export default Navbar;