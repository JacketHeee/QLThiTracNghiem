type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: string;
  hasHover?: boolean;
};

export default function Button({
  children,
  className = "",
  hasHover = true,
  tooltip,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`group relative flex items-center gap-2 rounded-md p-2 text-text-primary ${hasHover && "hover:bg-action-hover"} ${className}`}
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
