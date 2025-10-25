import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";

const isAuth = () => !!localStorage.getItem("token");
const Private = ({ children }) => (isAuth() ? children : <Navigate to="/login" replace />);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // tu layout con <Outlet />
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <Private><Dashboard /></Private> },
      { path: "dashboardAdmin", element: <Private><DashboardAdmin /></Private> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
