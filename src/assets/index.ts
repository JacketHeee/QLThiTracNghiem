import type { ComponentType, SVGProps } from "react";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const svgFiles = import.meta.glob("./icons/*.svg", {
  eager: true,
  query: "?react",
  import: "default",
});

export const Icons: Record<string, SvgComponent> = {};

// Chuyển đổi đường dẫn file thành tên key (ví dụ: ./icons/academic-cap.svg -> academicCap)
Object.entries(svgFiles).forEach(([path, component]) => {
  const name = path
    .split("/")
    .pop()
    ?.replace(".svg", "")
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()); // kebab-case → camelCase

  if (name) {
    Icons[name] = component as SvgComponent;
  }
});

export type IconName = keyof typeof Icons;
