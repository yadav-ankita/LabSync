import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function ProtectedRoute({ children }) {
    const { currentUser } = useAppContext();
    return currentUser ? children : <Navigate to="/" />
}

export default ProtectedRoute;