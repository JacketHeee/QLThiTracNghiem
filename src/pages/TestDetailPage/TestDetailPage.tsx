import { useEffect } from "react";
import { Button, Icon } from "@/components/atomic/atoms";
import { ClassResultItem } from "@/components/atomic/molecules/ClassResultItem/ClassResultItem";
import {
  Dropdown,
  DropdownItem,
} from "@/components/atomic/molecules/Dropdown/Dropdown";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useDeThiDetail, useDeleteDeThi } from "@/hooks/useDeThi";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { useExamStore } from "@/stores/useExamStore";
import { formatFullDateTimeVN } from "@/utils";
import { Info, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function TestDetailPage() {
  const navigate = useNavigate();
  const updateTestData = useDeThiStore((state) => state.updateTestData);
  const testData = useDeThiStore((state) => state.testData);
  const { mutate: deleteDeThi } = useDeleteDeThi();

  // 1. Lấy ID đúng cách từ params
  const params = useParams();
  const idDethi = Number(params.id);

  const { deThi, isLoading } = useDeThiDetail(idDethi);

  useEffect(() => {
    if (deThi) {
      updateTestData({ ...deThi });
    }
  }, [deThi, updateTestData]);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  const displayData = deThi || testData;

  const handlePreview = () => {
    // Reset store trước khi vào bài mới để tránh dính dữ liệu cũ
    useExamStore.getState().resetExam();
    useExamStore.getState().mode = "PREVIEW";

    // Chuyển hướng kèm theo query param mode=preview
    navigate(`take?mode=preview`);
  };

  const handleEditTest = () => {
    navigate(`edit`);
  };

  const handleViewTest = () => {
    navigate("view");
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa đề thi này không? Hành động này không thể hoàn tác."
      )
    ) {
      deleteDeThi(displayData?.id as number, {
        onSuccess: () => {
          // Bạn có thể xử lý thêm ở đây, ví dụ điều hướng nếu đang ở trang chi tiết
          navigate("/tests");
        },
      });
    }
  };

  return (
    <MainContentLayout>
      {/* Overview */}
      <div className="flex flex-col rounded-md bg-background-body-background p-8 pb-0">
        <div className="text-h6 flex gap-2 text-alert-info-content">
          <Icon name="testsOverview" size={32} />
          <span>Tổng quan</span>
        </div>
        <div className="flex justify-between gap-2">
          <div className="flex flex-col gap-3 pb-8 pt-5">
            <div className="flex flex-col gap-2">
              <div className="text-h4 text-text-primary">
                {displayData?.tenDe}
              </div>
              {/* infor */}
              <div className="flex flex-col gap-2 text-text-secondary">
                <div className="flex items-center gap-1">
                  <Icon name="documentDuplicate" size={20} />
                  <span className="text-body-1">Giao cho học phần</span>
                  <span className="text-body-1-semibold text">
                    {displayData?.mon_thi?.tenMonHoc}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="clock" size={20} />
                  <span className="text-body-1">
                    Diễn ra từ{" "}
                    {formatFullDateTimeVN(displayData?.thoiGianBatDau)} đến{" "}
                    {formatFullDateTimeVN(displayData?.thoiGianKetThuc)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={"outline"} onClick={handlePreview}>
                <Icon name="play" /> Xem demo
              </Button>

              <Dropdown
                trigger={
                  <Button>
                    <Icon name="detail" /> Hành động
                  </Button>
                }
              >
                {/* Header nhỏ sử dụng Typography text-table-header và màu disabled */}
                <div className="text-table-header px-4 py-2 uppercase text-text-disabled">
                  Tùy chọn đề thi
                </div>

                <DropdownItem
                  icon={<Info size={16} />}
                  onClick={handleViewTest}
                >
                  Xem chi tiết
                </DropdownItem>

                {/* <DropdownItem icon={<Copy size={16} />} onClick={() => {}}>
                  Nhân bản
                </DropdownItem> */}

                <div className="my-1 border-t border-other-divider" />

                <DropdownItem
                  variant="error"
                  icon={<Trash size={16} />}
                  onClick={handleDelete}
                >
                  Xóa đề thi
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
          <div className="relative h-[216px] w-[295px]">
            <Icon
              name="editTest"
              size={295}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            <Button
              onClick={handleEditTest}
              variant={"outline"}
              size={"large"}
              className="absolute left-1/2 top-1/2 w-auto -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-background-body-background shadow-lg"
            >
              <Icon name="edit" />
              Chỉnh sửa bài thi
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-md bg-background-body-background">
        <div className="text-h6 px-8 py-6 text-text-secondary">Đã giao cho</div>
        {displayData?.nhom_hoc_phans?.map((item) => (
          <ClassResultItem
            key={item.id}
            data={item}
            testId={displayData?.id || 0}
          />
        ))}
      </div>
    </MainContentLayout>
  );
}
