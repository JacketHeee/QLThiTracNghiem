<?php
namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    protected static array $httpMsg = [
        200 => 'Thành công',
        201 => 'Tạo mới thành công',
        204 => 'Không có nội dung',
        400 => 'Yêu cầu không hợp lệ',
        401 => 'Chưa xác thực',
        403 => 'Không có quyền truy cập',
        404 => 'Không tìm thấy',
        422 => 'Dữ liệu không hợp lệ',
        500 => 'Lỗi hệ thống',
    ];

    protected function success(mixed $data = null, ?string $message = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'code'    => $code,
            'message' => $message ?? self::$httpMsg[$code],
            'data'    => $data,
        ], $code);
    }

    protected function error(mixed $errors = null, ?string $message = null, int $code = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code'    => $code,
            'message' => $message ?? self::$httpMsg[$code],
            'errors'  => $errors,
        ], $code);
    }

    protected function created(mixed $data = null, ?string $message = null): JsonResponse {
        return $this->success($data, $message, 201);
    }

    protected function updated(mixed $data = null, ?string $message = null): JsonResponse {
        return $this->success($data, $message, 202);
    }

    protected function deleted(?string $message = null): JsonResponse {
        return $this->success(null, $message, 204);
    }

    protected function unauthorized(?string $message = null): JsonResponse {
        return $this->error(null, $message, 401);
    }

    protected function forbidden(?string $message = null): JsonResponse {
        return $this->error(null, $message, 403);
    }

    protected function notFound(?string $message = null): JsonResponse {
        return $this->error(null, $message, 404);
    }

    protected function validation(mixed $errors, ?string $message = null): JsonResponse {
        return $this->error($errors, $message, 422);
    }

    protected function serverError(?string $message = null): JsonResponse {
        return $this->error(null, $message, 500);
    }
}