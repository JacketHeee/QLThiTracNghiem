import { Button, Icon, Input } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import NotificationItem from "@/components/atomic/molecules/NotificationItem/NotificationItem";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { useState } from "react";
import AddNotificationForm from "@/components/atomic/organisms/AddNotificationForm/AddNotificationForm";
import { useThongBao } from "@/hooks/useThongBao";

export const NotificationPage = () => {
  const { thongBaos } = useThongBao();
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <MainContentLayout>
      {/* Toolbar: Search & Action */}
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}

        <div className="flex gap-2">
          <SelectField
            placeholder="Chọn môn học"
            defaultIndex={0}
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Đã gửi", value: "sended" },
              { label: "Bản nháp", value: "draft" },
            ]}
            onSelect={() => {}}
          />
          <Input
            hasBoder={true}
            placeholder="Tìm kiếm"
            icon={<Icon name="search" className="text-text-disabled" />}
          />
        </div>

        {/* Right */}
        <div className="flex gap-2">
          <Button variant={"outline"}>
            <Icon name="arrowUpDown" />
          </Button>

          <Button
            variant={"contained"}
            color={"primary"}
            onClick={() => setIsOpenModal(!isOpenModal)}
          >
            <Icon name="plus" size={20} />
            Tạo thông báo mới
          </Button>

          {isOpenModal && (
            <AddNotificationForm onClose={() => setIsOpenModal(false)} />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {thongBaos.map((note) => (
          <NotificationItem key={note.id} data={note} />
        ))}
      </div>
    </MainContentLayout>
  );
};
