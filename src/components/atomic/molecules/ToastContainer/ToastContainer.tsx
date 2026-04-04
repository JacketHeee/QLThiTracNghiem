import { useToastStore } from "@/stores/useToast.store";
import { Toast } from "@/components/atomic/atoms/Toast/Toast";

export function ToastContainer() {
  const { toasts, hideToast } = useToastStore();

  return (
    <div className="fixed right-5 top-20 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => hideToast(t.id)}
        />
      ))}
    </div>
  );
}
