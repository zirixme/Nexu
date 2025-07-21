import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home.jsx";
import { SignIn } from "../pages/SignIn.jsx";
import { SignUp } from "../pages/Signup.jsx";
import { RequireAuth } from "../components/RequireAuth.jsx";
let router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
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
