import { RadioButton } from "@/components/atomic/atoms/RadioButton/RadioButton";

interface Option {
  label: string;
  value: string;
}

export const RadioGroup = ({
  options,
  name,
  onChange,
}: {
  options: Option[];
  name: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <RadioButton
          key={opt.value}
          label={opt.label}
          name={name}
          value={opt.value}
          onChange={() => onChange(opt.value)}
          id={`${name}-${opt.value}`}
        />
      ))}
    </div>
  );
};
