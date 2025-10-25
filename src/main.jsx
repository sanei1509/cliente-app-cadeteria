
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import AppRoutes from "./routes.jsx"; // usa RouterProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);

