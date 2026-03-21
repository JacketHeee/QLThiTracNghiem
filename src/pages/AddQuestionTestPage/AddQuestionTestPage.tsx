import { Button, Icon, Input } from "@/components/atomic/atoms";
import { Checkbox } from "@/components/atomic/atoms/Checkbox/Checkbox";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import AddQuestionForm from "@/components/atomic/organisms/AddQuestionForm/AddQuestionForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddQuestionTestPage() {
  const navigate = useNavigate();
  const [isOpenQuestionForm, setIsOpenQuestionForm] = useState(false);
  return (
    <div className="fixed inset-0 flex flex-col bg-background-body">
      <div className="flex justify-center bg-other-tooltip p-2">
        <div className="flex-bet-center w-[1000px]">
          <Button
            variant={"contained"}
            color={"standard"}
            onClick={() => navigate(-1)}
          >
            <Icon name="out" />
            Quay lại
          </Button>
          <strong className="text-body-1 text-primary-contrast">
            THÊM CÂU HỎI
          </strong>
          <Button variant={"contained"} color={"standard"}>
            <Icon name="eye" />
            Xem trước
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-stretch p-5">
        <div className="flex w-[450px] flex-col gap-3 border-r border-other-outlined-border pr-5">
          <div className="flex-bet-center gap-2">
            <Input placeholder="Tìm kiếm câu hỏi" />
            <Button
              variant={"outline"}
              color={"primary"}
              className="bg-background-body-background"
              onClick={() => setIsOpenQuestionForm(true)}
            >
              <Icon name="question" /> Thêm câu hỏi
            </Button>

            <AddQuestionForm
              isOpen={isOpenQuestionForm}
              onClose={() => setIsOpenQuestionForm(!isOpenQuestionForm)}
            />
          </div>
          <div className="flex-bet-center gap-2">
            <SelectField
              placeholder="Chọn chương"
              classname="bg-background-body-background"
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
              classname="bg-background-body-background"
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

          <div className="flex max-h-[80vh] flex-col overflow-auto border-x border-t border-other-outlined-border bg-background-body-background">
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Trong java, khi khai báo một thuộc tính hoặc một hàm của một lớp mà không có từ khóa quyền truy cập thì mặc định quyền truy cập là gì?"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Trong java, khi khai báo một thuộc tính hoặc một hàm của một lớp mà không có từ khóa quyền truy cập thì mặc định quyền truy cập là gì?"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Trong java, khi khai báo một thuộc tính hoặc một hàm của một lớp mà không có từ khóa quyền truy cập thì mặc định quyền truy cập là gì?"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
            <Checkbox
              classnameParent="p-4 border-b border-other-outlined-border gap-3"
              label="Đặc điểm cơ bản của lập trình hướng đối tượng thể hiện ở:"
            />
          </div>
        </div>
        <div className="ml-5 flex flex-1 flex-col rounded-md bg-background-body-background">
          {/*  */}
          <div className="flex-bet-center border-b border-other-outlined-border px-5 py-2.5">
            <div className="flex items-center gap-2 text-text-secondary">
              <span>Số lượng: </span>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 rounded-md bg-action-selected p-1.5">
                  <span className="text text-body-1">Nhận biết</span>
                  <span className="text-body-2 rounded-md bg-primary-main px-2.5 text-primary-contrast">
                    1
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-action-selected p-1.5">
                  <span className="text text-body-1">Thông hiểu</span>
                  <span className="text-body-2 rounded-md bg-primary-main px-2.5 text-primary-contrast">
                    1
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-action-selected p-1.5">
                  <span className="text text-body-1">Vận dụng</span>
                  <span className="text-body-2 rounded-md bg-primary-main px-2.5 text-primary-contrast">
                    1
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-action-selected p-1.5">
                  <span className="text text-body-1">Vận dụng cao</span>
                  <span className="text-body-2 rounded-md bg-primary-main px-2.5 text-primary-contrast">
                    1
                  </span>
                </div>
              </div>
            </div>

            <Button variant={"contained"} color={"primary"}>
              <Icon name="clipboard" />
              Thêm bài kiểm tra
            </Button>
          </div>
          <div className="flex max-h-[90vh] flex-col overflow-auto">
            {/* Thong tin co ban */}
            <div className="flex justify-center border-b border-other-outlined-border pb-1">
              <div className="flex flex-col gap-2 px-8 py-3">
                {/* title */}
                <div className="flex-bet-center">
                  <span className="text-h6 text-text-secondary hover:underline">
                    Đề thi 100 câu siêu cháy
                  </span>
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
                    <Icon name="pause" size={20} />
                    <span className="text-body-1">
                      Diễn ra từ 17:05 08/03/2026 đến 17:35 09/05/2026
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="clock" size={20} />
                    <span className="text-body-1">
                      Thời gian làm bài: 100 phút
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="px-5">
              <div className="flex justify-between gap-2 border-b border-other-outlined-border p-2.5">
                {/* infor */}
                <div className="flex min-w-[800px] flex-col gap-2 px-2 py-4">
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
                <div className="flex flex-col justify-center">
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="arrowUp" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="up" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="remove" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between gap-2 border-b border-other-outlined-border p-2.5">
                {/* infor */}
                <div className="flex min-w-[800px] flex-col gap-2 px-2 py-4">
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
                <div className="flex flex-col justify-center">
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="arrowUp" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="up" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="remove" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between gap-2 border-b border-other-outlined-border p-2.5">
                {/* infor */}
                <div className="flex min-w-[800px] flex-col gap-2 px-2 py-4">
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
                <div className="flex flex-col justify-center">
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="arrowUp" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="up" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="remove" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between gap-2 border-b border-other-outlined-border p-2.5">
                {/* infor */}
                <div className="flex min-w-[800px] flex-col gap-2 px-2 py-4">
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
                <div className="flex flex-col justify-center">
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="arrowUp" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="up" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="remove" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between gap-2 border-b border-other-outlined-border p-2.5">
                {/* infor */}
                <div className="flex min-w-[800px] flex-col gap-2 px-2 py-4">
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
                <div className="flex flex-col justify-center">
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="arrowUp" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="up" />
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className="rounded-none border-b border-other-outlined-border"
                  >
                    <Icon name="remove" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
