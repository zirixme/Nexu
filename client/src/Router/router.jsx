import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home.jsx";
import { SignIn } from "../pages/SignIn.jsx";
import { SignUp } from "../pages/Signup.jsx";
import { RequireAuth } from "../components/RequireAuth.jsx";
import { Header } from "../components/Header.jsx";
import { Layout } from "../layout/Layout.jsx";
import { Search } from "../pages/Search.jsx";
import { Create } from "../pages/Create.jsx";
import { Messages } from "../pages/Messages.jsx";
import { Profile } from "../pages/Profile.jsx";

let router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "create", element: <Create /> },
      { path: "messages", element: <Messages /> },
      { path: "/profile/:id", element: <Profile /> },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default router;
