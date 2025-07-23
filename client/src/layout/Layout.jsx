import { Outlet } from "react-router";
import { Header } from "../components/Header.jsx";

export const Layout = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      <Header />
      <main className="w-full flex items-baseline justify-center">
        <Outlet />
      </main>
    </div>
  );
};
