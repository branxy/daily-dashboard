import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function IndexPage() {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </>
  );
}
