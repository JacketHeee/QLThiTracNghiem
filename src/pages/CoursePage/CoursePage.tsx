import { Button, Icon, Input } from "@/components/atomic/atoms";
import CourseItem from "@/components/atomic/organisms/CourseItem/CourseItem";
import TestUpload from "@/components/atomic/organisms/TestUpload/TestUpload";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useNhomHocPhanStudent } from "@/hooks/useNhomHocPhan";
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";
import { Link } from "react-router-dom";

export const CoursePage = () => {
  const { user } = useAuthStore();
  // console.log(user);

  const { nhomHocPhans } = useNhomHocPhanStudent(user?.id || null);
  console.log(nhomHocPhans);
  const [isOpenHideClass, setIsOpenHideClass] = useState(false);
  return (
    <MainContentLayout hasFooter={false}>
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}
        <div className="flex gap-2">
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

          <Button variant={"contained"} color={"primary"}>
            <Icon name="plus" size={20} />
            Tham gia lớp học mới
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-6 rounded-md px-2 py-2">
        {nhomHocPhans?.map((item) => (
          <Link to={`${item.id}`}>
            <CourseItem data={item} />
          </Link>
        ))}
      </div>

      <div>
        <Button
          color={"primary"}
          className="hover:bg-action-selected"
          onClick={() => setIsOpenHideClass(!isOpenHideClass)}
        >
          Hiển thị các lớp học đã ẩn {"()"}
        </Button>
      </div>
      {isOpenHideClass && (
        <div className="flex flex-wrap gap-x-4 gap-y-6 rounded-md px-2 py-2">
          {/* <CourseItem />
          <CourseItem />
          <CourseItem /> */}
          <TestUpload />
        </div>
      )}
    </MainContentLayout>
  );
};
