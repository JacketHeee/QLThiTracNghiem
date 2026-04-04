import { AlertTriangle, X, Info, AlertCircle } from "lucide-react";
import Button from "@/components/atomic/atoms/Button/Button"; // Đường dẫn đến file Button của Mạnh
import { useEffect } from "react";
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

/*

<ConfirmationModal
isOpen={true}
isLoading={false}
type="danger"
title="Xác nhận xóa"
message="Dữ liệu đề thi và kết quả của sinh viên sẽ bị mất vĩnh viễn. Mạnh có chắc chắn không?"
confirmLabel="Tôi hiểu, cứ xóa đi"
cancelLabel="Để tôi xem lại"
onClose={() => {}}
onConfirm={() => {}}
/>

*/

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
  // Logic chặn scroll khi modal hiển thị
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Mapping cấu hình dựa trên bảng màu colors của Mạnh
  const typeConfigs = {
    danger: {
      icon: <AlertCircle className="text-error-main" size={28} />,
      buttonColor: "error" as const,
      bgIcon: "bg-error-background",
    },
    warning: {
      icon: <AlertTriangle className="text-warning-main" size={28} />,
      buttonColor: "warning" as const,
      bgIcon: "bg-warning-background",
    },
    success: {
      icon: <Info className="text-success-main" size={28} />,
      buttonColor: "success" as const,
      bgIcon: "bg-success-background",
    },
    info: {
      icon: <Info className="text-info-main" size={28} />,
      buttonColor: "infor" as const, // Khớp với key "infor" trong Button Atom của Mạnh
      bgIcon: "bg-info-background",
    },
  };

  const config = typeConfigs[type];

  return (
    <Overlay onClose={onClose}>
      {/* Container Modal - Sử dụng bg-background-paper */}
      <div
        className={cn(
          "relative w-full max-w-[440px] transform overflow-hidden rounded-xl",
          "bg-background-paper p-6 shadow-2xl transition-all",
          "duration-200 animate-in zoom-in-95"
        )}
      >
        {/* Nút đóng X - Sử dụng text-text-disabled */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-disabled transition-colors hover:text-text-primary"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-5 text-center">
          {/* Vòng tròn Icon - Sử dụng màu nền đặc trưng từ bảng colors */}
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              config.bgIcon
            )}
          >
            {config.icon}
          </div>

          {/* Phần nội dung văn bản */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[1.25rem] font-bold leading-7 text-text-primary">
              {title}
            </h3>
            <p className="text-[0.875rem] leading-6 text-text-secondary">
              {message}
            </p>
          </div>

          {/* Cụm nút hành động - Sử dụng Button Atom của Mạnh */}
          <div className="mt-4 flex w-full justify-end gap-3">
            <Button
              variant="outline"
              color="standard" // Sẽ dùng border-other-outlined-border theo code Button của Mạnh
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>

            <Button
              variant="contained"
              color={config.buttonColor}
              onClick={onConfirm}
              tooltip="Bấm để xác nhận"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
