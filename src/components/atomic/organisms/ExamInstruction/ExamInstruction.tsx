import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../molecules/Logo/Logo";
import { Button } from "../../atoms";
import { useExamStore } from "@/stores/useExamStore";

export const ExamInstruction = () => {
  const { startExam } = useExamStore();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams();

  const handleStart = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
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
          <h1 className="text-h5 pb-6">Kiểm tra kiến thức cơ bản HTML & CSS</h1>

          {/* 3. Instructions Box */}
          <div className="mb-6 rounded-md bg-background-body px-8 py-6">
            <h2 className="text-body-2 mb-4 font-bold">Hướng dẫn</h2>
            <ul className="text-body-2 space-y-2">
              <ItemSetting textLeft="Số lượng câu hỏi" textRight="3" />
              <ItemSetting
                textLeft="Giới hạn thời gian làm bài"
                textRight="00:10:00"
              />
              <ItemSetting textLeft="Số lần làm bài:" textRight="1" />
              <ItemSetting textLeft="Số lượng câu hỏi:" textRight="3" />
              <ItemSetting textLeft="Cho phép tạm dừng làm bài." textRight="" />
              <ItemSetting
                textLeft="Số lượng câu hỏi trên 1 trang: "
                textRight="3"
              />
              <ItemSetting
                textLeft="Cho phép quay lại và chỉnh sửa câu trả lời."
                textRight=""
              />
              <ItemSetting textLeft="Số lần chuyển tab tối đa:" textRight="3" />
              <ItemSetting
                textLeft="Tự động nộp bài khi hết giờ."
                textRight=""
              />
            </ul>
          </div>

          <p className="text-body-2">
            Chào mừng bạn đến với bài thi Lập trình Web. Hãy đảm bảo đường
            truyền ổn định trước khi bắt đầu.
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
}: {
  textLeft: string;
  textRight: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-action-active"></span>
      {textLeft}
      <span className="ml-1 font-bold">{textRight}</span>
    </li>
  );
}
