import App from "@/App";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "@/pages/home/HomePage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ErrorPage from "@/pages/error/ErrorPage";
import ErrorBoundaryTestPage from "@/pages/test/ErrorBoundaryTestPage";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/atomic/templates/MainLayout/MainLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
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
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
