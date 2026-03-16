import { useState } from "react";
import { Button, Icon } from "../../atoms";
import { Link } from "react-router-dom";

export default function TestItem() {
  const [isCollapse, setIsCollapse] = useState(true);
  return (
    <div className="flex flex-col rounded-md bg-background-body-background">
      {/* header */}
      <div className="flex items-center justify-between border-b border-other-outlined-border px-10 py-2">
        <span className="text-caption rounded-md border border-alert-success-content p-1 text-alert-success-content">
          Đang mở
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
            <span className="text-h6 text-text-secondary hover:underline">
              Đề thi 100 câu siêu cháy
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
              Lập trình hướng đối tượng
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="clock" size={20} />
            <span className="text-body-1">
              Diễn ra từ 17:05 08/03/2026 đến 17:35 09/05/2026
            </span>
          </div>
        </div>
      </div>

      {/* Danh sach bai lam */}
      {!isCollapse && (
        <div className="flex flex-col text-text-secondary">
          {/* item */}
          <div className="flex-bet-center border-t border-other-outlined-border px-10 py-3">
            <div className="flex items-center gap-1">
              <Icon name="groupUser" size={24} />
              <span className="text-body-1-semibold">DKP1232</span>
            </div>

            <div className="flex gap-5">
              <Button size={"medium"} className="text-text-secondary underline">
                32 bài làm
              </Button>

              <Button variant={"contained"} color={"success"}>
                Kết quả
              </Button>
            </div>
          </div>
          {/* item */}
          <div className="flex-bet-center border-t border-other-outlined-border px-10 py-3">
            <div className="flex items-center gap-1">
              <Icon name="groupUser" size={24} />
              <span className="text-body-1-semibold">DKP1232</span>
            </div>

            <div className="flex gap-5">
              <Button size={"medium"} className="text-text-secondary underline">
                32 bài làm
              </Button>

              <Button variant={"contained"} color={"success"}>
                Kết quả
              </Button>
            </div>
          </div>
          {/* item */}
          <div className="flex-bet-center border-t border-other-outlined-border px-10 py-3">
            <div className="flex items-center gap-1">
              <Icon name="groupUser" size={24} />
              <span className="text-body-1-semibold">DKP1233</span>
            </div>

            <div className="flex gap-5">
              <Button size={"medium"} className="text-text-secondary underline">
                132 bài làm
              </Button>

              <Button variant={"contained"} color={"success"}>
                Kết quả
              </Button>
            </div>
          </div>
          {/* item */}
          <div className="flex-bet-center border-t border-other-outlined-border px-10 py-3">
            <div className="flex items-center gap-1">
              <Icon name="groupUser" size={24} />
              <span className="text-body-1-semibold">DKP1232</span>
            </div>

            <div className="flex gap-5">
              <Button size={"medium"} className="text-text-secondary underline">
                32 bài làm
              </Button>

              <Button variant={"contained"} color={"success"}>
                Kết quả
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
