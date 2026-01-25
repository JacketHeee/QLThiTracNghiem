import App from "@/App";
import LoginPage from "@/pages/auth/LoginPage";
import HomePage from "@/pages/home/HomePage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ErrorPage from "@/pages/error/ErrorPage";
import ErrorBoundaryTestPage from "@/pages/test/ErrorBoundaryTestPage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />, // Dùng ErrorPage thay vì default Router v7 UI
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/test-error-boundary", element: <ErrorBoundaryTestPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
