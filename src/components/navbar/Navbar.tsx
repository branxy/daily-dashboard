import { NavLink } from "react-router-dom";
import Clock from "../clock/Clock";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { SetStateAction } from "react";
import Logout from "./Logout";

export type NavbarProps = {
  darkMode: string;
  setDarkMode: React.Dispatch<SetStateAction<string>>;
};

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  return (
    <>
      <nav className="navbar">
        <div className="links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="material-symbols-outlined">home</span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="material-symbols-outlined">task_alt</span>
          </NavLink>
        </div>
        <div className="theme-and-clock">
          <ThemeSwitcher darkMode={darkMode} setDarkMode={setDarkMode} />
          <Logout />
          <Clock darkMode={darkMode} />
        </div>
      </nav>
    </>
  );
}
