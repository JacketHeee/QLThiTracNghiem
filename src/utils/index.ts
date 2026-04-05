import type { CreateDeThiPayload, DeThi, StatusResult } from "@/types";

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

export const getVariantDeThiWithStatus = (status: string) => {
  switch (status) {
    case "UPCOMING":
      return "success";
    case "OPENING":
      return "warning";
    case "CLOSED":
      return "error";
  }
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

/**
 * Chuyển đổi số phút thành định dạng HH:mm:ss
 * @param minutes Số phút cần chuyển đổi (ví dụ: 70)
 * @returns Chuỗi định dạng "HH:mm:ss" (ví dụ: "01:10:00")
 */
export const formatMinutesToTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes < 0) return "00:00:00";

  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = 0; // Vì đầu vào chỉ có phút nên giây mặc định là 0

  const hh = String(hours).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

/**
 * Chuyển đổi ISOString thành định dạng HH:mm
 * @param isoString Chuỗi ISO (e.g., "2026-04-01T09:00:00Z")
 * @returns Chuỗi "HH:mm" (e.g., "09:00")
 */
export const formatIsoToTime = (
  isoString: string | undefined | null
): string => {
  if (!isoString) return "--:--";

  const date = new Date(isoString);

  // Kiểm tra xem chuỗi có phải là ngày hợp lệ không
  if (isNaN(date.getTime())) return "--:--";

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
 * Tính toán khoảng cách giữa hai mốc thời gian và trả về chuỗi định dạng linh hoạt
 * @param start - Thời gian bắt đầu (ISO String hoặc Timestamp)
 * @param end - Thời gian kết thúc (ISO String hoặc Timestamp)
 * @example
 * - 0 phút 45 giây -> "45 giây"
 * - 5 phút 0 giây -> "5 phút"
 * - 5 phút 10 giây -> "5 phút 10 giây"
 */
export const calculateDuration = (
  start: string | number | Date | undefined | null,
  end: string | number | Date | undefined | null
): string => {
  if (!start || !end) return "N/A";

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const durationMs = endTime - startTime;

  if (durationMs <= 0) return "0 giây";

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  // Chỉ thêm phút nếu > 0
  if (minutes > 0) {
    parts.push(`${minutes} phút`);
  }

  // Chỉ thêm giây nếu > 0 HOẶC khi cả phút và giây đều bằng 0 (đã xử lý ở trên)
  if (seconds > 0) {
    parts.push(`${seconds} giây`);
  }

  // Trường hợp đặc biệt: Nếu phút > 0 nhưng giây = 0, parts sẽ chỉ có ["X phút"]
  // Kết quả trả về sẽ là "X phút" (đẹp hơn "X phút 00 giây")
  return parts.join(" ");
};

/**
 * Mapper: Chuyển BaiThi -> CreateDeThiPayload
 * Giữ nguyên định dạng ISO String cho thời gian.
 */
export const mapDeThiToCreatePayload = (
  baiThi: DeThi
): CreateDeThiPayload | null => {
  const source = baiThi;

  if (!source) return null;

  const totalQuestions = source.cau_hois.length;

  // Tính điểm mỗi câu (Làm tròn 2 chữ số thập phân)
  const scorePerQuestion = Math.round((10 / totalQuestions) * 100) / 100;

  // Tính điểm cho câu cuối cùng để tổng luôn là 10.0
  const lastQuestionScore =
    Math.round((10 - scorePerQuestion * (totalQuestions - 1)) * 100) / 100;

  return {
    monThiId: source.mon_thi.id || 1,
    nguoiTaoId: source.nguoiTaoId || 3,
    tenDe: source.tenDe || "Tên mặc định",
    // Giữ nguyên ISO String
    thoiGianBatDau: source.thoiGianBatDau,
    thoiGianKetThuc: source.thoiGianKetThuc,
    thoiGianLamBai: source.thoiGianLamBai,

    nhomHocPhanIds: source.nhom_hoc_phans?.map((nhom) => nhom.id) || [],

    cauHois: source.cau_hois.map((q, index) => ({
      id: q.id,
      thuTu: index + 1,
      diem: index === totalQuestions - 1 ? lastQuestionScore : scorePerQuestion,
    })),

    cauHinh: {
      hasMonitoring: source.cau_hinh_thi?.hasMonitoring ?? false,
      allowCopy: source.cau_hinh_thi?.allowCopy ?? false,
      allowPrint: source.cau_hinh_thi?.allowPrint ?? false,
      isEnableResume: source.cau_hinh_thi?.isEnableResume ?? false,
      shuffleQuestions: source.cau_hinh_thi?.shuffleQuestions ?? true,
      shuffleAnswers: source.cau_hinh_thi?.shuffleAnswers ?? true,
      showScore: source.cau_hinh_thi?.showScore ?? true,
      showDetailResults: source.cau_hinh_thi?.showDetailResults ?? true,
      isLimitSwitchTab: source.cau_hinh_thi?.isLimitSwitchTab ?? false,
      tabSwitchLimit: source.cau_hinh_thi?.tabSwitchLimit ?? 0,
      messageOnWarning:
        source.cau_hinh_thi?.messageOnWarning ?? "Bạn đã vi phạm quy chế thi!",
    },
  };
};
