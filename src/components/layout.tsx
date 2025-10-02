import { Outlet } from "react-router";
import Navbar from "./ui/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-primary-bg dark:bg-gray-800">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
