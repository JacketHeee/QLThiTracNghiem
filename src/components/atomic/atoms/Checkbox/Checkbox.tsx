import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div className="group flex cursor-pointer items-center gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border transition-all checked:bg-primary-main"
            {...props}
          />
          <Check
            className="pointer-events-none absolute left-0.5 h-3 w-3 text-primary-contrast opacity-0 transition-opacity peer-checked:opacity-100"
            strokeWidth={3}
          />
        </div>
        {label && (
          <label
            htmlFor={id}
            className="text-button-medium cursor-pointer select-none text-text-secondary"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
