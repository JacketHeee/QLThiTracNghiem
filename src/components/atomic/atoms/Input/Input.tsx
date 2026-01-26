type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded border px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-indigo-400 ${className || ""}`}
    />
  );
}
