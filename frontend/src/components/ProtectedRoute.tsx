import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem("inzozi_user");
  
  if (!userStr) {
    return <Navigate to="https://inzozi-rwanda-1.onrender.com/auth" replace />;
  }

  const user = JSON.parse(userStr);
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`https://inzozi-rwanda-1.onrender.com/dashboard/${user.role}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
