import { useNavigate } from "react-router-dom";
import Logo from "../../molecules/Logo/Logo";
import { Button } from "../../atoms";
import { useExamStore } from "@/stores/useExamStore";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { formatMinutesToTime } from "@/utils";
import type { BaiLam } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { useExamActions } from "@/hooks/useExamActions";
import { useLoadingStore } from "@/stores/useLoading.store";

export const ExamInstruction = () => {
  const { initExam, mode } = useExamStore();
  const navigate = useNavigate();
  const { startExam } = useExamActions();

  const { testData } = useDeThiStore();
  const { user } = useAuthStore();
  const { startLoading, stopLoading } = useLoadingStore();

  const handleStart = async () => {
    // TRƯỜNG HỢP 1: CHẾ ĐỘ PREVIEW (Dành cho Admin/Giáo viên xem thử)
    if (mode === "PREVIEW") {
      const previewExam: BaiLam = {
        id: -1, // ID giả
        deThiId: testData?.id || 0,
        thiSinhId: user?.id || 0,
        status: "DANG_LAM",
        chitiet_bailams: [], // Hoặc map từ testData.cau_hois nếu muốn có sẵn hàng
        thoiGianBatDau: new Date().toISOString(),
        tongDiem: 0,
        soCauDung: 0,
      };

      initExam(previewExam, "PREVIEW");
      navigate("doing");
      return;
    }

    startLoading();

    // TRƯỜNG HỢP 2: THI THẬT (STUDENT)
    try {
      // 1. Gọi API qua Hook (Hook này đã lo việc fetch Detail và startTest rồi)
      // Bạn KHÔNG nên tạo newExam thủ công ở đây vì API startTest sẽ trả về dữ liệu chuẩn

      await startExam({
        thiSinhId: user?.id || 0,
        deThiId: testData?.id || 0,
      });

      // 2. navigate sang trang làm bài
      // (Lưu ý: Logic lưu vào Store đã nằm trong onSuccess của useExamActions rồi)
      navigate("doing");
    } catch (error) {
      console.error("Lỗi khi bắt đầu thi:", error);
      // Có thể hiện thông báo lỗi bằng Toast ở đây
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {/* 1. Logo Header */}
      <header className="flex justify-center px-4">
        <div className="w-[668px] pb-6 pt-6">
          {" "}
          <Logo classname="text-text-secondary font-bold" />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-5 text-text-secondary">
        <div className="w-full max-w-[668px]">
          {/* 2. Title */}
          <h1 className="text-h5 pb-6">{testData?.tenDe}</h1>

          {/* 3. Instructions Box */}
          <div className="mb-6 rounded-md bg-background-body px-8 py-6">
            <h2 className="text-body-2 mb-4 font-bold">Hướng dẫn</h2>
            <ul className="text-body-2 space-y-2">
              <ItemSetting
                textLeft="Giới hạn thời gian làm bài"
                textRight={formatMinutesToTime(testData?.thoiGianLamBai || 0)}
              />
              <ItemSetting textLeft="Số lần làm bài:" textRight="1" />
              <ItemSetting
                textLeft="Số lượng câu hỏi:"
                textRight={testData?.cau_hois?.length.toString()}
              />
              {testData?.cau_hinh_thi?.shuffleQuestions && (
                <ItemSetting textLeft="Xáo trộn câu hỏi" />
              )}
              {testData?.cau_hinh_thi?.shuffleAnswers && (
                <ItemSetting textLeft="Xáo trộn đáp án" />
              )}
              {testData?.cau_hinh_thi?.hasMonitoring && (
                <ItemSetting textLeft="Giám sát quá trình thi: toàn màn hình, giới hạn chuột" />
              )}
              {testData?.cau_hinh_thi?.isLimitSwitchTab && (
                <ItemSetting
                  classname="text-primary-main"
                  textLeft={`Giới hạn chuyển tab: ${testData?.cau_hinh_thi.tabSwitchLimit} lần`}
                />
              )}
            </ul>
          </div>

          <p className="text-body-2">
            Chào mừng bạn đến với {testData?.tenDe}. Hãy đảm bảo đường truyền ổn
            định trước khi bắt đầu.
          </p>

          {/* 4. Start Button */}
          <div className="flex justify-end">
            <Button
              color={"primary"}
              variant={"contained"}
              onClick={handleStart}
            >
              Bắt đầu
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

function ItemSetting({
  textLeft,
  textRight,
  classname,
}: {
  textLeft?: string;
  textRight?: string;
  classname?: string;
}) {
  return (
    <li className={`flex items-center gap-2 ${classname}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-action-active"></span>
      {textLeft}
      <span className="ml-1 font-bold">{textRight}</span>
    </li>
  );
}
