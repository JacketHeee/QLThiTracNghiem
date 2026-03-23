import { Button, Icon } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useExamStore } from "@/stores/useExamStore";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function TestPageDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handlePreview = () => {
    // Reset store trước khi vào bài mới để tránh dính dữ liệu cũ
    useExamStore.getState().resetExam();
    useExamStore.getState().mode = "PREVIEW";

    // Chuyển hướng kèm theo query param mode=preview
    navigate(`/tests/${id}/take?mode=preview`);
  };

  const handleStartExam = () => {
    // Chuyển hướng thẳng vào trang làm bài (mặc định mode là STUDENT)
    useExamStore.getState().mode = "STUDENT";
    navigate(`/tests/${id}/take`);
  };
  return (
    <MainContentLayout>
      {/* Overview */}
      <div className="flex flex-col rounded-md bg-background-body-background p-8 pb-0">
        <div className="text-h6 flex gap-2 text-alert-info-content">
          <Icon name="testsOverview" size={32} />
          <span>Tổng quan</span>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-3 pb-8 pt-5">
            <div className="flex flex-col gap-2">
              <div className="text-h4 text-text-primary">
                Kiểm tra kiến thức cơ bản HTML & CSS
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
            <div className="flex items-center gap-2">
              <Button variant={"outline"} onClick={handlePreview}>
                <Icon name="play" /> Xem trước
              </Button>
              <Button onClick={handleStartExam}>
                <Icon name="detail" /> Hành động (Test trải nghiệm user)
              </Button>
            </div>
          </div>
          <div className="relative h-[216px] w-[295px]">
            <Icon
              name="editTest"
              size={295}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            <Button
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

              <Link to="/tests/1/result/dkp1232">
                <Button variant={"contained"} color={"success"}>
                  Kết quả
                </Button>
              </Link>
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

              <Link to="/tests/1/result/dkp1232">
                <Button variant={"contained"} color={"success"}>
                  Kết quả
                </Button>
              </Link>
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

              <Link to="/tests/1/result/dkp1232">
                <Button variant={"contained"} color={"success"}>
                  Kết quả
                </Button>
              </Link>
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

              <Link to="/tests/1/result/dkp1232">
                <Button variant={"contained"} color={"success"}>
                  Kết quả
                </Button>
              </Link>
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

              <Link to="/tests/1/result/dkp1232">
                <Button variant={"contained"} color={"success"}>
                  Kết quả
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainContentLayout>
  );
}
