import { useNavigate } from "react-router";
import { useEffect } from "react";

export const Signout = () => {
  const navigate = useNavigate();
  localStorage.removeItem("token");
  navigate("/signin");

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/signin");
  }, [navigate]);
};
