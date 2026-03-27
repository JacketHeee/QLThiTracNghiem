import { useState } from "react";
import { Button, Icon } from "../../atoms";
import { Link } from "react-router-dom";
import type { DeThi } from "@/types";
import { formatFullDateTimeVN, getTestsStatus } from "@/utils";
import { ClassResultItem } from "../../molecules/ClassResultItem/ClassResultItem";

interface TestItemProps {
  data: DeThi;
  onEdit?: (item: DeThi) => void;
  onDelete?: (item: DeThi) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TestItem({ data, onEdit, onDelete }: TestItemProps) {
  const [isCollapse, setIsCollapse] = useState(true);
  return (
    <div className="flex flex-col rounded-md bg-background-body-background">
      {/* header */}
      <div className="flex items-center justify-between border-b border-other-outlined-border px-10 py-2">
        <span className="text-caption rounded-md border border-alert-success-content p-1 text-alert-success-content">
          {getTestsStatus(data.thoiGianBatDau, data.thoiGianKetThuc).label}
        </span>

        <div className="flex gap-2">
          <Button color={"primary"}>Xem chi tiết</Button>
          <Button color={"primary"}>Sửa</Button>
          <Button color={"primary"}>Xóa</Button>
        </div>
      </div>

      {/* Thong tin co ban */}
      <div className="flex flex-col gap-2 px-8 py-3">
        {/* title */}
        <div className="flex-bet-center">
          <Link to="/tests/1">
            <span className="text-h6 font-bold text-text-secondary hover:underline">
              {data.tenDe}
            </span>
          </Link>

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
            // <div className="flex-bet-center border-t border-other-outlined-border px-10 py-3">
            //   <div className="flex items-center gap-1">
            //     <Icon name="groupUser" size={24} />
            //     <span className="text-body-1-semibold">{item.tenNhom}</span>
            //   </div>

            //   <div className="flex items-center gap-5">
            //     <Button
            //       size={"medium"}
            //       className="text-text-secondary underline"
            //     >
            //       {item.siSo} Sinh viên
            //     </Button>

            //     <span
            //       className={
            //         "text-body-2 h-fit rounded-md bg-success-background px-2 py-1 text-alert-success-content"
            //       }
            //     >
            //       {item.namHoc}
            //     </span>

            //     <Link to={`/tests/${data.id}/result/${item.id}`}>
            //       <Button variant={"contained"} color={"success"}>
            //         Kết quả
            //       </Button>
            //     </Link>
            //   </div>
            // </div>
            <ClassResultItem data={item} testId={data.id} />
          ))}
        </div>
      )}
    </div>
  );
}
