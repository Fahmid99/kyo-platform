import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { state } = useAuth();
  const { user, loading } = state;

  if (loading) {
    return <LoadingSpinner />; 
  }
     
  if (
    allowedRoles &&
    !user?.roles.some((role) => allowedRoles.includes(role))
  ) {
    return <Navigate to="/unauthorised" />;
  }
    
  return children;
};

export default ProtectedRoute;
