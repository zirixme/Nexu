import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../api/socket.js";
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
import { BarLoader } from "react-spinners";
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
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    if (!user.id) return;

    if (!socket.connected) socket.connect();

    socket.emit("register", user.id);

    const handleUserStatus = ({ userId, online }) => {
      setOnlineUsers((prev) => {
        if (online) {
          return prev.includes(userId) ? prev : [...prev, userId];
        } else {
          return prev.filter((id) => id !== userId);
        }
      });
    };

    socket.on("user_status", handleUserStatus);
    socket.on("online_users", setOnlineUsers);
  }, [user]);

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
      socket.connect();
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
      const newUser = {
        id: res.data.id,
        username: res.data.username,
        avatar_url: res.data.avatar_url,
      };
      setUser(newUser);
      setIsLoggedIn(true);
      return newUser;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await apiSignOut();
      socket.disconnect();
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
        setUser,
        onlineUsers,
      }}
    >
      {loading ? (
        <div className="flex w-full justify-center items-center">
          <BarLoader width={"100%"} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
