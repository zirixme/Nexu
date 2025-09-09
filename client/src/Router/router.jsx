import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home.jsx";
import { SignIn } from "../pages/SignIn.jsx";
import { SignUp } from "../pages/SignUp.jsx";
import { RequireAuth } from "../components/RequireAuth.jsx";
import { Layout } from "../layout/Layout.jsx";
import { Search } from "../pages/Search.jsx";
import { Create } from "../pages/Create.jsx";
import { Messages } from "../pages/Messages.jsx";
import { Profile } from "../pages/Profile.jsx";
import { Signout } from "../pages/Signout.jsx";
import { PublicRoute } from "../components/PublicRoute.jsx";
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
      { path: "/profile/:username", element: <Profile /> },
    ],
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/signout",
    element: (
      <RequireAuth>
        <Signout />
      </RequireAuth>
    ),
  },
]);

export default router;
