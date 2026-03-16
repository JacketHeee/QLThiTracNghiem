import { Button } from "@/components/atomic/atoms";
import { Checkbox } from "@/components/atomic/atoms/Checkbox/Checkbox";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { DateTimePicker } from "@/components/atomic/molecules/DateTimePicker/DateTimePicker";
import GroupInput from "@/components/atomic/molecules/GroupInput/GroupInput";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import RighSidebar from "@/components/atomic/organisms/RightSidebar/RightSidebar";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { Link } from "react-router-dom";

export default function AddTest() {
  return (
    <div className="flex flex-1">
      <MainContentLayout>
        <div className="text-h6 rounded-md bg-background-body-background px-5 py-2.5 text-text-secondary">
          Tạo mới đề thi
        </div>
        <div className="flex flex-col gap-5 rounded-md bg-background-body-background p-5 text-text-secondary">
          {/*  */}
          <TextField label="Tên đề thi" placeholder="Nhập tên đề thi" />

          {/*  */}
          <div className="flex gap-2">
            <DateTimePicker
              label="Thời gian bắt đầu"
              placeHolder="Từ"
              onSelect={() => {}}
            />
            <DateTimePicker
              label="Thời gian kết thúc"
              placeHolder="Đến"
              onSelect={() => {}}
            />
          </div>

          {/*  */}
          <GroupInput
            labelLeft="Thời gian làm bài"
            labelRight="Phút"
            placeholder="00"
          />

          {/*  */}
          <div className="flex flex-col rounded-md border border-other-outlined-border">
            <div className="flex-bet-center gap-3 rounded-t-md bg-action-hover px-8 py-5 text-text-secondary">
              <span className="text-body-1-semibold">Giao cho</span>
              <SelectField
                classname="!flex-[unset] bg-background-body-background"
                placeholder="Chọn môn học"
                options={[
                  { label: "Lập trình hướng đối tượng", value: 1 },
                  { label: "Cơ sở trí tuệ nhân tạo", value: 2 },
                ]}
                onSelect={() => {}}
              />
            </div>

            <div className="flex flex-col px-5 pb-2 text-text-secondary">
              <div className="p-4">
                <Checkbox label="Chọn tất cả" />
              </div>
              <div className="flex flex-wrap gap-0">
                <div className="p-4">
                  {" "}
                  <Checkbox label="Nhóm 1" />
                </div>
                <div className="p-4">
                  {" "}
                  <Checkbox label="Nhóm 2 - Chiều T3" />
                </div>
                <div className="p-4">
                  {" "}
                  <Checkbox label="Nhóm 7 - Sáng T6" />
                </div>
                <div className="p-4">
                  {" "}
                  <Checkbox label="Nhóm 3 - T5_T6" />
                </div>
                <div className="p-4">
                  <Checkbox label="Nhom 4 - T2_T7" />{" "}
                </div>
                <div className="p-4">
                  <Checkbox label="Nhom 4 - T2_T7" />{" "}
                </div>
                <div className="p-4">
                  <Checkbox label="Nhom 4 - T2_T7" />{" "}
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="flex justify-end gap-2">
            <Button variant={"outline"}>Quay lại</Button>
            <Link to="add-questions">
              <Button variant={"contained"} color={"primary"}>
                Tiếp tục thêm câu hỏi
              </Button>
            </Link>
          </div>
        </div>
      </MainContentLayout>
      <RighSidebar />
    </div>
  );
}
