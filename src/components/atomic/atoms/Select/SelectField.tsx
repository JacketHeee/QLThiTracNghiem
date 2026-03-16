import { useRef, useState } from "react";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label?: string;
  placeholder: string;
  options: Option[];
  onSelect: (value: string | number) => void;
  classname?: string;
}

export default function SelectField({
  label,
  placeholder,
  options,
  onSelect,
  classname,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option) => {
    setSelected(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative flex w-fit flex-1 flex-col gap-1 rounded-md border border-other-outlined-border ${classname}`}
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {label && (
        <span className="text-input-label absolute left-1 top-[-6px] z-10 bg-background-body-background pl-2 text-text-secondary">
          {label}
        </span>
      )}

      <Button className="justify-between">
        <span
          className={`text-input-text truncate ${selected ? "text-text-primary" : "text-text-secondary"}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <Icon name="arrowDown" className="text-text-secondary" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="animate-in fade-in slide-in-from-top-1 text-input-text absolute top-10 z-50 max-h-60 w-full overflow-y-auto rounded border border-other-outlined-border bg-background-body-background text-text-primary shadow-lg">
          {options.length > 0 ? (
            options.map((opt, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(opt)}
                className="cursor-pointer px-4 py-2.5 transition-colors hover:bg-action-hover"
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 italic text-text-disabled">
              Không có dữ liệu
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
