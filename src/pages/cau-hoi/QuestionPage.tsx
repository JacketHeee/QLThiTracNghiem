import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import AddQuestionForm from "@/components/atomic/organisms/AddQuestionForm/AddQuestionForm";
import { useState } from "react";

export const QuestionPage = () => {
  const [selected, setSelected] = useState("public");
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex w-[1000px] max-w-[1000px] flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-md bg-background-body-background">
        <div className="border-b-1 flex items-center justify-between border-other-outlined-border pr-3">
          <Tabs
            value={selected}
            onChange={setSelected}
            tabs={[
              { value: "public", label: "Công khai" },
              { value: "private", label: "Cá nhân" },
              { value: "archive", label: "Lưu trữ" }, // ví dụ tab bị disable
            ]}
          />
          <Button
            onClick={() => setIsAddOpen(true)}
            variant={"contained"}
            color={"primary"}
          >
            Thêm câu hỏi
            <Icon name="arrowDown" />
          </Button>
        </div>

        <div className="flex gap-5 px-3">
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
        <div className="flex gap-5 px-3 pb-3">
          <Input
            className="flex-1"
            placeholder="Tìm kiếm theo tên"
            hasBoder={true}
            icon={<Icon name="search" className="text-text-secondary" />}
          />
          <Button>
            <Icon name="arrowUpDown" className="text-text-secondary" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {/* item */}
        <div className="flex flex-1 flex-col rounded-md bg-background-body-background px-3">
          <div className="flex justify-between border-b border-other-outlined-border p-5">
            <span className="text-caption rounded-sm border border-text-secondary p-1 text-text-secondary">
              Thông hiểu
            </span>
            <span className="text-body-1 text-text-secondary">
              Lập trình hướng đối tượng/Chương 1: Dao động điều hòa
            </span>
          </div>
          <div className="flex flex-col px-2">
            <div className="flex flex-col border-b border-other-outlined-border px-2 py-4">
              <span className="text-body-1 text-text-secondary">
                Mã số sinh viên?
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button color={"primary"}>Hiển thị đáp án</Button>
                <Button color={"primary"}>Sửa</Button>
                <Button color={"primary"}>Xóa</Button>
                <Button color={"primary"}>Thêm vào ngân hàng câu hỏi</Button>
              </div>
              <div className="flex gap-1 text-text-secondary">
                <span>5 giờ ·</span>
                <Icon name="word" />
                <span>· Lượt sử dụng: 160 lần</span>
              </div>
            </div>
          </div>
        </div>
        {/* item */}
        <div className="flex flex-1 flex-col rounded-md bg-background-body-background px-3">
          <div className="flex justify-between border-b border-other-outlined-border p-5">
            <span className="text-caption rounded-sm border border-text-secondary p-1 text-text-secondary">
              Thông hiểu
            </span>
            <span className="text-body-1 text-text-secondary">
              Lập trình hướng đối tượng/Chương 1: Dao động điều hòa
            </span>
          </div>
          <div className="flex flex-col px-2">
            <div className="flex flex-col gap-2 border-b border-other-outlined-border px-2 py-4">
              <span className="text-body-1 text-text-secondary">
                Mã số sinh viên?
              </span>
              <div className="text-body-1 flex flex-col gap-1 text-text-secondary">
                <div className="flex max-w-[700px] justify-between px-2 py-1">
                  <span>
                    <strong>A</strong>. Đây là đáp án a
                  </span>{" "}
                </div>
                <div className="flex max-w-[700px] items-center justify-between rounded-md bg-action-hover px-2 py-1">
                  <span>
                    <strong>B</strong>. Đây là đáp án ban
                  </span>{" "}
                  <Icon
                    size={20}
                    name="success"
                    className="text-alert-success-content"
                  />{" "}
                </div>
                <div className="flex max-w-[700px] justify-between px-2 py-1">
                  <span>
                    <strong>C</strong>. Đây là đáp án c
                  </span>{" "}
                </div>
                <div className="flex max-w-[700px] justify-between px-2 py-1">
                  <span>
                    <strong>D</strong>. Đây là đáp án d
                  </span>{" "}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button color={"primary"}>Hiển thị đáp án</Button>
                <Button color={"primary"}>Sửa</Button>
                <Button color={"primary"}>Xóa</Button>
                <Button color={"primary"}>Thêm vào ngân hàng câu hỏi</Button>
              </div>
              <div className="flex gap-1 text-text-secondary">
                <span>5 giờ ·</span>
                <Icon name="word" />
                <span>· Lượt sử dụng: 160 lần</span>
              </div>
            </div>
          </div>
        </div>
        {/* item */}
        <div className="flex flex-1 flex-col rounded-md bg-background-body-background px-3">
          <div className="flex justify-between border-b border-other-outlined-border p-5">
            <span className="text-caption rounded-sm border border-text-secondary p-1 text-text-secondary">
              Thông hiểu
            </span>
            <span className="text-body-1 text-text-secondary">
              Lập trình hướng đối tượng/Chương 1: Dao động điều hòa
            </span>
          </div>
          <div className="flex flex-col px-2">
            <div className="flex flex-col border-b border-other-outlined-border px-2 py-4">
              <span className="text-body-1 text-text-secondary">
                Mã số sinh viên?
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button color={"primary"}>Hiển thị đáp án</Button>
                <Button color={"primary"}>Sửa</Button>
                <Button color={"primary"}>Xóa</Button>
                <Button color={"primary"}>Thêm vào ngân hàng câu hỏi</Button>
              </div>
              <div className="flex gap-1 text-text-secondary">
                <span>5 giờ ·</span>
                <Icon name="word" />
                <span>· Lượt sử dụng: 160 lần</span>
              </div>
            </div>
          </div>
        </div>
        {/* item */}
        <div className="flex flex-1 flex-col rounded-md bg-background-body-background px-3">
          <div className="flex justify-between border-b border-other-outlined-border p-5">
            <span className="text-caption rounded-sm border border-text-secondary p-1 text-text-secondary">
              Thông hiểu
            </span>
            <span className="text-body-1 text-text-secondary">
              Lập trình hướng đối tượng/Chương 1: Dao động điều hòa
            </span>
          </div>
          <div className="flex flex-col px-2">
            <div className="flex flex-col border-b border-other-outlined-border px-2 py-4">
              <span className="text-body-1 text-text-secondary">
                Mã số sinh viên?
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button color={"primary"}>Hiển thị đáp án</Button>
                <Button color={"primary"}>Sửa</Button>
                <Button color={"primary"}>Xóa</Button>
                <Button color={"primary"}>Thêm vào ngân hàng câu hỏi</Button>
              </div>
              <div className="flex gap-1 text-text-secondary">
                <span>5 giờ ·</span>
                <Icon name="word" />
                <span>· Lượt sử dụng: 160 lần</span>
              </div>
            </div>
          </div>
        </div>
        {/* item */}
        <div className="flex flex-1 flex-col rounded-md bg-background-body-background px-3">
          <div className="flex justify-between border-b border-other-outlined-border p-5">
            <span className="text-caption rounded-sm border border-text-secondary p-1 text-text-secondary">
              Thông hiểu
            </span>
            <span className="text-body-1 text-text-secondary">
              Lập trình hướng đối tượng/Chương 1: Dao động điều hòa
            </span>
          </div>
          <div className="flex flex-col px-2">
            <div className="flex flex-col gap-2 border-b border-other-outlined-border px-2 py-4">
              <span className="text-body-1 text-text-secondary">
                Mã số sinh viên?
              </span>
              <div className="text-body-1 flex flex-col gap-1 text-text-secondary">
                <div className="flex max-w-[700px] justify-between px-2 py-1">
                  <span>
                    <strong>A</strong>. Đây là đáp án a
                  </span>{" "}
                </div>
                <div className="flex max-w-[700px] items-center justify-between rounded-md bg-action-hover px-2 py-1">
                  <span>
                    <strong>B</strong>. Đây là đáp án b
                  </span>{" "}
                  <Icon
                    size={20}
                    name="success"
                    className="text-alert-success-content"
                  />{" "}
                </div>
                <div className="flex max-w-[700px] justify-between px-2 py-1">
                  <span>
                    <strong>C</strong>. Đây là đáp án c
                  </span>{" "}
                </div>
                <div className="flex max-w-[700px] justify-between px-2 py-1">
                  <span>
                    <strong>D</strong>. Đây là đáp án d
                  </span>{" "}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button color={"primary"}>Hiển thị đáp án</Button>
                <Button color={"primary"}>Sửa</Button>
                <Button color={"primary"}>Xóa</Button>
                <Button color={"primary"}>Thêm vào ngân hàng câu hỏi</Button>
              </div>
              <div className="flex gap-1 text-text-secondary">
                <span>5 giờ ·</span>
                <Icon name="word" />
                <span>· Lượt sử dụng: 160 lần</span>
              </div>
            </div>
          </div>
        </div>
        {/* item */}
        <div className="flex flex-1 flex-col rounded-md bg-background-body-background px-3">
          <div className="flex justify-between border-b border-other-outlined-border p-5">
            <span className="text-caption rounded-sm border border-text-secondary p-1 text-text-secondary">
              Thông hiểu
            </span>
            <span className="text-body-1 text-text-secondary">
              Lập trình hướng đối tượng/Chương 1: Dao động điều hòa
            </span>
          </div>
          <div className="flex flex-col px-2">
            <div className="flex flex-col border-b border-other-outlined-border px-2 py-4">
              <span className="text-body-1 text-text-secondary">
                Mã số sinh viên?
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button color={"primary"}>Hiển thị đáp án</Button>
                <Button color={"primary"}>Sửa</Button>
                <Button color={"primary"}>Xóa</Button>
                <Button color={"primary"}>Thêm vào ngân hàng câu hỏi</Button>
              </div>
              <div className="flex gap-1 text-text-secondary">
                <span>5 giờ ·</span>
                <Icon name="word" />
                <span>· Lượt sử dụng: 160 lần</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-body-1 flex justify-between gap-3 rounded-md bg-background-body-background px-6 py-4 text-text-secondary">
        <span>
          <span className="text-primary-main">SGU Test</span> © 2026
        </span>
        <span>
          Made with ❤️ by <span className="text-primary-main">MaChHiAn</span>
        </span>
      </div>

      <AddQuestionForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
