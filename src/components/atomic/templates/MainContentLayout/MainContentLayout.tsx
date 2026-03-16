import type { ReactNode } from "react";

interface MainContentLayoutProps {
  children: ReactNode[];
}

export default function MainContentLayout({
  children,
}: MainContentLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-2 overflow-auto px-4 pt-5 md:px-0">
      {children}

      {/* Footer */}
      <div className="text-body-1 flex flex-col justify-between gap-3 rounded-md bg-background-body-background px-6 py-4 text-text-secondary sm:flex-row">
        <span>
          <span className="text-primary-main">SGU Test</span> © 2026
        </span>
        <span>
          Made with ❤️ by <span className="text-primary-main">MaChHiAn</span>
        </span>
      </div>
    </div>
  );
}
