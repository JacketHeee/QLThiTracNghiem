import { Outlet } from "react-router-dom";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import Header from "../../organisms/Header/Header";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background-body-background">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-background-body p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
