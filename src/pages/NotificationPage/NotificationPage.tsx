import { Button, Icon, Input } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import NotificationItem from "@/components/atomic/molecules/NotificationItem/NotificationItem";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { useState } from "react";
import AddNotificationForm from "@/components/atomic/organisms/AddNotificationForm/AddNotificationForm";
import { useThongBao } from "@/hooks/useThongBao";
import type {
  ErrorResponse,
  ThongBaoCreate,
  ThongBaoResponse,
  ThongBaoUpdate,
} from "@/types";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";

export const NotificationPage = () => {
  const { thongBaos } = useThongBao();
  const { t } = useTranslation();
  const { createThongBao, updateThongBao, deleteThongBao, isProcessing } =
    useThongBao();

  const defaultModalState = {
    open: false,
    mode: "none",
    id: undefined,
    selectedItem: null,
  } as const;

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "view" | "update" | "none";
    id: number | undefined;
    selectedItem: ThongBaoResponse | null;
  }>(defaultModalState);

  const closeModal = () => {
    setModalState(defaultModalState);
  };

  const openInsertModal = () => {
    setModalState({
      open: true,
      mode: "create",
      id: undefined,
      selectedItem: null,
    });
  };

  const openUpdateModal = (id: number) => {
    const selectedThongBao =
      thongBaos.find((thongbao) => thongbao.id === id) ?? null;
    setModalState({
      open: true,
      mode: "update",
      id: id,
      selectedItem: selectedThongBao,
    });
  };

  const insert = async (data: ThongBaoCreate) => {
    if (!validateCreate(data)) return;
    try {
      await createThongBao(data);
      alert(t("message.success.create"));
      closeModal();
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

  const updateTB = async (id: number, data: ThongBaoUpdate) => {
    if (!validateUpdate(data)) {
      return;
    }
    try {
      await updateThongBao({ id, data });
      alert(t("message.success.update"));
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response.data.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        }
      } else {
        alert(t("message.error.update"));
      }
    }
  };

  const detailTB = (id: number) => {
    const selectedThongBao =
      thongBaos.find((thongbao) => thongbao.id === id) ?? null;
    setModalState({
      open: true,
      mode: "view",
      id: id,
      selectedItem: selectedThongBao,
    });
  };

  const deleteTB = async (id: number) => {
    const isConfirm = window.confirm("Bạn có chắc muốn xóa?");
    if (!isConfirm) return;
    try {
      await deleteThongBao(id);
      alert(t("message.success.delete"));
      closeModal();
    } catch {
      alert(t("message.error.delete"));
    }
  };

  const validateCreate = (request: ThongBaoCreate): boolean => {
    if (!request.tieuDe || request.tieuDe.trim() === "") {
      alert("Tiêu đề không được để trống");
      return false;
    }

    if (!request.noiDung || request.noiDung.trim() === "") {
      alert("Nội dung không được để trống");
      return false;
    }

    if (!request.nhomHocPhanIds || request.nhomHocPhanIds.length === 0) {
      alert("Vui lòng chọn ít nhất một nhóm học phần");
      return false;
    }

    return true;
  };

  const validateUpdate = (request: ThongBaoUpdate): boolean => {
    if (!request.tieuDe || request.tieuDe.trim() === "") {
      alert("Tiêu đề không được để trống");
      return false;
    }

    if (!request.noiDung || request.noiDung.trim() === "") {
      alert("Nội dung không được để trống");
      return false;
    }

    if (!request.nhomHocPhanIds || request.nhomHocPhanIds.length === 0) {
      alert("Vui lòng chọn ít nhất một nhóm học phần");
      return false;
    }

    return true;
  };

  return (
    <MainContentLayout>
      {/* Xử lý loading ở đây nhen */}
      {isProcessing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          Loading...
        </div>
      )}
      {/* Toolbar: Search & Action */}
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}

        <div className="flex gap-2">
          <SelectField
            placeholder="Chọn môn học"
            defaultIndex={0}
            options={[
              { label: "Tất cả", value: 1 },
              { label: "Đã gửi", value: 2 },
              { label: "Bản nháp", value: 3 },
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
            onClick={() => openInsertModal()}
          >
            <Icon name="plus" size={20} />
            Tạo thông báo mới
          </Button>

          {modalState.open && (
            <AddNotificationForm
              onClose={closeModal}
              onSaveCreate={insert}
              onSaveUpdate={updateTB}
              mode={modalState.mode}
              selectedItem={modalState.selectedItem}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {thongBaos.map((note) => (
          <NotificationItem
            key={note.id}
            data={note}
            onView={(id) => detailTB(id)}
            onEdit={(id) => openUpdateModal(id)}
            onDelete={(id) => deleteTB(id)}
          />
        ))}
      </div>
    </MainContentLayout>
  );
};
