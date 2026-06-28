import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard":   "Dashboard",
  "/problems":    "Problems",
  "/leaderboard": "Leaderboard",
  "/profile":     "Profile",
  "/settings":    "Settings",
};

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] || "CodeForge";

  return (
    <div className="h-16 bg-base-100 border-b border-base-300 flex justify-between items-center px-6">

      {/* Page title */}
      <h2 className="text-lg font-bold">{title}</h2>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Streak badge */}
        <div className="flex items-center gap-1 bg-base-200 px-3 py-1.5 rounded-full">
          <span>🔥</span>
          <span className="text-sm font-semibold">0</span>
          <span className="text-xs text-base-content/50">streak</span>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm cursor-pointer">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>

      </div>

    </div>
  );
};

export default Topbar;