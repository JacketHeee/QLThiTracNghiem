import { useState } from "react";
import { Button, Icon } from "../../atoms";
import { useNavigate } from "react-router-dom";
import type { DeThi } from "@/types";
import {
  formatFullDateTimeVN,
  getTestsStatus,
  getVariantDeThiWithStatus,
} from "@/utils";
import { ClassResultItem } from "../../molecules/ClassResultItem/ClassResultItem";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { StatusLabel } from "../../atoms/StatusLabel/StatusLabel";
import { useDeleteDeThi } from "@/hooks/useDeThi";

interface TestItemProps {
  data: DeThi;
  onEdit?: (item: DeThi) => void;
  onDelete?: (item: DeThi) => void;
  actions: string[];
}

export default function TestItem({ data, actions }: TestItemProps) {
  const [isCollapse, setIsCollapse] = useState(true);
  const navigate = useNavigate();

  const updateTestData = useDeThiStore((state) => state.updateTestData);
  const { mutate: deleteDeThi } = useDeleteDeThi();

  const handleJoinTest = () => {
    // 1. Lưu ID vào Zustand Persist (Nó sẽ tự động vào LocalStorage)
    updateTestData({ ...data });

    // 2. Chuyển hướng sang trang chi tiết bài thi
    navigate(`${data.id}/view`);
  };

  const handleEditTest = () => {
    updateTestData({ ...data });
    navigate(`${data.id}/edit`);
  };

  const status = getTestsStatus(data.thoiGianBatDau, data.thoiGianKetThuc);

  const handleDelete = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa đề thi này không? Hành động này không thể hoàn tác."
      )
    ) {
      deleteDeThi(data.id, {
        onSuccess: () => {
          // Bạn có thể xử lý thêm ở đây, ví dụ điều hướng nếu đang ở trang chi tiết
          navigate("/tests");
        },
      });
    }
  };

  return (
    <div className="flex flex-col rounded-md bg-background-body-background">
      {/* header */}
      <div className="flex items-center justify-between border-b border-other-outlined-border px-10 py-2">
        <StatusLabel variant={getVariantDeThiWithStatus(status.status)}>
          {status.label}{" "}
        </StatusLabel>

        <div className="flex gap-2">
          <Button color={"primary"} onClick={handleJoinTest}>
            Xem chi tiết
          </Button>
          {actions.includes("update") && (
            <Button color={"primary"} onClick={handleEditTest}>
              Sửa
            </Button>
          )}
          {actions.includes("delete") && (
            <Button color={"primary"} onClick={handleDelete}>
              Xóa
            </Button>
          )}
        </div>
      </div>

      {/* Thong tin co ban */}
      <div className="flex flex-col gap-2 px-8 py-3">
        {/* title */}
        <div className="flex-bet-center">
          <span
            className="text-h6 cursor-pointer font-bold text-text-secondary hover:underline"
            onClick={() => navigate(`${data.id}`)}
          >
            {data.tenDe}
          </span>

          <Button
            variant={"outline"}
            onClick={() => setIsCollapse(!isCollapse)}
          >
            <Icon
              name="collapse"
              className={`${!isCollapse && "rotate-180 transition-all"}`}
            />
          </Button>
        </div>

        {/* infor */}
        <div className="flex flex-col gap-2 text-text-secondary">
          <div className="flex items-center gap-1">
            <Icon name="documentDuplicate" size={20} />
            <span className="text-body-1">Giao cho học phần</span>
            <span className="text-body-1-semibold text">
              {data.mon_thi.tenMonHoc}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="clock" size={20} />
            <span className="text-body-1">
              Diễn ra từ {formatFullDateTimeVN(data.thoiGianBatDau)} đến{" "}
              {formatFullDateTimeVN(data.thoiGianKetThuc)}
            </span>
          </div>
        </div>
      </div>

      {/* Danh sach bai lam */}
      {!isCollapse && (
        <div className="flex flex-col text-text-secondary">
          {data.nhom_hoc_phans.map((item) => (
            <ClassResultItem data={item} testId={data.id} />
          ))}
        </div>
      )}
    </div>
  );
}
