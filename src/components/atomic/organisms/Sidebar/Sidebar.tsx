import { SidebarItem } from "../../molecules/SidebarItem/SidebarItem";
import dashboardIcon from "@/assets/icons/dashboard-icon.svg";
import classGroupsIcon from "@/assets/icons/class-groups-icon.svg";
import questionsIcon from "@/assets/icons/questions-icon.svg";
import usersIcon from "@/assets/icons/users-icon.svg";
import subjectsIcon from "@/assets/icons/subjects-icon.svg";
import assignmentsIcon from "@/assets/icons/assignments-icon.svg";
import examsIcon from "@/assets/icons/exams-icon.svg";
import notificationsIcon from "@/assets/icons/notifications-icon.svg";
import roleGroupsIcon from "@/assets/icons/role-groups-icon.svg";
import logoIcon from "@/assets/icons/logo-icon.svg";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}
export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={`sticky left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-100 bg-white transition-all duration-300 ${isCollapsed ? "w-[85px]" : "w-[280px]"} `}
    >
      <div
        className={`mb-2 flex h-20 items-center px-6 ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={logoIcon}
            alt="Logo"
            className="h-9 w-9 min-w-[36px] object-contain"
          />
          {!isCollapsed && (
            <span className="animate-fade-in truncate text-xl font-bold text-indigo-600">
              MaHiChAn
            </span>
          )}
        </div>

        <button
          onClick={onToggle}
          className={`ml-auto rounded-lg p-1.5 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 ${isCollapsed ? "absolute -right-3 top-7 rotate-180 border border-slate-100 bg-white shadow-md" : ""} `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pb-6">
        <SidebarItem
          icon={dashboardIcon}
          label="Tổng quan"
          to="/dashboard"
          hideLabel={isCollapsed}
        />

        <div
          className={`mb-4 mt-6 px-7 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          {!isCollapsed ? (
            <p className="animate-fade-in text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
              Quản lý
            </p>
          ) : (
            <div className="h-[3px] w-8 rounded-full bg-slate-100" />
          )}
        </div>
        <div className="space-y-1">
          <SidebarItem
            icon={classGroupsIcon}
            label="Nhóm học phần"
            to="/class-groups"
            hideLabel={isCollapsed}
          />
          <SidebarItem
            icon={questionsIcon}
            label="Câu hỏi"
            to="/questions"
            hideLabel={isCollapsed}
          />
          <SidebarItem
            icon={usersIcon}
            label="Người dùng"
            to="/users"
            hideLabel={isCollapsed}
          />
          <SidebarItem
            icon={subjectsIcon}
            label="Môn học"
            to="/subjects"
            hasSubmenu
            hideLabel={isCollapsed}
          />
          <SidebarItem
            icon={assignmentsIcon}
            label="Phân công"
            to="/assignments"
            hasSubmenu
            hideLabel={isCollapsed}
          />
          <SidebarItem
            icon={examsIcon}
            label="Đề kiểm tra"
            to="/exams"
            hasSubmenu
          />
          <SidebarItem
            icon={notificationsIcon}
            label="Thông báo"
            to="/notifications"
            hasSubmenu
            hideLabel={isCollapsed}
          />
        </div>

        <div
          className={`mb-4 mt-8 px-7 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          {!isCollapsed ? (
            <p className="animate-fade-in text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
              Quản trị
            </p>
          ) : (
            <div className="h-[3px] w-8 rounded-full bg-slate-100" />
          )}
        </div>
        <div className="space-y-1">
          <SidebarItem
            icon={roleGroupsIcon}
            label="Nhóm quyền"
            to="/roles"
            hideLabel={isCollapsed}
          />
        </div>
      </div>
    </aside>
  );
};
