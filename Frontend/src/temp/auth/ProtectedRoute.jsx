import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Common/Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, role } = useSelector(
        (state) => state.auth
    );

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Admin trying to access user routes → send to admin dashboard
    if (role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;