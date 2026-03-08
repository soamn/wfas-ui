"use client";
import { useAuthStore } from "@/app/store/auth/auth.store";
import ButtonComponent from "./Button";
import { logoutRequest } from "@/app/store/auth/auth.api";
import { useTheme } from "@/app/provider/theme-provider";
import { FiSun, FiMoon } from "react-icons/fi";
import { PiUserCircle } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const fetchuser = useAuthStore((s) => s.fetchUser);
  const logout = useAuthStore((s) => s.deleteAuthData);
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchuser();
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="w-screen p-2 sticky top-0 backdrop-blur-2xl z-100 dark:text-white">
      <div className="border-2 dark:border-zinc-700 items-center px-2 py-1 rounded-xl min-h-15 flex w-full justify-between">
        <div className="flex  items-center">
          <a href="/">
            <Image
              src="/wfas_logo.svg"
              alt="WFAS Logo"
              width={80}
              height={80}
              className="object-cover "
            />{" "}
          </a>
          <h1 className="font-bold">WFAS</h1>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-amber-500 rounded-full w-10 h-10 flex justify-center items-center"
              >
                <span>{user.name.at(0)}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg py-1">
                  <div className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200  border-b dark:border-zinc-700 ">
                    <a href="/profile" className="flex items-center gap-2 ">
                      <PiUserCircle size={20} />
                      <span>{user.name}</span>
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                  >
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                    <span>
                      Switch to {theme === "light" ? "Dark" : "Light"} Mode
                    </span>
                  </button>
                  <button
                    onClick={async () => {
                      await logoutRequest(user);
                      logout();
                      router.refresh();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <a href="/login">
                <ButtonComponent text="Login" className="bg-orange-500" />
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
