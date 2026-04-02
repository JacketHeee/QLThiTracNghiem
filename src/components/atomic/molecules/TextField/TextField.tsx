import { forwardRef } from "react";
import Input from "../../atoms/Input/Input";
import type { InputProps } from "../../atoms/Input/Input";

interface TextFieldProps extends InputProps {
  label?: string;
  error?: string;
  classNameParent?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, placeholder = "", classNameParent = "", ...props }, ref) => {
    return (
      <div
        className={`flex flex-col gap-1 text-text-primary ${classNameParent}`}
      >
        {label && (
          <label className="text-body-2-semibold text-text-secondary">
            {label}
          </label>
        )}

        <Input ref={ref} placeholder={placeholder} {...props} />

        {error && (
          <span className="text-caption mt-0.5 text-alert-error-content">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
