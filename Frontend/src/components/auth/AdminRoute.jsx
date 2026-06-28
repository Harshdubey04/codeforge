import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../common/Loader";

const AdminRoute = ({ children }) => {
    const { isAuthenticated, role, loading } = useSelector(
        (state) => state.auth
    );

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;