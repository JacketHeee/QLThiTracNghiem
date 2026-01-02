import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";

/**
 * ErrorPage - Trang hiển thị lỗi cho React Router
 * Được sử dụng như errorElement trong route configuration
 */
export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;

  // Xác định loại lỗi và lấy thông tin
  let errorMessage = "Đã xảy ra lỗi không xác định";
  let errorStatus = "Error";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    // Lỗi từ React Router (404, 500, etc.)
    errorStatus = `${error.status}`;
    errorMessage = error.statusText || errorMessage;
    errorDetails = error.data?.message || "";
  } else if (error instanceof Error) {
    // Lỗi JavaScript thông thường
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  console.error("Route Error:", error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Lỗi trang</h1>
              {errorStatus && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                  {errorStatus}
                </span>
              )}
            </div>
            <p className="text-gray-600">Không thể tải trang này</p>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Thông báo lỗi:
          </h2>
          <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
            <p className="text-purple-800 font-mono text-sm break-all">
              {errorMessage}
            </p>
          </div>
        </div>

        {/* Error Details (Development only) */}
        {isDevelopment && errorDetails && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Chi tiết lỗi:
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-64 overflow-auto">
              <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                {errorDetails}
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            ← Quay lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          Nếu bạn nghĩ đây là lỗi hệ thống, vui lòng liên hệ với chúng tôi.
        </p>
      </div>
    </div>
  );
}
