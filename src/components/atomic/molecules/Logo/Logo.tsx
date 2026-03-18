import { Icon } from "../../atoms";

interface LogoProps {
  large?: boolean;
}
export default function Logo({ large = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon name="logoIcon" size={large ? 45 : 40} />
      <strong className={`text-text-primary ${large ? "text-h5" : "text-h6"}`}>
        MaHiChAn
      </strong>
    </div>
  );
}
