import axiosClient from "./axios";
import type {
  ApiResponse,
  BaiLam,
  ExamResponseData,
  ExamReviewResponse,
} from "@/types";

export const examService = {
  /**
   * 1. Nhấn bắt đầu thi
   */
  startTest: (payload: {
    thiSinhId: number;
    deThiId: number;
  }): Promise<ApiResponse<BaiLam>> => {
    return axiosClient.post("/bailams/starttest", payload);
  },

  /**
   * 2. Cập nhật đáp án (Sử dụng khi sinh viên chọn đáp án từng câu)
   */
  updateStudentTest: (
    baiLamId: number,
    answers: { cauHoiId: number; dapAnId: number }[]
  ): Promise<ApiResponse<null>> => {
    return axiosClient.put(`/bailams/updatestudenttest/${baiLamId}`, {
      answers,
    });
  },

  /**
   * 3. Nộp bài thi
   */
  submitTest: (
    baiLamId: number,
    answers: { cauHoiId: number; dapAnId: number }[]
  ): Promise<ApiResponse<ExamResponseData>> => {
    return axiosClient.put(`/bailams/submittest/${baiLamId}`, {
      answers,
    });
  },

  /**
   * 4. Ghi nhận vi phạm (chuyển tab, thoát fullscreen)
   * API: PUT /logbailams/:id
   */
  updateViolationLog: (
    logId: number,
    payload: { soLanChuyenTab: number }
  ): Promise<ApiResponse<number>> => {
    return axiosClient.put(`/logbailams/${logId}`, payload);
  },

  /**
   * 5. Xem lại kết quả bài thi (Review)
   * Endpoint: {{baseUrl}}/bailams/reviewresult/:baiLamId
   */
  getReviewResult: (
    baiLamId: number
  ): Promise<ApiResponse<ExamResponseData>> => {
    return axiosClient.get(`/bailams/reviewresult/${baiLamId}`);
  },

  getAll: (): Promise<ApiResponse<BaiLam[]>> => axiosClient.get("/bailams"),

  getByHocPhanAndDeThi: (
    nhomHocPhanId: number,
    deThiId: number
  ): Promise<ApiResponse<ExamReviewResponse>> => {
    return axiosClient.get(
      `/bailams/get_o_hphan_dethi/${nhomHocPhanId}/${deThiId}`
    );
  },
};
