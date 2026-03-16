import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group relative flex items-center gap-2 rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        contained: "",
        outline: "border bg-transparent hover:bg-action-hover",
        text: "bg-transparent hover:bg-action-hover",
      },
      size: {
        small: "px-1 py-0.5 text-button-small",
        medium: "px-2 py-1 text-button-medium",
        large: "px-4 py-2 text-button-large",
      },
      color: {
        primary: "", // Sẽ xử lý ở compoundVariants
        standard: "",
        success: "",
        warning: "",
        error: "",
        infor: "",
      },
    },
    compoundVariants: [
      // 1. Contained States
      {
        variant: "contained",
        color: "primary",
        className:
          "text-primary-contrast bg-primary-main hover:bg-primary-main",
      },
      {
        variant: "contained",
        color: "success",
        className:
          "text-primary-contrast bg-alert-success-content hover:bg-alert-success-content",
      },
      {
        variant: "contained",
        color: "warning",
        className:
          "text-primary-contrast bg-alert-warning-content hover:bg-alert-warning-content",
      },
      {
        variant: "contained",
        color: "error",
        className:
          "text-primary-contrast bg-alert-error-content hover:bg-alert-error-content",
      },
      {
        variant: "contained",
        color: "infor",
        className:
          "text-primary-contrast bg-alert-info-content hover:bg-alert-info-content",
      },
      {
        variant: "contained",
        color: "standard",
        className:
          "text-primary-contrast bg-secondary-main hover:bg-secondary-main",
      },

      // 2. Outline States
      {
        variant: "outline",
        color: "primary",
        className:
          "border-primary-main text-primary-main hover:bg-action-hover",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "border-alert-success-content text-alert-success-content hover:bg-action-hover",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "border-alert-warning-content text-alert-warning-content hover:bg-action-hover",
      },
      {
        variant: "outline",
        color: "error",
        className:
          "border-alert-error-content text-alert-error-content hover:bg-action-hover",
      },
      {
        variant: "outline",
        color: "infor",
        className:
          "border-alert-infor-content text-alert-infor-content hover:bg-action-hover",
      },
      {
        variant: "outline",
        color: "standard",
        className:
          "border-other-outlined-border text-text-secondary hover:bg-action-hover",
      },

      // 3. Text States
      {
        variant: "text",
        color: "primary",
        className: "text-primary-main hover:bg-action-hover",
      },
      {
        variant: "text",
        color: "success",
        className: "text-alert-success-content hover:bg-action-hover",
      },
      {
        variant: "text",
        color: "warning",
        className: "text-alert-warning-content hover:bg-action-hover",
      },
      {
        variant: "text",
        color: "error",
        className: "text-alert-error-content hover:bg-action-hover",
      },
      {
        variant: "text",
        color: "infor",
        className: "text-alert-infor-content hover:bg-action-hover",
      },
      {
        variant: "text",
        color: "standard",
        className: "text-text-primary hover:bg-action-hover",
      },
    ],
    defaultVariants: {
      variant: "text",
      size: "large",
      color: "standard",
    },
  }
);

interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  tooltip?: string;
}

export default function Button({
  className,
  variant,
  size,
  color,
  tooltip,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // Khi truyền color vào buttonVariants, giờ đây nó sẽ khớp với kiểu dữ liệu của CVA
      className={cn(buttonVariants({ variant, size, color }), className)}
      {...props}
    >
      {children}
      {tooltip && (
        <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded bg-other-tooltip px-3 py-1.5 text-xs text-common-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          {tooltip}
        </span>
      )}
    </button>
  );
}
