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

const SIDEBAR_SECTIONS = [
  {
    title: null,
    items: [
      {
        icon: dashboardIcon,
        label: "Tổng quan",
        to: "/dashboard",
      },
    ],
  },
  {
    title: "Quản lý",
    items: [
      { icon: classGroupsIcon, label: "Nhóm học phần", to: "/class-groups" },
      { icon: questionsIcon, label: "Câu hỏi", to: "/questions" },
      { icon: usersIcon, label: "Người dùng", to: "/users" },
      {
        icon: subjectsIcon,
        label: "Môn học",
        to: "/subjects",
        hasSubmenu: true,
      },
      {
        icon: assignmentsIcon,
        label: "Phân công",
        to: "/assignments",
        hasSubmenu: true,
      },
      {
        icon: examsIcon,
        label: "Đề kiểm tra",
        to: "/exams",
        hasSubmenu: true,
      },
      {
        icon: notificationsIcon,
        label: "Thông báo",
        to: "/notifications",
        hasSubmenu: true,
      },
    ],
  },
  {
    title: "Quản trị",
    items: [{ icon: roleGroupsIcon, label: "Nhóm quyền", to: "/roles" }],
  },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={`sticky left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-100 bg-white transition-all duration-300 ${
        isCollapsed ? "w-[85px]" : "w-[280px]"
      }`}
    >
      {/* Header */}
      <div
        className={`mb-2 flex h-20 items-center px-6 ${
          isCollapsed ? "justify-center" : ""
        }`}
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
          className={`ml-auto rounded-lg p-1.5 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 ${
            isCollapsed
              ? "absolute -right-3 top-7 rotate-180 border border-slate-100 bg-white shadow-md"
              : ""
          }`}
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

      {/* Menu */}
      <div className="flex-1 overflow-y-auto pb-6">
        {SIDEBAR_SECTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <div
                className={`mb-4 mt-6 px-7 transition-all duration-300 ${
                  isCollapsed ? "flex justify-center" : ""
                }`}
              >
                {!isCollapsed ? (
                  <p className="animate-fade-in text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
                    {section.title}
                  </p>
                ) : (
                  <div className="h-[3px] w-8 rounded-full bg-slate-100" />
                )}
              </div>
            )}

            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  hasSubmenu={item.hasSubmenu}
                  hideLabel={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
