import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "../../atoms";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  classNameParent?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, placeholder = "", classNameParent }) => {
    return (
      <div
        className={`flex flex-col gap-1 text-text-primary ${classNameParent}`}
      >
        {label && <div className="text-input-text">{label}</div>}
        <Input placeholder={placeholder} className="!w-full" />
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
