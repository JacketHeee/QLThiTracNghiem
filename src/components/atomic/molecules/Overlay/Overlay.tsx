import type { ReactNode } from "react";

interface OverlayProps {
  onClose: () => void;
  children: ReactNode;
}

export const Overlay = ({ onClose, children }: OverlayProps) => {
  return (
    <div
      onClick={(e) => {
        // Chỉ đóng khi click đích danh vào vùng overlay, không đóng khi click vào form bên trong
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-other-backdrop-overlay"
    >
      {children}
    </div>
  );
};
