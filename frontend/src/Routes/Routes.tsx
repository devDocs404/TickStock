import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "../pages/Dashboard/Dashboard";
import Template from "../pages/Template";
import WorkInProgress from "./WorkInProgress";

const createRoutes = (isDark: boolean, setIsDark: (value: boolean) => void) => {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <Template setIsDark={setIsDark} isDark={isDark} />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
        {
          path: "/portfolio",
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
        {
          path: "/p&l",
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
        {
          path: "/account",
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
      ],
    },
    {
      path: "*",
      element: <WorkInProgress />,
    },
  ]);
};

export { createRoutes };
