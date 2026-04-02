import type { CauHinhThi } from "@/types";
import { Toggle } from "../../atoms/Toggle/Toggle";
import { TextField } from "../../molecules/TextField/TextField";

interface RightSidebarProps {
  data?: CauHinhThi;
  onChange?: (newData: Partial<CauHinhThi>) => void;
  readOnly?: boolean;
}

export default function RightSidebar({
  data,
  onChange,
  readOnly,
}: RightSidebarProps) {
  // Hàm update linh hoạt cho cả Boolean và Number
  const updateConfig = (updates: Partial<CauHinhThi>) => {
    if (readOnly || !data) return;
    onChange?.(updates);
  };

  // Logic xử lý riêng cho Giám sát thi để đồng bộ các con
  const handleToggleMonitoring = () => {
    const isMonitoring = !data?.hasMonitoring;

    if (isMonitoring) {
      // KHI BẬT: Tự động kích hoạt các cấu hình mặc định
      updateConfig({
        hasMonitoring: true,
        allowCopy: false, // Bật chặn (allowCopy = false)
        isLimitSwitchTab: true, // Bật giới hạn tab
        tabSwitchLimit: 3, // Mặc định là 3 lần
      });
    } else {
      // KHI TẮT: Trả về trạng thái tự do
      updateConfig({
        hasMonitoring: false,
        isLimitSwitchTab: false,
        allowCopy: true, // Tắt chặn (cho phép copy)
      });
    }
  };

  return (
    <div className="h-full w-[320px] overflow-y-auto border-l border-other-outlined-border bg-background-body-background">
      <div className="text-h6 border-b border-other-outlined-border px-5 py-4 font-bold text-text-primary">
        Cấu hình đề thi
      </div>

      <div className="flex flex-col gap-6 px-5 py-6">
        {/* NHÓM: XÁO TRỘN */}
        <section className="flex flex-col gap-3">
          <p className="text-caption font-bold uppercase text-text-disabled">
            Xáo trộn
          </p>
          <Toggle
            label="Đảo câu hỏi"
            checked={!!data?.shuffleQuestions}
            onChange={() =>
              updateConfig({ shuffleQuestions: !data?.shuffleQuestions })
            }
            disabled={readOnly}
          />
          <Toggle
            label="Đảo đáp án"
            checked={!!data?.shuffleAnswers}
            onChange={() =>
              updateConfig({ shuffleAnswers: !data?.shuffleAnswers })
            }
            disabled={readOnly}
          />
        </section>

        {/* NHÓM: BẢO MẬT (ANTI-CHEAT) */}
        <section className="flex flex-col gap-3">
          <p className="text-caption font-bold uppercase text-text-disabled">
            Chống gian lận
          </p>

          {/* Toggle Cha */}
          <Toggle
            label="Giám sát thi (Toàn màn hình)"
            checked={!!data?.hasMonitoring}
            onChange={handleToggleMonitoring}
            disabled={readOnly}
          />

          {/* Các tùy chọn con - Chỉ hiện khi bật Giám sát */}
          {data?.hasMonitoring && (
            <div className="border-primary-main/20 ml-2 flex flex-col gap-4 border-l-2 pl-4 duration-200 animate-in slide-in-from-left-2">
              <Toggle
                label="Chặn Copy/Paste/Print"
                checked={data?.allowCopy === false}
                onChange={() => updateConfig({ allowCopy: !data?.allowCopy })}
                disabled={readOnly}
              />

              <div className="flex flex-col gap-2">
                <Toggle
                  label="Giới hạn chuyển tab (tự động nộp bài)"
                  checked={!!data?.isLimitSwitchTab}
                  onChange={() =>
                    updateConfig({ isLimitSwitchTab: !data?.isLimitSwitchTab })
                  }
                  disabled={readOnly}
                />

                {data?.isLimitSwitchTab && (
                  <div className="pl-9 duration-200 animate-in slide-in-from-top-2">
                    <TextField
                      type="number"
                      label="Số lần tối đa"
                      value={data?.tabSwitchLimit ?? 3}
                      onChange={(e) =>
                        updateConfig({ tabSwitchLimit: Number(e.target.value) })
                      }
                      disabled={readOnly}
                      classNameParent={`!gap-1 ${readOnly && "opacity-50"}`}
                      placeholder="Ví dụ: 3"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* NHÓM: KẾT QUẢ */}
        <section className="flex flex-col gap-3">
          <p className="text-caption font-bold uppercase text-text-disabled">
            Sau khi thi
          </p>
          <Toggle
            label="Hiển thị điểm số"
            checked={!!data?.showScore}
            onChange={() => updateConfig({ showScore: !data?.showScore })}
            disabled={readOnly}
          />
          <Toggle
            label="Xem chi tiết kết quả"
            checked={!!data?.showDetailResults}
            onChange={() =>
              updateConfig({ showDetailResults: !data?.showDetailResults })
            }
            disabled={readOnly}
          />
          <Toggle
            label="Cho phép làm lại"
            checked={!!data?.isEnableResume}
            onChange={() =>
              updateConfig({ isEnableResume: !data?.isEnableResume })
            }
            disabled={readOnly}
          />
        </section>
      </div>
    </div>
  );
}
