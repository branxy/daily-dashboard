import { NavbarProps } from "./Navbar";

export const ThemeSwitcher = ({ darkMode, setDarkMode }: NavbarProps) => {
  function switchToLightMode() {
    setDarkMode("");
    localStorage.setItem("dd-darkmode", "");
  }
  function switchToDarkMode() {
    setDarkMode("darkmode");
    localStorage.setItem("dd-darkmode", "darkmode");
  }
  let switcherButton;
  if (darkMode === "darkmode") {
    switcherButton = (
      <button onClick={switchToLightMode}>
        <span className="material-symbols-outlined">light_mode</span>
      </button>
    );
  } else {
    switcherButton = (
      <button onClick={switchToDarkMode}>
        <span className="material-symbols-outlined">dark_mode</span>
      </button>
    );
  }
  return <div className="theme-switcher">{switcherButton}</div>;
};
