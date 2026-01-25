type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return <input {...props} className="w-full rounded border px-3 py-2" />;
}
