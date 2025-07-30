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
  return (
    <div>
      <nav className="fixed bottom-0 md:top-0 w-full md:w-fit px-4 py-2 border md:px-6 md:py-6 border-gray-400 bg-gray-50">
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
          <li className="hidden md:inline">
            <a href="/signout">
              <LogOut />
            </a>
          </li>
        </ul>
      </nav>
      {toggle && <Create onClose={() => setToggle(false)} />}
    </div>
  );
};
