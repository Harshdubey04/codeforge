import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Common/Loader";

const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading, role } = useSelector(
        (state) => state.auth
    );

    if (loading) {
        return <Loader />;
    }

    if (isAuthenticated) {
        return role === "admin"
            ? <Navigate to="/admin/dashboard" />
            : <Navigate to="/dashboard" />;
    }

    return children;
};

export default GuestRoute;