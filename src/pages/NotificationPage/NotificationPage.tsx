import { Button, Icon, Input } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import NotificationItem from "@/components/atomic/molecules/NotificationItem/NotificationItem";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { useState } from "react";
import AddNotificationForm from "@/components/atomic/organisms/AddNotificationForm/AddNotificationForm";

export const NotificationPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  // Mock data mẫu
  const notifications = [
    {
      id: "1",
      title: "Thông báo kiểm tra giữa kỳ - Lớp LT Web",
      sender: "Nguyen Thanh Sang",
      course: "Lập trình hướng đối tượng",
      date: "17:05 08/03/2026",
      status: "Đang mở" as const,
      recipients: [
        { group: "DKP1231", count: 45 },
        { group: "DKP1232", count: 32 },
      ],
    },
    {
      id: "2",
      title: "Cập nhật tài liệu ôn tập chương 3",
      sender: "Bằng Vũ Mai",
      course: "Cơ sở dữ liệu",
      date: "10:00 15/03/2026",
      status: "Bản nháp" as const,
      recipients: [{ group: "DKP1233", count: 132 }],
    },
  ];

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
        {notifications.map((note) => (
          <NotificationItem
            key={note.id}
            title={note.title}
            sender={note.sender}
            course={note.course}
            date={note.date}
            status={note.status}
            recipients={note.recipients}
          />
        ))}
      </div>
    </MainContentLayout>
  );
};
