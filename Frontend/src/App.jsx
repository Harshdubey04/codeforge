import './App.css'
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./api/authAPI";
import { setUser, setLoading } from "./redux/authSlice";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import GuestRoute from './components/auth/GuestRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import LandingPage from './pages/public/LandingPage';
import PublicLayout from './layouts/PublicLayout';
import Problems from './pages/problems/Problems';
import ProblemDetails from './pages/problems/ProblemDetails';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import CreateProblem from './pages/admin/CreateProblem';
import EditProblem from './pages/admin/EditProblem';
import NotFound from './pages/public/NotFound';
import Settings from './pages/dashboard/Settings';
import Leaderboard from './pages/dashboard/Leaderboard';
import ProblemLayout from './layouts/ProblemLayout';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        dispatch(setUser(response.user));
      } catch {
        dispatch(setLoading(false));
      }
    };
    verifyAuth();
  }, []);

  return (
    <>
      <Routes>

        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
        </Route>

        {/* Admin login — guest only */}
        <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

        {/* User routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard"   element={<Dashboard />}   />
          <Route path="/problems"    element={<Problems />}    />
          <Route path="/profile"     element={<Profile />}     />
          <Route path="/settings"    element={<Settings />}    />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Problem Details — full screen, no sidebar */}
        <Route element={<ProtectedRoute><ProblemLayout /></ProtectedRoute>}>
          <Route path="/problems/:id" element={<ProblemDetails />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
          <Route path="/admin/create" element={<CreateProblem />} />
          <Route path="/admin/edit/:id"   element={<EditProblem />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;