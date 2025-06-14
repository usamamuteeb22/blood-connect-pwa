
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  if (!isAdmin) {
    // If logged in but not an admin, redirect to user dashboard or a general page
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
