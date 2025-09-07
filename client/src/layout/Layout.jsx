import { Outlet } from "react-router";
import { Header } from "../components/Header.jsx";

export const Layout = () => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 dark:text-white safe-area">
      <Header />
      <main className="flex justify-center md:pl-18 xl:pl-41 bg-gray-50 dark:bg-gray-950 dark:text-white safe-area">
        <Outlet />
      </main>
    </div>
  );
};
