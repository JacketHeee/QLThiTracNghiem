import { useState } from "react";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import SelectField from "../../atoms/Select/SelectField";
import { RichTextEditor } from "../../molecules/RichTextEditor/RichTextEditor";
import { useEditorStore } from "@/stores/useEditor.store";
import { RadioButton } from "../../atoms/RadioButton/RadioButton";
import { Button } from "../../atoms";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";

interface AddQuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddQuestionForm({
  isOpen,
  onClose,
}: AddQuestionFormProps) {
  const [selectedTab, setSelectedTab] = useState("handmade");
  const { content, setContent } = useEditorStore();

  if (!isOpen) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="flex w-[1000px] flex-col gap-3 rounded-lg bg-background-paper pb-2">
        {/* Tab */}
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          tabs={[
            { value: "handmade", label: "Thêm thủ công" },
            { value: "fromFile", label: "Thêm từ file" },
          ]}
        />

        <div className="flex max-h-[80vh] flex-col overflow-auto">
          {/* Chọn độ khó */}
          <div className="flex gap-5 px-5 py-2">
            <SelectField
              label="Môn học"
              placeholder="Chọn môn học"
              options={[
                { label: "Toán học", value: "math" },
                { label: "Vật lý", value: "physics" },
                { label: "Hóa học", value: "chemistry" },
              ]}
              onSelect={() => {}}
            />
            <SelectField
              label="Chương"
              placeholder="Chọn chương"
              options={[
                { label: "Chương 1: Đây là chương 1", value: "math" },
                { label: "Chương 2: Đây là chương 2", value: "physics" },
                { label: "Chương 3: Đây là chương 3", value: "chemistry" },
                { label: "Chương 3: Đây là chương 3", value: "chemistry" },
                { label: "Chương 3: Đây là chương 3", value: "chemistry" },
                { label: "Chương 3: Đây là chương 3", value: "chemistry" },
                { label: "Chương 3: Đây là chương 3", value: "chemistry" },
                { label: "Chương 3: Đây là chương 3", value: "chemistry" },
              ]}
              onSelect={() => {}}
            />
            <SelectField
              label="Độ khó"
              placeholder="Chọn độ khó"
              options={[
                { label: "Nhận biết", value: "math" },
                { label: "Thông hiểu", value: "physics" },
                { label: "Vận dụng", value: "chemistry" },
                { label: "Vận dụng cao", value: "chemistry" },
              ]}
              onSelect={() => {}}
            />
          </div>

          {/* Nội dung câu hỏi */}
          <div className="flex flex-col gap-2 px-5 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              Nội dung câu hỏi
            </span>

            <RichTextEditor
              content={content}
              onChange={(val) => setContent(val)}
            />

            {/* Xem trước nội dung đã lưu trong Store */}
            {/* <div className="mt-4 rounded border bg-gray-50 p-4">
              <h2 className="font-semibold">Nội dung trong Store:</h2>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div> */}
          </div>

          {/* Danh sach dap an */}
          <div className="flex flex-col gap-2 px-5 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              Danh sách đáp án
            </span>
            <div className="flex flex-col text-text-secondary">
              {/* answer */}
              <div className="flex items-center gap-3 border-b border-other-outlined-border px-5 py-2">
                <strong>A</strong>
                <span className="flex-1">Câu hỏi 1</span>
                <RadioButton label="Chọn đáp án đúng" />
                <div className="flex gap-2">
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Chỉnh sửa
                  </Button>
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Xóa
                  </Button>
                </div>
              </div>
              {/* answer */}
              <div className="flex items-center gap-3 border-b border-other-outlined-border px-5 py-2">
                <strong>A</strong>
                <span className="flex-1">Câu hỏi 1</span>
                <RadioButton label="Chọn đáp án đúng" />
                <div className="flex gap-2">
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Chỉnh sửa
                  </Button>
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Xóa
                  </Button>
                </div>
              </div>
              {/* answer */}
              <div className="flex items-center gap-3 border-b border-other-outlined-border px-5 py-2">
                <strong>A</strong>
                <span className="flex-1">Câu hỏi 1</span>
                <RadioButton label="Chọn đáp án đúng" />
                <div className="flex gap-2">
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Chỉnh sửa
                  </Button>
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Xóa
                  </Button>
                </div>
              </div>
              {/* answer */}
              <div className="flex items-center gap-3 border-b border-other-outlined-border px-5 py-2">
                <strong>A</strong>
                <span className="flex-1">Câu hỏi 1</span>
                <RadioButton label="Chọn đáp án đúng" />
                <div className="flex gap-2">
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Chỉnh sửa
                  </Button>
                  <Button variant={"text"} color={"primary"} size={"small"}>
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Thêm câu hỏi */}
          <div className="flex flex-col gap-2 px-5 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              Thêm câu hỏi mới
            </span>

            <div className="flex flex-col gap-3 rounded-md border border-other-outlined-border p-3">
              <Checkbox label="Đặt làm đáp án đúng?" />
              <RichTextEditor
                content={content}
                onChange={(val) => setContent(val)}
              />
              <div className="flex justify-end">
                <Button variant={"outline"} color={"primary"}>
                  Lưu câu trả lời
                </Button>
              </div>
            </div>

            {/* Xem trước nội dung đã lưu trong Store */}
            {/* <div className="mt-4 rounded border bg-gray-50 p-4">
              <h2 className="font-semibold">Nội dung trong Store:</h2>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div> */}
          </div>

          {/* Action */}
          <div className="flex justify-between px-5 py-2">
            <Checkbox label="Đặt làm công khai?" />

            <div className="flex gap-2">
              <Button variant={"outline"} color={"standard"} onClick={onClose}>
                Quay lại
              </Button>

              <Button variant={"contained"} color={"primary"}>
                Lưu câu hỏi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
