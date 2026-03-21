import React from "react";
import Button from "../Button/Button";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  hasBoder?: boolean;
}

export default function Input({
  icon,
  className = "",
  hasBoder,
  ...props
}: InputProps) {
  return (
    <div
      className={`flex w-fit items-center gap-1 rounded-md border border-other-outlined-border bg-background-body-background px-3 ${hasBoder && "!border-other-input-border"} ${className}`}
    >
      {icon && (
        <Button size={"small"} className="text-text-disabled">
          {icon}
        </Button>
      )}

      <input
        {...props}
        className={`h-10 bg-transparent text-text-primary outline-none placeholder:text-text-disabled ${className}`}
      />
    </div>
  );
}
