type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`text-main placeholder:text-disabled disabled:text-disabled focus:border-primary focus:ring-primary/10 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 outline-none transition-all focus:ring-4 disabled:cursor-not-allowed disabled:bg-neutral-50 ${className || ""} `}
    />
  );
}
