type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-main outline-none transition-all placeholder:text-disabled focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-disabled ${className || ""} `}
    />
  );
}
