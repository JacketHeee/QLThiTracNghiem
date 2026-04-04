import { useLoadingStore } from "@/stores/useLoading.store";
import { Loader2 } from "lucide-react";
import { Overlay } from "../Overlay/Overlay";

export function LoadingGlobal() {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <Overlay onClose={() => {}}>
      {/* onClose để trống vì không cho phép đóng khi đang loading quan trọng */}
      <div className="flex flex-col items-center gap-4 duration-200 animate-in fade-in">
        <div className="relative flex items-center justify-center">
          {/* Spinner chính */}
          <Loader2 className="animate-spin text-primary-contrast" size={48} />
          {/* Logo JF của Mạnh ở giữa nếu muốn (tùy chọn) */}
        </div>

        {message && (
          <p className="text-body-1-semibold tracking-wide text-common-white drop-shadow-md">
            {message}
          </p>
        )}
      </div>
    </Overlay>
  );
}
