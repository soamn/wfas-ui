"use client";

import { useTheme } from "@/app/provider/theme-provider";
import { BiSun } from "react-icons/bi";
import { LuMoonStar } from "react-icons/lu";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? (
        <LuMoonStar className="w-6 h-6" />
      ) : (
        <BiSun className="w-6 h-6" />
      )}
    </button>
  );
}
