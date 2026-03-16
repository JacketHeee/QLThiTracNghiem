import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Clock } from "lucide-react";
import "react-day-picker/dist/style.css";
import { Input } from "../../atoms";

interface DateTimePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  label?: string;
  placeHolder?: string;
  classNameParent?: string;
}

export const DateTimePicker = ({
  selected,
  onSelect,
  label,
  placeHolder,
  classNameParent,
}: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected) return;
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(selected);
    newDate.setHours(hours, minutes);
    onSelect(newDate);
  };

  return (
    <div
      className={`relative flex w-full flex-col gap-1 text-text-secondary ${classNameParent}`}
    >
      {label && <div className="text-input-text">{label}</div>}
      <Input
        readOnly
        value={selected ? format(selected, "PPP - HH:mm") : ""}
        onClick={() => setIsOpen(!isOpen)}
        placeholder={`${placeHolder}`}
        className="w-full cursor-pointer"
      />

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-fit rounded-lg border bg-white p-4 shadow-xl">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date && !selected) date.setHours(12, 0); // Default time
              onSelect(date);
            }}
          />

          <div className="mt-2 flex items-center gap-2 border-t pt-3">
            <Clock size={20} className="text-text-secondary" />
            <Input
              type="time"
              className="w-full"
              value={selected ? format(selected, "HH:mm") : "12:00"}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
