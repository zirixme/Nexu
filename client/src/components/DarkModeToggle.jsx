import { useEffect, useState } from "react";
import { MoonIcon } from "lucide-react";
export const DarkModeToggle = ({ newTheme }) => {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
  return (
    <button
      onClick={() => {
        setDark(!dark);
        newTheme(!dark);
      }}
      className=" text-black dark:text-white flex gap-2 cursor-pointer"
    >
      <MoonIcon />
      <span className="hidden xl:inline">Theme</span>
    </button>
  );
};
