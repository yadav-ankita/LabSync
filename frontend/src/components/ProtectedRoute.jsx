import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getDashboardPath } from "../authRoutes";

function ProtectedRoute({ children, allowedRoles }) {
    const { currentUser, authLoading } = useAppContext();

    if (authLoading) return null;
    if (!currentUser) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to={getDashboardPath(currentUser.role)} replace />;
    }
    return children;
}

export default ProtectedRoute;