import { Button } from "../../atoms";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import SelectField from "../../atoms/Select/SelectField";
import { Overlay } from "../../molecules/Overlay/Overlay";
import { TextArea } from "../../molecules/TextArea/TextArea";
import { TextField } from "../../molecules/TextField/TextField";

interface AddNotificationFormProps {
  onClose: () => void;
}

export default function AddNotificationForm({
  onClose,
}: AddNotificationFormProps) {
  return (
    <Overlay onClose={onClose}>
      <div className="flex w-[600px] flex-col rounded-lg bg-background-paper pb-2">
        <div className="text-h6 rounded-md bg-background-body-background px-5 pt-4 text-text-primary">
          Tạo thông báo mới
        </div>
        <div className="flex flex-col gap-5 rounded-md bg-background-body-background p-5 text-text-secondary">
          <TextField
            label="Tiêu đề"
            placeholder="Thông báo khai giảng học kỳ ..."
          />
          {/*  */}
          <TextArea
            label="Nội dung thông báo"
            placeholder="Nhập nội dung thông báo"
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
            <Button variant={"outline"} onClick={onClose}>
              Quay lại
            </Button>
            <Button variant={"contained"} color={"primary"} onClick={onClose}>
              Gửi thông báo
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
