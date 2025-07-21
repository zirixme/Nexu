import { useEffect } from "react";
import { useNavigate } from "react-router";

export const RequireAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }
  }, [navigate]);

  return children;
};
