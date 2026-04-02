import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export const Dropdown = ({
  trigger,
  children,
  align = "left",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger sử dụng màu text-primary */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer text-text-primary"
      >
        {trigger}
      </div>

      {/* Menu Box: Sử dụng background-paper và shadow */}
      {isOpen && (
        <div
          className={`absolute z-50 w-56 rounded-md border border-other-outlined-border bg-background-paper shadow-lg ${align === "right" ? "right-0" : "left-0"}`}
        >
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  variant?: "default" | "error";
}

export const DropdownItem = ({
  children,
  onClick,
  className = "",
  icon,
  variant = "default",
}: DropdownItemProps) => {
  // Xác định màu sắc dựa trên variant và typography
  const variantClasses =
    variant === "error"
      ? "text-error-main hover:bg-error-background"
      : "text-text-primary hover:bg-action-hover";

  return (
    <button
      onClick={onClick}
      className={`text-body-2 flex w-full items-center px-4 py-2 transition-colors ${variantClasses} ${className}`}
    >
      {icon && (
        <span className="mr-3 flex items-center justify-center">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
