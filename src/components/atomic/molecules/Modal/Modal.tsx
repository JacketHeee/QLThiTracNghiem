import { AlertTriangle, X, Info, AlertCircle } from "lucide-react";
import Button from "@/components/atomic/atoms/Button/Button";
import { cn } from "@/utils/cn";
import { Overlay } from "../Overlay/Overlay";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  type = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const typeConfigs = {
    danger: {
      icon: <AlertCircle className="text-error-main" size={32} />,
      buttonColor: "error" as const,
      bgIcon: "bg-error-background",
    },
    warning: {
      icon: <AlertTriangle className="text-warning-main" size={32} />,
      buttonColor: "warning" as const,
      bgIcon: "bg-warning-background",
    },
    success: {
      icon: <Info className="text-success-main" size={32} />,
      buttonColor: "success" as const,
      bgIcon: "bg-success-background",
    },
    info: {
      icon: <Info className="text-info-main" size={32} />,
      buttonColor: "infor" as const,
      bgIcon: "bg-info-background",
    },
  };

  const config = typeConfigs[type];

  return (
    <Overlay onClose={onClose}>
      <div
        className={cn(
          "relative w-full max-w-[500px] transform overflow-hidden rounded-2xl",
          "bg-background-paper px-4 py-5 shadow-2xl transition-all",
          "duration-200 animate-in zoom-in-95"
        )}
      >
        {/* Nút X đóng nhanh */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-text-disabled transition-colors hover:text-text-primary"
        >
          <X size={22} />
        </button>

        {/* Layout Căn Trái chuyên nghiệp */}
        <div className="flex items-start gap-6 text-left">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-full",
              config.bgIcon
            )}
          >
            {config.icon}
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <h3 className="text-[1.5rem] font-bold leading-8 text-text-primary">
              {title}
            </h3>
            <p className="text-[1rem] leading-7 text-text-secondary">
              {message}
            </p>
          </div>
        </div>

        {/* Cụm nút bấm */}
        <div className="mt-10 flex w-full justify-end gap-3">
          <Button
            variant="outline"
            color="standard"
            size="large"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant="contained"
            color={config.buttonColor}
            size="large"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Overlay>
  );
}
