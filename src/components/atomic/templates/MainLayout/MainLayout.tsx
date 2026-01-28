import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import { Header } from "../../organisms/Header/Header";

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-white transition-all duration-300">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
