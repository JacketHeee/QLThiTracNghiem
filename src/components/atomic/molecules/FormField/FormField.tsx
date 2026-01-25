import { Input } from "@/components/atomic/atoms";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
};

export default function FormField({
  label,
  name,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <Input name={name} type={type} />
    </div>
  );
}
