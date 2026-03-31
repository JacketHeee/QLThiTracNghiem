import { forwardRef, type InputHTMLAttributes } from "react";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <label className="group flex cursor-pointer items-center gap-4">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="peer sr-only"
            {...props}
          />
          {/* Đường ray của Toggle */}
          <div className="h-3.5 w-8 rounded-full border border-other-outlined-border bg-action-active transition-colors duration-200 peer-checked:border-action-selected peer-checked:bg-action-selected" />
          {/* Nút tròn di chuyển */}
          <div className="absolute -top-[3px] left-0 h-5 w-5 rounded-full border border-action-hover bg-background-body-background shadow-2xl transition-transform duration-200 peer-checked:translate-x-5 peer-checked:bg-primary-main" />
        </div>
        {label && (
          <label
            htmlFor={id}
            className="text-body-1 cursor-pointer select-none text-text-secondary"
          >
            {label}
          </label>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
