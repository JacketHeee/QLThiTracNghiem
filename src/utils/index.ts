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
