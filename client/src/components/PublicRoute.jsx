import { Navigate } from "react-router";
import { useAuth } from "./AuthContext.jsx";

export const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return children;
};
