import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import TestItem from "@/components/atomic/organisms/TestItem/TestItem";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useDeThi } from "@/hooks/useDeThi";
import { useSubject } from "@/hooks/useSubject";
import { useAuthStore } from "@/stores/auth.store";
import type { RoleDetailItem } from "@/types";
import { Link } from "react-router-dom";

export const TestPage = () => {
  const { dethis } = useDeThi();
  const { subjects } = useSubject();
  const pageName = "de_thi";

  const { role } = useAuthStore();
  const roleDetails = !role ? [] : role.role_details;
  const actions = roleDetails
    .filter((item: RoleDetailItem) => item.tenChucNang === pageName)
    .flatMap((item) => {
      const result: string[] = [];

      if (item.canView) result.push("view");
      if (item.canCreate) result.push("create");
      if (item.canUpdate) result.push("update");
      if (item.canDelete) result.push("delete");

      return result;
    });
  return (
    <MainContentLayout>
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}
        <div className="flex gap-2">
          <SelectField
            placeholder="Tất cả"
            options={[
              { label: "Tất cả", value: 1 },
              { label: "Đang mở", value: 2 },
              { label: "Đã đóng", value: 3 },
              {
                label: "Chưa mở",
                value: 4,
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
            label="Môn học"
            placeholder="Chọn môn học"
            options={subjects.map((item) => ({
              label: item.tenMonHoc,
              value: item.id,
            }))}
            onSelect={() => {}}
          />
        </div>

        {/* Right */}
        <div className="flex gap-2">
          <Button variant={"outline"}>
            <Icon name="arrowUpDown" />
          </Button>

          {actions.includes("create") && (
            <Link to="/tests/add">
              <Button variant={"contained"} color={"primary"}>
                <Icon name="plus" size={20} />
                Tạo bài kiểm tra
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {dethis.map((item) => (
          <TestItem key={item.id} data={item} actions={actions} />
        ))}
      </div>
    </MainContentLayout>
  );
};
