import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ErrorPage from "@/pages/error/ErrorPage";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/atomic/templates/MainLayout/MainLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import App from "@/App";
import HomePage from "@/pages/home/HomePage";
import ErrorBoundaryTestPage from "@/pages/test/ErrorBoundaryTestPage";
import { CoursePage } from "@/pages/hoc-phan/CoursePage";
import { ExamPage } from "@/pages/de-thi/ExamPage";
import { CourseGroupPage } from "@/pages/nhom-hoc-phan/CourseGroupPage";
import { QuestionPage } from "@/pages/cau-hoi/QuestionPage";
import { UserPage } from "@/pages/nguoi-dung/UserPage";
import { SubjectPage } from "@/pages/mon-hoc/SubjectPage";
import { AssignmentPage } from "@/pages/phan-cong/AssignmentPage";
import { TestPage } from "@/pages/de-kiem-tra/TestPage";
import { NotificationPage } from "@/pages/thong-bao/NotificationPage";
import { PermissionGroupPage } from "@/pages/nhom-quyen/PermissionGroupPage";
import TestDesignSystem from "@/pages/test-component/TestDesignSystem";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/courses", element: <CoursePage /> },
          { path: "/exams", element: <ExamPage /> },
          { path: "/course-group", element: <CourseGroupPage /> },
          { path: "/question", element: <QuestionPage /> },
          { path: "/users", element: <UserPage /> },
          { path: "/subjects", element: <SubjectPage /> },
          { path: "/assignments", element: <AssignmentPage /> },
          { path: "/tests", element: <TestPage /> },
          { path: "/notifications", element: <NotificationPage /> },
          { path: "/permission-groups", element: <PermissionGroupPage /> },
          { path: "/test-design-system", element: <TestDesignSystem /> },
          { path: "/error-page", element: <ErrorBoundaryTestPage /> },
          { path: "/test-design-system" },
        ],
      },

      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
