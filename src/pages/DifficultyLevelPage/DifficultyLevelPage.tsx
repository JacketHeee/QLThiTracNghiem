import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import { DifficultyLevelForm } from "@/components/atomic/organisms/DifficultyLevelForm/DifficultyLevelForm";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useDoKho } from "@/hooks/useDoKho";
import type { DoKho } from "@/types";
import { useState } from "react";

export default function DifficultyLevelPage() {
  const { doKhos, isLoading } = useDoKho();
  // const [DoKhos, setDoKhos] = useState<DoKho[]>(initialDoKhos);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAction = () => {};

  const columns: TableColumn<DoKho>[] = [
    { title: "Mã độ khó", key: "id" },
    {
      title: "Tên độ khó",
      key: "tenDoKho",
    },
  ];

  return (
    <MainContentLayout>
      {/* Toolbar */}
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex gap-2">
            <SelectField
              placeholder="Chọn tiêu chí"
              defaultIndex={0}
              options={[
                { label: "Theo tên", value: 1 },
                { label: "Theo ID", value: 2 },
              ]}
              onSelect={() => {}}
            />
            <Input
              hasBoder={true}
              placeholder="Tìm kiếm"
              icon={<Icon name="search" className="text-text-disabled" />}
            />
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2">
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={handleOpenAdd}
            >
              <Icon name="plus" size={20} />
              Tạo độ khó mới
            </Button>

            {isModalOpen && (
              <DifficultyLevelForm
                onSave={() => {}}
                onCancel={() => setIsModalOpen(!isModalOpen)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={doKhos}
          rowKey="id"
          hasColumnActions
          onAction={handleAction}
          isLoading={isLoading}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </MainContentLayout>
  );
}
