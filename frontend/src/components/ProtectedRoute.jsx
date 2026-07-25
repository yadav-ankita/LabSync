import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

 
function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAppContext();
 
  if (authLoading) return null; // or a loading spinner
  if (!isAuthenticated) return <Navigate to="/student-login" replace />;
  return children;
}
export default ProtectedRoute;