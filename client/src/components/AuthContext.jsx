import { createContext, useContext, useState, useEffect } from "react";
import {
  signin as apiSignIn,
  signout as apiSignOut,
  signup as apiSignUp,
  API,
} from "../api/auth.js";
import {
  setAccessToken as setAxiosToken,
  getAccessToken,
} from "../api/authToken.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(getAccessToken() || null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());
  const [user, setUser] = useState({
    id: null,
    username: "",
    avatar_url: null,
  });

  // Refresh token on mount
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await API.get("/auth/refresh");
        setToken(res.data.accessToken);
        setAxiosToken(res.data.accessToken);
        setIsLoggedIn(true);
        setUser({
          id: res.data.id,
          username: res.data.username,
          avatar_url: res.data.avatar_url,
        });
      } catch {
        setToken(null);
        setAxiosToken(null);
        setIsLoggedIn(false);
        setUser({ id: null, username: "", avatar_url: null });
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  const signin = async (credentials) => {
    try {
      const res = await apiSignIn(credentials);
      setToken(res.data.accessToken);
      setAxiosToken(res.data.accessToken);
      setIsLoggedIn(true);
      setUser({
        id: res.data.id,
        username: res.data.username,
        avatar_url: res.data.avatar_url,
      });
    } catch (error) {
      console.error("Signin failed:", error);
      throw error;
    }
  };

  const signup = async (credentials) => {
    try {
      const res = await apiSignUp(credentials);
      setToken(res.data.accessToken);
      setAxiosToken(res.data.accessToken);
      setIsLoggedIn(true);
      setUser({
        id: res.data.id,
        username: res.data.username,
        avatar_url: res.data.avatar_url,
      });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await apiSignOut();
    } finally {
      setToken(null);
      setAxiosToken(null);
      setIsLoggedIn(false);
      setUser({ id: null, username: "", avatar_url: null });
      document.cookie = "refreshToken=; Max-Age=0; path=/;";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoggedIn,
        user,
        signin,
        signup,
        signout,
        loading,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
