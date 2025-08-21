import { Navigate } from "react-router";
import { useAuth } from "./AuthContext.jsx";

export const RequireAuth = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/signin" replace />;

  return children;
};
