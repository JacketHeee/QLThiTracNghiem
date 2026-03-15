import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
      className={`flex w-fit items-center gap-2 rounded-md border border-background-body-background bg-background-body-background px-3 focus-within:border-action-selected ${hasBoder && "!border-other-input-border"} ${className}`}
    >
      {icon}

      <input
        {...props}
        className={`h-10 bg-transparent text-text-primary outline-none placeholder:text-text-disabled ${className}`}
      />
    </div>
  );
}
