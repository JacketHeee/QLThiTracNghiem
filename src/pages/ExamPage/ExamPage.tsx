import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Input, Button } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import type { DeThi } from "@/types";
import { useDeThiStudent } from "@/hooks/useDeThi";
import { checkTimeValid, splitDateTime } from "@/utils";
import { dethiService } from "@/services/api/dethi.service";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { useAuthStore } from "@/stores/auth.store";
import { useExamActions } from "@/hooks/useExamActions";

export const ExamPage = () => {
  const { user } = useAuthStore();
  const { dethis } = useDeThiStudent(user ? user.id : null); //ở đây
  const { baiLams } = useExamActions();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  // Cập nhật thời gian mỗi phút để cập nhật trạng thái nút "Bắt đầu"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // --- Logic kiểm tra thời gian hợp lệ ---

  // --- Cấu hình Columns cho DynamicTable ---
  const columns: TableColumn<DeThi>[] = [
    {
      title: "STT",
      key: "id",
      render: (_, item) => dethis.indexOf(item) + 1,
      className: "w-16 text-center",
    },
    {
      title: "Tên lớp",
      key: "mon_thi",
      render: (_, item) => item.mon_thi.tenMonHoc,
    },
    { title: "Tên bài kiểm tra", key: "tenDe" },
    {
      title: "Ngày thi",
      key: "thoiGianBatDau",
      render: (_, item) => splitDateTime(item.thoiGianBatDau).date,
    },
    {
      title: "Giờ bắt đầu",
      key: "thoiGianBatDau",
      render: (_, item) => splitDateTime(item.thoiGianBatDau).time,
    },
  ];

  const handleStartExam = async (deThiId: number) => {
    try {
      // 1. Gọi trực tiếp Service hoặc dùng queryClient để lấy data đề thi
      // Chúng ta lấy chi tiết đề để đổ vào Store
      const res = await dethiService.getById(deThiId);

      if (res.data) {
        // 2. Cập nhật vào DeThiStore để trang Introduction có data hiển thị
        useDeThiStore.getState().updateTestData(res.data);

        // 3. Sau khi Store đã có data, mới chuyển trang
        navigate(`/tests/${deThiId}/take`);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin đề thi:", error);
      // Toast: "Không thể tải thông tin đề thi. Vui lòng thử lại."
    }
  };

  const deThiDisplay = (dethis || []).filter((dt) => {
    const baiLam = baiLams?.find((i) => i.deThiId === dt.id);

    return !baiLam;
  });

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
          data={deThiDisplay}
          rowKey="id"
          hasColumnActions={true}
          renderActions={(item) => {
            const isValid = checkTimeValid(
              item.thoiGianBatDau,
              item.thoiGianKetThuc,
              now
            );

            return (
              <Button
                variant={isValid ? "contained" : "outline"}
                color="primary"
                size="small"
                disabled={!isValid}
                onClick={() => {
                  handleStartExam(item.id);
                }}
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
