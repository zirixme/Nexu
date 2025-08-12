import {
  Home,
  UserSearch,
  CirclePlus,
  MessageSquare,
  UserRound,
  LogOut,
} from "lucide-react";
import HomeSelected from "../assets/lucide/house.svg";
import SearchSelected from "../assets/lucide/user-search.svg";
import CreateSelected from "../assets/lucide/circle-plus.svg";
import MessagesSelected from "../assets/lucide/message-square.svg";
import ProfileSelected from "../assets/lucide/user-round.svg";

import { Create } from "../pages/Create.jsx";

import { useState } from "react";
import { useLocation } from "react-router";

export const Header = () => {
  const location = useLocation();

  const [toggle, setToggle] = useState(false);
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar_url");

  return (
    <div>
      <nav className="fixed bottom-0 md:top-0 w-full md:w-fit px-4 py-2 border md:px-6 md:py-6 border-gray-400 bg-gray-50 flex flex-col justify-between">
        <ul className="flex justify-between md:flex-col md:gap-7">
          <li>
            <a href="/" className="flex items-center gap-2">
              {location.pathname === "/" ? (
                <img src={HomeSelected} alt="home icon" />
              ) : (
                <Home />
              )}
              <span className="hidden xl:inline">Home</span>
            </a>
          </li>
          <li>
            <a href="/search" className="flex items-center gap-2">
              {location.pathname === "/search" ? (
                <img src={SearchSelected} alt="search icon" />
              ) : (
                <UserSearch />
              )}
              <span className="hidden xl:inline">Search</span>
            </a>
          </li>
          <li>
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setToggle(!toggle)}
            >
              <CirclePlus />
              <span className="hidden xl:inline">Create</span>
            </button>
          </li>
          <li>
            <a href="/messages" className="flex items-center gap-2">
              {location.pathname === "/messages" ? (
                <img src={MessagesSelected} alt="create icon" />
              ) : (
                <MessageSquare />
              )}
              <span className="hidden xl:inline">Messages</span>
            </a>
          </li>
          <li>
            <a
              href={`/profile/${localStorage.getItem("userId")}`}
              className="flex items-center gap-2"
            >
              {location.pathname.startsWith === "/profile" ? (
                <img src={ProfileSelected} alt="create icon" />
              ) : (
                <UserRound />
              )}
              <span className="hidden xl:inline">Profile</span>
            </a>
          </li>
        </ul>
        <ul className=" xl:gap-6 hidden md:flex items-center justify-center">
          <li className="flex gap-2 items-center">
            <img
              src={avatar}
              alt="user picture"
              className="w-8 h-8 rounded-full object-cover hidden xl:inline"
            />
            <p className="font-bold hidden xl:inline">{username}</p>
          </li>
          <li>
            <a href="/signout" className="flex gap-2">
              <LogOut />
            </a>
          </li>
        </ul>
      </nav>
      {toggle && <Create onClose={() => setToggle(false)} />}
    </div>
  );
};
