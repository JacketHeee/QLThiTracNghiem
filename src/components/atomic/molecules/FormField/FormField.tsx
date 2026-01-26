import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/atomic/atoms";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const currentType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        className="text-mahichan-secondary mb-0.5 text-[13px] font-normal"
        htmlFor={name}
      >
        {label}
      </label>

      <div className="relative">
        <Input
          name={name}
          type={currentType}
          placeholder={placeholder}
          className={`pr-10 ${isPasswordType ? "font-normal" : ""}`}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
