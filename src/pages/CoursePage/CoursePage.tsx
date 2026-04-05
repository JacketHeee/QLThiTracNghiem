import { Button, Icon, Input } from "@/components/atomic/atoms";
import CourseItem from "@/components/atomic/organisms/CourseItem/CourseItem";
import TestUpload from "@/components/atomic/organisms/TestUpload/TestUpload";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import {
  useJoinNhomHocPhan,
  useNhomHocPhanStudent,
} from "@/hooks/useNhomHocPhan";
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";
import { Link } from "react-router-dom";
import { JoinClassForm } from "../../components/atomic/organisms/JoinGroupForm/JoinClassForm";
import type { ErrorResponse } from "@/types";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

export const CoursePage = () => {
  const { user } = useAuthStore();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleJoin = () => {
    setIsOpenModal(true);
  };

  const onClose = () => {
    setIsOpenModal(false);
  };

  const { t } = useTranslation();
  const { mutateAsync } = useJoinNhomHocPhan(); // load: isPending

  const onSubmit = async (code: string) => {
    try {
      if (!user) return;
      await mutateAsync({
        sinhVienId: user.id,
        maMoi: code,
      });
      alert(t("message.success.create"));
      onClose();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response?.data?.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        }
      } else {
        alert(t("message.error.create"));
      }
    }
  };

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

          <Button variant={"contained"} color={"primary"} onClick={handleJoin}>
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
      {isOpenModal && <JoinClassForm onCancel={onClose} onSubmit={onSubmit} />}
    </MainContentLayout>
  );
};
