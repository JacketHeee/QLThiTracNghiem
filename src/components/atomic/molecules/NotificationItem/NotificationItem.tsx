import { Button, Icon } from "@/components/atomic/atoms";
import type { ThongBaoResponse } from "@/types";
import { formatDateTimeVN } from "@/utils";
import { Link } from "react-router-dom";

interface INotificationItemProps {
  data: ThongBaoResponse;
  recipients?: { group: string; count: number }[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function NotificationItem({
  data,
  onView,
  onEdit,
  onDelete,
}: INotificationItemProps) {
  return (
    <div className="flex flex-col rounded-md bg-background-body-background">
      {/* header */}
      <div className="flex items-center justify-between border-b border-other-outlined-border px-10 py-2">
        <span
          className={`text-caption rounded-md border p-1 ${
            data.status
              ? "border-alert-success-content text-alert-success-content"
              : "border-text-disabled text-text-disabled"
          }`}
        >
          {data.status ? "Đang mở" : "Đã đóng"}
        </span>

        <div className="flex gap-2">
          <Button color={"primary"} onClick={() => onView?.(data.id)}>
            Xem chi tiết
          </Button>
          <Button color={"primary"} onClick={() => onEdit?.(data.id)}>
            Sửa
          </Button>
          <Button color={"primary"} onClick={() => onDelete?.(data.id)}>
            Xóa
          </Button>
        </div>
      </div>

      {/* Nội dung cơ bản */}
      <div className="flex flex-col gap-2 px-8 py-4">
        <div className="text-h6 font-bold text-text-secondary">
          {data.tieuDe}
        </div>
        <div className="flex-bet-center mb-2 rounded-sm border border-other-outlined-border p-3">
          <Link to="#">
            <span className="text-body-1 text-text-secondary">
              {data.noiDung}
            </span>
          </Link>
        </div>

        {/* Thông tin chi tiết (Info) */}
        <div className="flex flex-col gap-2 text-text-secondary">
          <div className="flex items-center gap-1">
            <Icon name="documentDuplicate" size={20} />
            <span className="text-body-1">Giao cho học phần:</span>
            <span className="text-body-1-semibold text">
              {" "}
              {data?.nhom_hoc_phans?.[0]?.mon_hoc?.tenMonHoc ?? ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="clock" size={20} />
            <span className="text-body-1">
              Ngày tạo: {formatDateTimeVN(data.thoiGianGui)} • Người gửi:{" "}
              {data.nguoi_gui.hoTen}
              <span className="text-body-1 font-medium">{""}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
