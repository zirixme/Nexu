import { useEffect, useState } from "react";
import { MoonIcon } from "lucide-react";
export const DarkModeToggle = () => {
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
      onClick={() => setDark(!dark)}
      className=" text-black dark:text-white"
    >
      <MoonIcon />
    </button>
  );
};
