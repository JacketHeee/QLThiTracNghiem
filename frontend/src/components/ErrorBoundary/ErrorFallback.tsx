import type { ErrorInfo } from "react";

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError?: () => void;
}

/**
 * ErrorFallback - UI hiển thị khi có lỗi trong ErrorBoundary
 */
export default function ErrorFallback({
  error,
  errorInfo,
  resetError,
}: ErrorFallbackProps) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Oops! Có lỗi xảy ra
            </h1>
            <p className="text-gray-600">
              Đã xảy ra lỗi không mong muốn trong ứng dụng
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Thông báo lỗi:
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 font-mono text-sm break-all">
                {error.message || "Unknown error"}
              </p>
            </div>
          </div>
        )}

        {/* Error Stack (Development only) */}
        {isDevelopment && error?.stack && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Stack trace:
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-64 overflow-auto">
              <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                {error.stack}
              </pre>
            </div>
          </div>
        )}

        {/* Component Stack (Development only) */}
        {isDevelopment && errorInfo?.componentStack && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Component stack:
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-64 overflow-auto">
              <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {resetError && (
            <button
              onClick={resetError}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ với bộ phận hỗ trợ.
        </p>
      </div>
    </div>
  );
}
