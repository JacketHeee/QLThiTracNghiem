import type { StatusResult } from "@/types";

//export all
export const getProgressColor = (percent: number) => {
  if (percent >= 80) return "bg-alert-success-content"; // Xanh lá (Giỏi/Xuất sắc)
  if (percent >= 65) return "bg-alert-info-content"; // Xanh dương (Khá)
  if (percent >= 50) return "bg-alert-warning-content"; // Vàng/Cam (Trung bình)
  if (percent > 0) return "bg-alert-error-content"; // Đỏ (Yếu/Kém)
  return "bg-text-disabled"; // Xám (Chưa làm bài/0%)
};

export const getTextProgressColor = (percent: number) => {
  if (percent >= 80) return "text-alert-success-content"; // Xanh lá (Giỏi/Xuất sắc)
  if (percent >= 65) return "text-alert-info-content"; // Xanh dương (Khá)
  if (percent >= 50) return "text-alert-warning-content"; // Vàng/Cam (Trung bình)
  if (percent > 0) return "text-alert-error-content"; // Đỏ (Yếu/Kém)
  return "text-text-disabled"; // Xám (Chưa làm bài/0%)
};

export const getTextProgress = (percent: number) => {
  if (percent >= 80) return "Tốt"; // Xanh lá (Giỏi/Xuất sắc)
  if (percent >= 65) return "Khá"; // Xanh dương (Khá)
  if (percent >= 50) return "Trung bình"; // Vàng/Cam (Trung bình)
  if (percent > 0) return "Yếu"; // Đỏ (Yếu/Kém)
  return "Chưa làm"; // Xám (Chưa làm bài/0%)
};

/**
 * Định dạng đầy đủ: HH:mm DD/MM/YYYY
 * Ví dụ: 17:05 08/03/2026
 */
export const formatFullDateTimeVN = (
  isoString: string | Date | null | undefined
): string => {
  if (!isoString) return "---";

  const date = new Date(isoString);

  // Kiểm tra nếu ngày tháng không hợp lệ
  if (isNaN(date.getTime())) return "---";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false, // Sử dụng định dạng 24h
  })
    .format(date)
    .replace(",", ""); // Loại bỏ dấu phẩy giữa giờ và ngày nếu có
};

/**
 * Chuyển đổi ISO Date String sang định dạng ngày giờ Việt Nam
 * @param isoString - Chuỗi ngày tháng chuẩn ISO (e.g. 2026-03-26T08:25:06.000Z)
 * @param includeTime - Có bao gồm giờ:phút không (mặc định là true)
 * @returns Chuỗi đã định dạng (e.g. 15:25, 26/03/2026)
 */
export const formatDateTimeVN = (isoString: string | Date): string => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();

  // Tính khoảng cách thời gian theo giây
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1. Nếu thời gian ở tương lai (do lệch giây hệ thống)
  if (diffInSeconds < 0) return "Vừa xong";

  // 2. Nếu trong vòng 1 phút (60 giây)
  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

  // 3. Nếu trong vòng 1 giờ (3600 giây)
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  }

  // 4. Nếu trong vòng 24 giờ (86400 giây)
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  }

  // 5. Nếu quá 24 giờ, trả về định dạng ngày tháng bình thường (vi-VN)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * So sánh khoảng thời gian với hiện tại
 * @param startTime Chuỗi ISO datetime bắt đầu
 * @param endTime Chuỗi ISO datetime kết thúc
 */
export const getTestsStatus = (
  startTime: string | null | undefined,
  endTime: string | null | undefined
): StatusResult => {
  const now = new Date();

  // Trường hợp dữ liệu lỗi hoặc thiếu
  if (!startTime || !endTime) {
    return { label: "N/A", status: "CLOSED" };
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return { label: "Chưa mở", status: "UPCOMING" };
  }

  if (now >= start && now <= end) {
    return { label: "Đang mở", status: "OPENING" };
  }

  return { label: "Đã đóng", status: "CLOSED" };
};

// utils/time.ts
export const checkTimeValid = (
  startTime: string,
  endTime: string,
  now: Date
): boolean => {
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime()))
    return false;

  return now >= startDateTime && now <= endDateTime;
};

/**
 * Tách chuỗi ISO Datetime thành Object { date, time }
 * @param isoString Chuỗi ISO Datetime (e.g., "2026-03-25T06:15:49.000000Z")
 * @returns { date: string, time: string }
 */
export const splitDateTime = (isoString: string | Date | null | undefined) => {
  const defaultResult = { date: "---", time: "---" };

  if (!isoString) return defaultResult;

  const d = new Date(isoString);

  // Kiểm tra nếu chuỗi date không hợp lệ (Invalid Date)
  if (isNaN(d.getTime())) return defaultResult;

  // Định dạng Ngày: DD/MM/YYYY
  const date = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);

  // Định dạng Giờ: HH:mm
  const time = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);

  return { date, time };
};

/* Lấy ký tự đầu tiên của từ cuối cùng và viết hoa
 * Ví dụ: "Nguyễn Văn An" -> "A", "Lập trình C" -> "C"
 */
export const getFirstCharOfLastName = (name: string): string => {
  if (!name) return "U"; // Default là User

  // Loại bỏ khoảng trắng thừa và tách chuỗi thành mảng các từ
  const words = name.trim().split(/\s+/);

  // Lấy từ cuối cùng
  const lastName = words[words.length - 1];

  // Lấy ký tự đầu tiên và chuyển thành chữ hoa
  return lastName.charAt(0).toUpperCase();
};

/**
 * Tạo URL avatar mặc định
 */
export const getDefaultAvatar = (name: string): string => {
  const displayChar = getFirstCharOfLastName(name);

  // Truyền ký tự đã xử lý vào param 'name' của API
  return `https://ui-avatars.com/api/?name=${displayChar}&background=random`;
};

export const getRandomBackground = (): string => {
  // Tạo số ngẫu nhiên để tránh trình duyệt lấy ảnh cũ từ bộ nhớ đệm (cache)
  const seed = Math.floor(Math.random() * 10000);
  const baseUrl = `https://picsum.photos/400/200`;

  return `${baseUrl}?blur=7&random=${seed}`;
};
