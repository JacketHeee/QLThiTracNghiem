import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import TestItem from "@/components/atomic/organisms/TestItem/TestItem";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { Link } from "react-router-dom";

export const TestPage = () => {
  return (
    <MainContentLayout>
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}
        <div className="flex gap-2">
          <SelectField
            placeholder="Tất cả"
            options={[
              { label: "Tất cả", value: "math" },
              { label: "Đang mở", value: "physics" },
              { label: "Đã đóng", value: "chemistry" },
              {
                label: "Chưa mở",
                value: "chemistry",
              },
            ]}
            onSelect={() => {}}
          />
          <Input
            hasBoder={true}
            placeholder="Tìm kiếm"
            icon={<Icon name="search" className="text-text-disabled" />}
          />
          <SelectField
            placeholder="Chọn môn học"
            options={[
              { label: "Lập trình hướng đối tượng", value: "math" },
              { label: "Lập trình web và ứng dụng", value: "physics" },
              { label: "Cơ sở trí tuệ nhân tạo", value: "chemistry" },
              {
                label: "Phân tích thiết kế hướng đối tượng",
                value: "chemistry",
              },
              { label: "Cơ sở dữ liệu", value: "chemistry" },
            ]}
            onSelect={() => {}}
          />
        </div>

        {/* Right */}
        <div className="flex gap-2">
          <Button variant={"outline"}>
            <Icon name="arrowUpDown" />
          </Button>

          <Link to="/tests/add">
            <Button variant={"contained"} color={"primary"}>
              <Icon name="plus" size={20} />
              Tạo bài kiểm tra
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <TestItem />
        <TestItem />
        <TestItem />
        <TestItem />
        <TestItem />
        <TestItem />
        <TestItem />
      </div>
    </MainContentLayout>
  );
};
