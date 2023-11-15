import { NavLink } from "react-router-dom";
import Clock from "../clock/Clock";

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="links flex-col">
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
        <Clock />
      </nav>
    </>
  );
}
