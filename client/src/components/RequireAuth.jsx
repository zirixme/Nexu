import { Navigate } from "react-router";
import { useAuth } from "./AuthContext.jsx";

export const RequireAuth = ({ children }) => {
  const { accessToken, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!accessToken) return <Navigate to="/signin" replace />;

  return children;
};
