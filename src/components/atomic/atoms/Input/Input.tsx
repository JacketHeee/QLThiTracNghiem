import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export default function Input({ icon, className = "", ...props }: InputProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border-4 border-background-body-background bg-background-body-background px-3 focus-within:border-action-selected">
      {icon}

      <input
        {...props}
        className={`h-10 outline-none placeholder:text-text-disabled ${className}`}
      />
    </div>
  );
}
