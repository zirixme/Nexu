import { Outlet } from "react-router";
import { Header } from "../components/Header.jsx";

export const Layout = () => {
  return (
    <div className="h-screen bg-gray-50">
      <Header />
      <main className="md:ml-20 flex justify-center xl:px-20">
        <Outlet />
      </main>
    </div>
  );
};
