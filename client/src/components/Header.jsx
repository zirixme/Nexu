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

import { Create } from "../pages/Create.jsx";

import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
export const Header = () => {
  const [toggle, setToggle] = useState(false);
  const { signout, user } = useAuth();
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div>
      <nav className="fixed bottom-0 md:top-0 w-full md:w-fit   border-r  border-gray-400 bg-gray-50 flex flex-col justify-between dark:bg-gray-950 dark:text-white dark:border-gray-600">
        <ul className="flex justify-between md:flex-col   ">
          <li className="hidden xl:inline md:px-6 md:py-4 px-4 py-2 mt-4">
            <a href="/">
              <img src={logo} alt="logo" className="w-28" />
            </a>
          </li>
          <li className="hover:bg-gray-200 md:px-6 md:py-4 px-4 py-2 transition-all">
            <a href="/" className="flex items-center gap-2">
              <Home />

              <span className="hidden xl:inline ">Home</span>
            </a>
          </li>
          <li className="hover:bg-gray-200 md:px-6 md:py-4 px-4 py-2 transition-all">
            <a href="/search" className="flex items-center gap-2">
              <UserSearch />

              <span className="hidden xl:inline">Search</span>
            </a>
          </li>
          <li className="hover:bg-gray-200 md:px-6 md:py-4 px-4 py-2 transition-all">
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setToggle(!toggle)}
            >
              <CirclePlus />
              <span className="hidden xl:inline">Create</span>
            </button>
          </li>
          <li className="hover:bg-gray-200 md:px-6 md:py-4 px-4 py-2 transition-all">
            <a href="/messages" className="flex items-center gap-2">
              <MessageSquare />

              <span className="hidden xl:inline">Messages</span>
            </a>
          </li>
          <li className="hover:bg-gray-200 md:px-6 md:py-4 px-4 py-2 transition-all">
            <a
              href={`/profile/${user.username}`}
              className="flex items-center gap-2"
            >
              <UserRound />

              <span className="hidden xl:inline">Profile</span>
            </a>
          </li>
          <li className="hover:bg-gray-200 md:px-6 md:py-4 px-4 py-2 transition-all">
            <DarkModeToggle svg={MoonIcon} />
          </li>
        </ul>
        <ul className=" xl:gap-6 hidden md:flex items-center justify-center py-2 ">
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
