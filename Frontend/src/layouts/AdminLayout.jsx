import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api/authAPI";
import { logout } from "../redux/authSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(logout());
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <div className="w-64 bg-base-200 border-r border-base-300 flex flex-col fixed h-full">

        {/* Logo */}
        <div className="p-6 border-b border-base-300">
          <h1 className="text-xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            CodeForge
          </h1>
          <p className="text-xs text-base-content/50 mt-1">
            ⚡ Admin Panel
          </p>
        </div>

        {/* Admin info */}
        <div className="px-6 py-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.firstName}</p>
              <p className="text-xs text-base-content/50">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-300"
              }`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/create"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-300"
              }`
            }
          >
            ➕ Create Problem
          </NavLink>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-base-300">
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm w-full text-error hover:bg-error/10"
          >
            🚪 Logout
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;