import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useState } from "react";

export default function IndexPage() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dd-darkmode") || ""
  );
  return (
    <div className={`mode ${darkMode}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
