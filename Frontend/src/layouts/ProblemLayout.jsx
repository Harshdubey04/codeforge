import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api/authApi";
import { logout } from "../redux/authSlice";

const ProblemLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-100">

      {/* Top Navbar */}
      <div className="h-12 bg-base-200 border-b border-base-300 flex items-center justify-between px-4 shrink-0">

        {/* Left — Logo + back */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/problems")}
            className="btn btn-ghost btn-xs gap-1"
          >
            ← Back
          </button>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-primary font-black">&lt;/&gt;</span>
            <span className="font-black text-sm bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CodeForge
            </span>
          </div>
        </div>

        {/* Right — user + logout */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xs">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{user?.firstName}</span>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-xs text-error"
          >
            Logout
          </button>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
};

export default ProblemLayout;