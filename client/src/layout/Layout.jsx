import { Outlet } from "react-router";
import { Header } from "../components/Header.jsx";

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};
