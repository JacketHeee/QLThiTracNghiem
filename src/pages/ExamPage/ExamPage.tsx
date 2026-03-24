import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Input, Button } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useExamStore } from "@/stores/useExamStore";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";

// --- Interface cho dữ liệu bài kiểm tra ---
interface ExamSchedule {
  id: string;
  className: string;
  examName: string;
  examDate: string; // Định dạng: YYYY-MM-DD
  startTime: string; // Định dạng: HH:mm
  endTime: string; // Định dạng: HH:mm (để giới hạn thời gian kết thúc bài thi)
  isDone: boolean; // Đã làm hay chưa
}

// --- Mock Data ---
const MOCK_EXAMS: ExamSchedule[] = [
  {
    id: "1",
    className: "Lập trình React nâng cao",
    examName: "Kiểm tra giữa kỳ - Component Pattern",
    examDate: "2026-03-24",
    startTime: "08:10", // Thử nghiệm với thời gian thực của bạn
    endTime: "18:00",
    isDone: false,
  },
  {
    id: "2",
    className: "Cơ sở dữ liệu",
    examName: "Cuối kỳ - Thiết kế DB",
    examDate: "2026-03-25",
    startTime: "08:00",
    endTime: "10:00",
    isDone: false,
  },
];

export const ExamPage = () => {
  const navigate = useNavigate();
  const { startExam } = useExamStore();
  const [now, setNow] = useState(new Date());

  // Cập nhật thời gian mỗi phút để cập nhật trạng thái nút "Bắt đầu"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // --- Logic kiểm tra thời gian hợp lệ ---
  const checkTimeValid = (date: string, start: string, end: string) => {
    const startDateTime = new Date(`${date}T${start}`);
    const endDateTime = new Date(`${date}T${end}`);
    return now >= startDateTime && now <= endDateTime;
  };

  // --- Cấu hình Columns cho DynamicTable ---
  const columns: TableColumn<ExamSchedule>[] = [
    {
      title: "STT",
      key: "id",
      render: (_, item) => MOCK_EXAMS.indexOf(item) + 1,
      className: "w-16 text-center",
    },
    { title: "Tên lớp", key: "className" },
    { title: "Tên bài kiểm tra", key: "examName" },
    { title: "Ngày thi", key: "examDate" },
    { title: "Giờ bắt đầu", key: "startTime" },
  ];

  const handleStart = (item: ExamSchedule) => {
    startExam(); // Kích hoạt thời gian bắt đầu trong Store
    navigate(`/tests/${item.id}/take`);
  };

  const handleViewResult = (item: ExamSchedule) => {
    navigate(`/tests/${item.id}/take/result/latest`);
  };

  return (
    <MainContentLayout classname="w-full">
      {/* 1. Toolbar Section */}
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}
        <div className="flex gap-2">
          <Input
            hasBoder={true}
            placeholder="Tìm kiếm MSSV ..."
            icon={<Icon name="search" className="text-text-disabled" />}
          />
        </div>
      </div>

      {/* 2. Table Section */}
      <div className="mt-6 flex flex-col gap-2 rounded-md bg-background-body-background p-2 shadow-sm">
        <DynamicTable
          columns={columns}
          data={MOCK_EXAMS}
          rowKey="id"
          hasColumnActions={true}
          renderActions={(item) => {
            const isValid = checkTimeValid(
              item.examDate,
              item.startTime,
              item.endTime
            );

            if (item.isDone) {
              return (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleViewResult(item)}
                >
                  Kết quả
                </Button>
              );
            }

            return (
              <Button
                variant={isValid ? "contained" : "outline"}
                color="primary"
                size="small"
                disabled={!isValid}
                onClick={() => handleStart(item)}
                className={isValid ? "animate-pulse-subtle" : ""}
              >
                {isValid ? "Bắt đầu ngay" : "Chưa đến giờ"}
              </Button>
            );
          }}
        />
      </div>
    </MainContentLayout>
  );
};
