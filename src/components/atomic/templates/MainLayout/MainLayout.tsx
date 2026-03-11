import { Outlet } from "react-router-dom";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background-body-background">
      <Sidebar />

      <div className="flex-1">
        {/* <Header /> */}
        <main className="flex-1 overflow-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
