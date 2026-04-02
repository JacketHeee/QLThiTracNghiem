import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../molecules/Logo/Logo";
import { Button } from "../../atoms";
import { useExamStore } from "@/stores/useExamStore";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { formatMinutesToTime } from "@/utils";
import type { BaiThi } from "@/types";

export const ExamInstruction = () => {
  const { startExam, initExam, mode } = useExamStore();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams();

  const { testData } = useDeThiStore();

  const handleStart = () => {
    const newExam: BaiThi = {
      id: Math.floor(Math.random() * 100000), // Hoặc ID từ API nếu có
      deThiId: testData?.id || 0,
      thiSinhId: 1, // ID user hiện tại
      status: "DANG_LAM",
      chitiet_bailams: [], // Khởi tạo mảng rỗng
      tongDiem: 0,
      soCauDung: 0,
    };

    initExam(newExam, mode);

    startExam();
    navigate("doing");
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
