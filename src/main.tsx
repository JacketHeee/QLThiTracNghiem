import "@/styles/global.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./i18n";

// test con bo hiet nau

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);
