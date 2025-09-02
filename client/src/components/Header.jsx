import {
  Home,
  UserSearch,
  CirclePlus,
  MessageSquare,
  UserRound,
  LogOut,
  MoonIcon,
} from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle.jsx";
import logo from "../assets/logo-189x46.svg";
import { Link, useLocation } from "react-router";
import { Create } from "../pages/Create.jsx";

import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

export const Header = () => {
  const [toggle, setToggle] = useState(false);
  const { signout, user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const linkClasses = (path) =>
    `md:px-6 md:py-4 px-4 py-2 transition-all flex items-center gap-2 ${
      location.pathname === path
        ? "bg-gray-200 dark:bg-gray-800"
        : "hover:bg-gray-200 dark:hover:bg-gray-800"
    }`;

  return (
    <div>
      <nav className="fixed bottom-0 md:top-0 w-full md:w-fit border-r border-gray-400 bg-gray-50 flex flex-col justify-between dark:bg-gray-950 dark:text-white dark:border-gray-600 py-6">
        <ul className="flex justify-between md:flex-col">
          <li className="hidden xl:inline md:px-6 md:py-4 px-4 py-2 mt-4">
            <Link to="/">
              <img src={logo} alt="logo" className="w-28" />
            </Link>
          </li>
          <li>
            <Link to="/" className={linkClasses("/")}>
              <Home />
              <span className="hidden xl:inline">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/search" className={linkClasses("/search")}>
              <UserSearch />
              <span className="hidden xl:inline">Search</span>
            </Link>
          </li>
          <li>
            <button
              className="md:px-6 md:py-4 px-4 py-2 transition-all flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() => setToggle(!toggle)}
            >
              <CirclePlus />
              <span className="hidden xl:inline">Create</span>
            </button>
          </li>
          <li>
            <Link to="/messages" className={linkClasses("/messages")}>
              <MessageSquare />
              <span className="hidden xl:inline">Messages</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/${user.username}`}
              className={linkClasses(`/profile/${user.username}`)}
            >
              <UserRound />
              <span className="hidden xl:inline">Profile</span>
            </Link>
          </li>
          <li className="md:px-6 md:py-4 px-4 py-2 transition-all hover:bg-gray-200 dark:hover:bg-gray-800">
            <DarkModeToggle svg={MoonIcon} />
          </li>
        </ul>
        <ul className="xl:gap-6 hidden md:flex items-center justify-center md:px-6 md:py-4 px-4 py-2">
          <li className="flex gap-3 items-center">
            <div className="bg-gray-50 rounded-full">
              <img
                src={user.avatar_url}
                alt="user picture"
                className="w-12 h-12 rounded-full object-cover hidden xl:inline border border-gray-50"
              />
            </div>
            <p className="font-bold hidden xl:inline">{user.username}</p>
          </li>
          <li>
            <button
              className="flex gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut />
            </button>
          </li>
        </ul>
      </nav>
      {toggle && <Create onClose={() => setToggle(false)} />}
    </div>
  );
};
