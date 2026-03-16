import { forwardRef, type InputHTMLAttributes } from "react";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div className="group flex cursor-pointer items-center gap-4">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="peer sr-only"
            {...props}
          />
          {/* Đường ray của Toggle */}
          <div className="h-3.5 w-8 rounded-full bg-action-active transition-colors duration-200 peer-checked:bg-action-selected" />
          {/* Nút tròn di chuyển */}
          <div className="shadow-2xltransition-transform absolute -top-[3px] left-0 h-5 w-5 rounded-full bg-background-body-background duration-200 peer-checked:translate-x-5 peer-checked:bg-primary-main" />
        </div>
        {label && (
          <label
            htmlFor={id}
            className="text-body-1 cursor-pointer select-none text-text-secondary"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
