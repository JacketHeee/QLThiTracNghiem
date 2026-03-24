import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "../../atoms";
import Logo from "../../molecules/Logo/Logo";

const SIDEBAR_SECTIONS = [
  {
    title: null,
    items: [
      {
        icon: "home",
        labelKey: "sidebar.overview",
        to: "/dashboard",
      },
    ],
  },
  {
    title: "sidebar.sections.student",
    items: [
      {
        icon: "users",
        labelKey: "sidebar.items.courses",
        to: "/courses",
      },
      {
        icon: "calendar",
        labelKey: "sidebar.items.exams",
        to: "/exams",
      },
    ],
  },
  {
    title: "sidebar.sections.management",
    items: [
      {
        icon: "clipboard",
        labelKey: "sidebar.items.courseGroup",
        to: "/course-group",
      },
      {
        icon: "question",
        labelKey: "sidebar.items.questions",
        to: "/question",
      },
      {
        icon: "user",
        labelKey: "sidebar.items.users",
        to: "/users",
      },
      {
        icon: "folder",
        labelKey: "sidebar.items.subjects",
        to: "/subjects",
      },
      {
        icon: "refresh",
        labelKey: "sidebar.items.assignments",
        to: "/assignments",
      },
      {
        icon: "documentDuplicate",
        labelKey: "sidebar.items.tests",
        to: "/tests",
      },
      {
        icon: "massage",
        labelKey: "sidebar.items.notifications",
        to: "/notifications",
      },
    ],
  },
  {
    title: "sidebar.sections.admin",
    items: [
      {
        icon: "groupUser",
        labelKey: "sidebar.items.permissionGroups",
        to: "/permission-groups",
      },
    ],
  },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={`flex h-screen flex-col ${isCollapsed ? "w-fit" : "min-w-[260px] max-w-[260px]"}`}
    >
      {/* Header */}
      <div className={`relative flex justify-between p-3`}>
        {!isCollapsed && <Logo />}
        <Button
          className={(isCollapsed && "rotate-180") + ""}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          <Icon name="menuArrow" size={22} />
        </Button>
      </div>

      {/* Menu */}
      <div
        className={`flex flex-1 flex-col pt-0 ${isCollapsed && "justify-center"}`}
      >
        {SIDEBAR_SECTIONS.map((item, idx) => {
          if (!item.title) {
            const child = item.items[0];
            return (
              <div key={idx} className="px-3">
                <NavLink to={child.to}>
                  {({ isActive }) => (
                    <Button
                      className={`w-full ${isActive && "bg-primary-background text-primary-main"}`}
                      tooltip={isCollapsed ? t(child.labelKey) : undefined}
                    >
                      <Icon name={child.icon} className="shrink-0" />
                      {!isCollapsed && t(child.labelKey)}
                    </Button>
                  )}
                </NavLink>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`${!isCollapsed && "mt-4"} flex flex-col gap-0.5`}
            >
              {!isCollapsed && (
                <div className="flex items-center gap-4">
                  <span className="h-0.5 w-4 bg-other-divider" />
                  <span className="text-caption overflow-hidden text-nowrap text-text-disabled">
                    {t(item.title)}
                  </span>
                </div>
              )}

              <div className="m-3 flex flex-col gap-1">
                {item.items.map((child, childIdx) => (
                  <NavLink key={childIdx} to={child.to}>
                    {({ isActive }) => (
                      <Button
                        className={`w-full ${isActive && "bg-action-selected text-primary-main"}`}
                        tooltip={isCollapsed ? t(child.labelKey) : undefined}
                      >
                        <Icon name={child.icon} className="shrink-0" />
                        {!isCollapsed && t(child.labelKey)}
                      </Button>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
