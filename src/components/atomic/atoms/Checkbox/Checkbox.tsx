import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classnameLabel?: string;
  classnameParent?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, classnameLabel, classnameParent, ...props }, ref) => {
    return (
      <div
        className={`group flex cursor-pointer items-center gap-2 ${classnameParent}`}
      >
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-text-secondary transition-all checked:border-primary-main checked:bg-primary-main"
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
            className={`text-body-2 cursor-pointer select-none text-text-primary ${classnameLabel}`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
