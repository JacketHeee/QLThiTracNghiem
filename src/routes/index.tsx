import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/atomic/templates/MainLayout/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage/DashboardPage";
import App from "@/App";
import HomePage from "@/pages/HomePage/HomePage";
import ErrorBoundaryTestPage from "@/pages/ErrorBoundaryTestPage/ErrorBoundaryTestPage";
import { CoursePage } from "@/pages/CoursePage/CoursePage";
import { ExamPage } from "@/pages/ExamPage/ExamPage";
import { CourseGroupPage } from "@/pages/CourseGroupPage/CourseGroupPage";
import { QuestionPage } from "@/pages/QuestionPage/QuestionPage";
import { UserPage } from "@/pages/UserPage/UserPage";
import { SubjectPage } from "@/pages/SubjectPage/SubjectPage";
import { AssignmentPage } from "@/pages/AssignmentPage/AssignmentPage";
import { TestPage } from "@/pages/TestPage/TestPage";
import { NotificationPage } from "@/pages/NotificationPage/NotificationPage";
import { PermissionGroupPage } from "@/pages/PermissionGroupPage/PermissionGroupPage";
import TestDesignSystem from "@/pages/TestDesignSystem/TestDesignSystem";
import TestPageDetail from "@/pages/TestPageDetail/TestPageDetail";
import AddTest from "@/pages/AddTest/AddTest";
import AddQuestionTestPage from "@/pages/AddQuestionTestPage/AddQuestionTestPage";
import CourseElement from "@/pages/CourseElement/CourseElement";
import ResultPage from "@/pages/ResultPage/ResultPage";
import DoTestPage from "@/pages/DoTestPage/DoTestPage";
import ResultDoTestPage from "@/pages/ResultDoTestPage/ResultDoTestPage";
import { ExamInstruction } from "@/components/atomic/organisms/ExamInstruction/ExamInstruction";
import { ExamDoing } from "@/components/atomic/organisms/ExamDoing/ExamDoing";

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
          {
            path: "/courses",
            children: [
              { index: true, element: <CoursePage /> },
              { path: "1", element: <CourseElement /> },
            ],
          },
          { path: "/exams", element: <ExamPage /> },
          { path: "/course-group", element: <CourseGroupPage /> },
          { path: "/question", element: <QuestionPage /> },
          { path: "/users", element: <UserPage /> },
          { path: "/subjects", element: <SubjectPage /> },
          { path: "/assignments", element: <AssignmentPage /> },
          {
            path: "/tests",
            children: [
              { index: true, element: <TestPage /> },
              {
                path: ":id",
                children: [
                  { index: true, element: <TestPageDetail /> },
                  { path: "result/:id", element: <ResultPage /> },
                  {
                    path: "take",
                    element: <DoTestPage />,
                    children: [
                      { index: true, element: <ExamInstruction /> },
                      { path: "doing", element: <ExamDoing /> },
                      {
                        path: "result/:attemptId",
                        element: <ResultDoTestPage />,
                      },
                    ],
                  },
                ],
              },
              {
                path: "add",
                children: [
                  { index: true, element: <AddTest /> },
                  { path: "add-questions", element: <AddQuestionTestPage /> },
                ],
              },
            ],
          },
          { path: "/notifications", element: <NotificationPage /> },
          { path: "/permission-groups", element: <PermissionGroupPage /> },
          { path: "/test-design-system", element: <TestDesignSystem /> },
          { path: "/error-page", element: <ErrorBoundaryTestPage /> },
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
