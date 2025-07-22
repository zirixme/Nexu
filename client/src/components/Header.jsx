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
    <nav className="absolute bottom-0 w-full px-4 py-2">
      <ul className="flex justify-between">
        <li>
          <a href="/">
            {location.pathname === "/" ? (
              <img src={HomeSelected} alt="home icon" />
            ) : (
              <Home />
            )}
          </a>
        </li>
        <li>
          <a href="/search">
            {location.pathname === "/search" ? (
              <img src={SearchSelected} alt="search icon" />
            ) : (
              <UserSearch />
            )}
          </a>
        </li>
        <li>
          <a href="/create">
            {location.pathname === "/create" ? (
              <img src={CreateSelected} alt="create icon" />
            ) : (
              <CirclePlus />
            )}
          </a>
        </li>
        <li>
          <a href="/messages">
            {location.pathname === "/messages" ? (
              <img src={MessagesSelected} alt="create icon" />
            ) : (
              <MessageSquare />
            )}
          </a>
        </li>
        <li>
          <a href="/profile">
            {location.pathname === "/profile" ? (
              <img src={ProfileSelected} alt="create icon" />
            ) : (
              <UserRound />
            )}
          </a>
        </li>
      </ul>
    </nav>
  );
};
