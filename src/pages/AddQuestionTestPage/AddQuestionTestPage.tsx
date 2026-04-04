import { Button, Icon, Input } from "@/components/atomic/atoms";
import { Checkbox } from "@/components/atomic/atoms/Checkbox/Checkbox";
import Divider from "@/components/atomic/atoms/Divider/Divider";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { BodyQuestionItem } from "@/components/atomic/molecules/BodyQuestionItem/BodyQuestionItem";
import { useCreateDeThi, useUpdateDeThi } from "@/hooks/useDeThi";
import { useDoKho } from "@/hooks/useDoKho";
import { useQuestions } from "@/hooks/useQuestion";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { useExamStore } from "@/stores/useExamStore";
import { useToastStore } from "@/stores/useToast.store";
import type { CreateDeThiPayload, DeThi } from "@/types";
import { formatFullDateTimeVN, mapDeThiToCreatePayload } from "@/utils";
import {
  BadgePercent,
  CopyX,
  Eye,
  Info,
  Printer,
  RotateCcw,
  ShieldAlert,
  Shuffle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function AddQuestionTestPage() {
  const location = useLocation();
  const { pathname } = location;

  const isEditMode = pathname.includes("/edit");
  const isViewMode = pathname.includes("/view");
  const isAddMode = pathname.includes("/add");

  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpenQuestionForm, setIsOpenQuestionForm] = useState(false);
  const { mutate: createDeThi } = useCreateDeThi();
  const { mutate: updateDeThi } = useUpdateDeThi();

  // Hooks lấy dữ liệu mẫu từ ngân hàng câu hỏi
  const { questions } = useQuestions();
  const { doKhos } = useDoKho();

  // 1. Lấy dữ liệu và Actions từ Store duy nhất
  const testData = useDeThiStore((s) => s.testData);
  const addQuestion = useDeThiStore((s) => s.addQuestion);
  const removeQuestion = useDeThiStore((s) => s.removeQuestion);
  const moveQuestion = useDeThiStore((s) => s.moveQuestion);
  const showToast = useToastStore((s) => s.showToast);

  // Selector an toàn cho danh sách câu hỏi trong đề
  const cauHoi_deThi = useMemo(
    () => testData?.cau_hois || [],
    [testData?.cau_hois]
  );

  const handlePreview = () => {
    useExamStore.getState().resetExam();
    useExamStore.getState().mode = "PREVIEW";
    // Sử dụng optional chaining an toàn
    navigate(`/tests/${testData?.id || "draft"}/take?mode=preview`);
  };

  // 2. Tối ưu: Set ID để kiểm tra trạng thái "đã chọn" (O(1))
  const selectedQuestionIds = useMemo(
    () => new Set(cauHoi_deThi.map((q) => q.id)),
    [cauHoi_deThi]
  );

  // 3. Tính toán số lượng câu hỏi theo độ khó
  const difficultyCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    cauHoi_deThi.forEach((q) => {
      counts[q.doKhoId] = (counts[q.doKhoId] || 0) + 1;
    });
    return counts;
  }, [cauHoi_deThi]);

  const handleSave = () => {
    const data = mapDeThiToCreatePayload(
      testData as DeThi
    ) as CreateDeThiPayload;

    if (isAddMode) {
      createDeThi(data, {
        onSuccess: (data) => {
          // Có thể điều hướng người dùng sau khi lưu thành công
          console.log("Tạo bài thi", data.data);
          navigate(`/tests/${data.data.id}`);
        },
      });
    } else {
      updateDeThi(
        { payload: data, id: testData?.id || Number(id) },
        {
          onSuccess: (data) => {
            // Có thể điều hướng người dùng sau khi lưu thành công
            console.log("Lưu bài thi", testData?.id || Number(id));
            showToast("Lưu thành công!", "success");
            navigate(`/tests/${data.data.id}`);
          },
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background-body">
      <div className="flex justify-center bg-other-tooltip p-2">
        <div className="flex-bet-center w-[1000px]">
          <Button
            variant={"contained"}
            color={"standard"}
            onClick={() => {
              const backPath = id ? -1 : "/tests/add";

              navigate(backPath as string, {
                state: { fromQuestions: true },
                replace: true, // Dùng replace để không làm rối history stack
              });
            }}
          >
            <Icon name="out" />
            Quay lại
          </Button>
          <strong className="text-body-1 font-medium text-primary-contrast">
            {isEditMode
              ? "Chỉnh sửa danh sách câu hỏi"
              : isViewMode
                ? "Danh sách câu hỏi"
                : "Thêm câu hỏi"}
          </strong>
          <Button
            variant={"contained"}
            color={"standard"}
            onClick={handlePreview}
          >
            <Icon name="eye" />
            Xem demo
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-stretch bg-background-body p-5">
        <div className="flex w-[450px] flex-col gap-3 border-r border-other-outlined-border pr-5">
          <div className="flex-bet-center gap-2">
            <Input placeholder="Tìm kiếm câu hỏi" disabled={isViewMode} />
            <Button
              disabled={isViewMode}
              variant={"outline"}
              color={"primary"}
              className="bg-background-body-background"
              onClick={() => setIsOpenQuestionForm(true)}
            >
              <Icon name="question" /> Thêm câu hỏi
            </Button>

            {/* <AddQuestionForm
              isOpen={isOpenQuestionForm}
              onClose={() => setIsOpenQuestionForm(!isOpenQuestionForm)}
            /> */}
          </div>
          <div className="flex-bet-center gap-2">
            <SelectField
              placeholder="Chọn chương"
              classname="bg-background-body-background"
              options={[{ label: "Chương 1: Đây là chương 1", value: 1 }]}
              onSelect={() => {}}
              disabled={isViewMode}
            />
            <SelectField
              label="Độ khó"
              placeholder="Chọn độ khó"
              options={doKhos.map((item) => ({
                label: item.tenDoKho,
                value: item.id,
              }))}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onSelect={(_val) => {
                // setFilterDifficulty();
              }}
              disabled={isViewMode}
            />
          </div>

          <div className="flex max-h-[80vh] flex-col overflow-auto border-x border-t border-other-outlined-border bg-background-body-background">
            {questions.map((item) => {
              // Kiểm tra xem câu hỏi này đã có trong đề thi chưa
              const isSelected = selectedQuestionIds.has(item.id);

              return (
                <Checkbox
                  disabled={isViewMode}
                  key={item.id}
                  id={`question-item-${item.id}`} // Đảm bảo ID duy nhất cho label
                  classnameParent={`p-4 border-b border-other-outlined-border gap-3 ${isViewMode ? "opacity-80 pointer-events-none " : "hover:bg-action-hover"} transition-colors`}
                  label={item.noiDungCauHoi}
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addQuestion(item);
                    } else {
                      removeQuestion(item.id);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="ml-5 flex flex-1 flex-col rounded-md bg-background-body-background">
          {/*  */}
          <div className="flex-bet-center border-b border-other-outlined-border px-5 py-2.5">
            <div className="flex items-center gap-2 text-text-secondary">
              <span>Số lượng: </span>
              <div className="flex gap-2">
                {doKhos.map((kho) => {
                  const count = difficultyCounts[kho.id] || 0;

                  // Chỉ hiển thị những độ khó có câu hỏi (hoặc hiển thị 0 tùy bạn)
                  return (
                    <div
                      key={kho.id}
                      className="flex items-center gap-2 rounded-md bg-action-selected p-1.5 transition-all"
                    >
                      <span className="text text-body-1">{kho.tenDoKho}</span>
                      <span className="text-body-2 rounded-md bg-primary-main px-2.5 font-semibold text-primary-contrast">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              {!isViewMode && (
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={handleSave}
                >
                  <Icon name="clipboard" />
                  {isEditMode ? "Lưu thay đổi" : "Thêm bài kiểm tra"}
                </Button>
              )}
            </div>
          </div>
          <div className="flex max-h-[90vh] flex-col overflow-auto">
            <div className="flex justify-center border-b border-other-outlined-border pb-4">
              <TestInfoSummary />
            </div>

            {/*  */}
            <div className="px-5">
              {cauHoi_deThi.map((item, index) => (
                <div className="flex justify-between gap-2 border-b border-other-outlined-border p-2.5">
                  {/* infor */}
                  <BodyQuestionItem data={item} showAnswer index={index + 1} />

                  <div
                    className={`flex flex-col justify-center ${isViewMode && "pointer-events-none opacity-60"}`}
                  >
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      className="rounded-none border-b border-other-outlined-border"
                      disabled={index === 0} // Vị trí đầu tiên không thể lên nữa
                      onClick={() => moveQuestion(index, "up")}
                      tooltip="Di chuyển lên"
                      isToolTipLeft
                    >
                      <Icon name="arrowUp" />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      className="rounded-none border-b border-other-outlined-border"
                      disabled={index === cauHoi_deThi.length - 1} // Vị trí cuối không thể xuống
                      onClick={() => moveQuestion(index, "down")}
                      tooltip="Di chuyển xuống"
                      isToolTipLeft
                    >
                      <Icon name="up" />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      className="rounded-none border-b border-other-outlined-border"
                      onClick={() => removeQuestion(item.id)}
                      tooltip="Gỡ khỏi đề"
                      isToolTipLeft
                    >
                      <Icon name="remove" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TestInfoSummary = () => {
  const { testData } = useDeThiStore();

  return (
    <div className="flex justify-center">
      <div className="flex w-full flex-col gap-6 px-8 py-3">
        {/* 1. Tiêu đề và Thông tin cơ bản - Phân chia rõ ràng */}
        <div className="flex flex-col gap-2 px-8 py-3">
          {/* title */}
          <div className="mb-5 flex justify-center">
            <span className="text-h6 text-text-primary hover:underline">
              {testData?.tenDe}
            </span>
          </div>

          <div className="flex gap-6">
            {/* infor */}
            <div className="flex flex-col gap-2.5">
              <span className="text-caption-semibold uppercase tracking-wider text-text-primary">
                Thông tin cơ bản
              </span>
              <div className="flex flex-col gap-2 text-text-secondary">
                <div className="flex items-center gap-1">
                  <Icon name="documentDuplicate" size={20} />
                  <span className="text-body-2">Giao cho học phần</span>
                  <span className="text-body-2-semibold text">
                    {testData?.mon_thi?.tenMonHoc}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="pause" size={20} />
                  <span className="text-body-2">
                    Diễn ra từ {formatFullDateTimeVN(testData?.thoiGianBatDau)}{" "}
                    đến {formatFullDateTimeVN(testData?.thoiGianKetThuc)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="clock" size={20} />
                  <span className="text-body-2">
                    Thời gian làm bài: {testData?.thoiGianLamBai} phút
                  </span>
                </div>
              </div>
            </div>

            <Divider orientation="vertical" />

            {/* Nhóm Bảo mật */}
            <div className="flex flex-col gap-2.5">
              <span className="text-caption-semibold uppercase tracking-wider text-text-primary">
                An toàn & Bảo mật
              </span>
              <ul className="flex flex-col gap-2">
                {testData?.cau_hinh_thi?.hasMonitoring && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <Eye size={18} className="text-text-tertiary mt-0.5" />
                    Giám sát thi đang bật
                  </li>
                )}

                {testData?.cau_hinh_thi?.isLimitSwitchTab && (
                  <li className="text-body-2 flex items-center gap-2 text-alert-error-content">
                    <ShieldAlert size={18} className="mt-0.5" />
                    Giới hạn chuyển tab:{" "}
                    <span className="font-semibold">
                      {testData?.cau_hinh_thi?.tabSwitchLimit} lần
                    </span>
                  </li>
                )}

                {testData?.cau_hinh_thi?.allowCopy === false && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <CopyX size={18} className="text-text-tertiary mt-0.5" />
                    Không cho phép sao chép nội dung
                  </li>
                )}

                {testData?.cau_hinh_thi?.allowPrint === false && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <Printer size={18} className="text-text-tertiary mt-0.5" />
                    Đã chặn tính năng in ấn
                  </li>
                )}
              </ul>
            </div>

            <Divider orientation="vertical" />

            {/* Nhóm Quy tắc */}
            <div className="flex flex-col gap-2.5">
              <span className="text-caption-semibold uppercase tracking-wider text-text-primary">
                Quy tắc làm bài
              </span>
              <ul className="flex flex-col gap-2">
                {(testData?.cau_hinh_thi?.shuffleQuestions ||
                  testData?.cau_hinh_thi?.shuffleAnswers) && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <Shuffle size={18} className="text-text-tertiary mt-0.5" />
                    Tự động trộn câu hỏi và đáp án
                  </li>
                )}

                {testData?.cau_hinh_thi?.isEnableResume && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <RotateCcw
                      size={18}
                      className="text-text-tertiary mt-0.5"
                    />
                    Sinh viên có thể làm tiếp bài đang dở
                  </li>
                )}
                {testData?.cau_hinh_thi?.showDetailResults && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <Info size={18} className="text-text-tertiary mt-0.5" />
                    Hiển thị chi tiết kết quả
                  </li>
                )}

                {testData?.cau_hinh_thi?.showScore && (
                  <li className="text-body-2 flex items-center gap-2 text-text-secondary">
                    <BadgePercent
                      size={18}
                      className="text-text-tertiary mt-0.5"
                    />
                    Hiển thị điểm số
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
