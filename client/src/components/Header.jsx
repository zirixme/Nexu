import {
  Home,
  UserSearch,
  CirclePlus,
  MessageSquare,
  UserRound,
} from "lucide-react";
import HomeSelected from "../assets/lucide/house.svg";
import SearchSelected from "../assets/lucide/user-search.svg";
import CreateSelected from "../assets/lucide/circle-plus.svg";
import MessagesSelected from "../assets/lucide/message-square.svg";
import ProfileSelected from "../assets/lucide/user-round.svg";

import { useLocation } from "react-router";

export const Header = () => {
  const location = useLocation();
  return (
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
          <a href="/create" className="flex items-center gap-2">
            {location.pathname === "/create" ? (
              <img src={CreateSelected} alt="create icon" />
            ) : (
              <CirclePlus />
            )}
            <span className="hidden xl:inline">Create</span>
          </a>
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
          <a href="/profile" className="flex items-center gap-2">
            {location.pathname === "/profile" ? (
              <img src={ProfileSelected} alt="create icon" />
            ) : (
              <UserRound />
            )}
            <span className="hidden xl:inline">Profile</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
