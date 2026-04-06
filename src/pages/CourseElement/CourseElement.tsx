import { Button, Icon } from "@/components/atomic/atoms";
import { Overlay } from "@/components/atomic/molecules/Overlay/Overlay";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import ExamResultOverview from "@/components/atomic/organisms/ExamResultOverview/ExamResultOverview";
import { useDeThiSvienNhp } from "@/hooks/useDeThi";
import { useExamActions } from "@/hooks/useExamActions";
import { useGetNhomWithThongBao } from "@/hooks/useNhomHocPhan";
import { dethiService } from "@/services/api/dethi.service";
import { useAuthStore } from "@/stores/auth.store";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { useLoadingStore } from "@/stores/useLoading.store";
import type {
  DeThi,
  DeThiSvien,
  ErrorResponse,
  ThongBao,
  ThongBaoCreate,
} from "@/types";
import {
  calculateDuration,
  getDefaultAvatar,
  getProgressColor,
  getTestsStatus,
} from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotiThisCourseForm from "@/components/atomic/organisms/NotiThisCourseForm/NotiThisCourseForm";
import {
  useCreateThongBaoNhom,
  useDeleteThongBaoNhom,
} from "@/hooks/useThongBao";
import type { AxiosError } from "axios";
import { useToastStore } from "@/stores/useToast.store";
import {
  Dropdown,
  DropdownItem,
} from "@/components/atomic/molecules/Dropdown/Dropdown";
import { useConfirmStore } from "@/stores/useConfirm.store";

export default function CourseElement() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("news");
  const [now, setNow] = useState(new Date());
  const { showToast } = useToastStore();

  // Cập nhật thời gian mỗi phút để cập nhật trạng thái nút "Bắt đầu"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();

  const { id } = useParams();
  const { nhomHocPhan } = useGetNhomWithThongBao(Number(id));
  const thongBaos = nhomHocPhan ? nhomHocPhan.thong_baos : [];
  const deThis = nhomHocPhan ? nhomHocPhan.de_this : [];
  const sinhViens = nhomHocPhan ? nhomHocPhan.sinh_viens : [];
  const giangVien = nhomHocPhan ? nhomHocPhan.giang_vien : null;

  const { user } = useAuthStore();

  const { dethis } = useDeThiSvienNhp(nhomHocPhan?.id, user?.id);

  const { startLoading, stopLoading } = useLoadingStore();

  const handleStartExam = async (deThiId: number) => {
    startLoading();
    try {
      // 1. Gọi trực tiếp Service hoặc dùng queryClient để lấy data đề thi
      // Chúng ta lấy chi tiết đề để đổ vào Store
      const res = await dethiService.getById(deThiId);

      if (res.data) {
        // 2. Cập nhật vào DeThiStore để trang Introduction có data hiển thị
        useDeThiStore.getState().updateTestData(res.data);

        // 3. Sau khi Store đã có data, mới chuyển trang
        navigate(`/tests/${deThiId}/take`);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin đề thi:", error);
      // Toast: "Không thể tải thông tin đề thi. Vui lòng thử lại."
    } finally {
      stopLoading();
    }
  };

  const [openResultModal, setOpenResultModal] = useState(false);
  // --- Table Configurations ---
  const classworkColumns: TableColumn<DeThiSvien>[] = [
    {
      title: "Tên bài kiểm tra",
      key: "tenDe",
      className: "w-[45%]",
      render: (_, item) => {
        // 1. Tính toán trạng thái một lần duy nhất cho mỗi hàng
        const testStatus = getTestsStatus(
          item.thoiGianBatDau,
          item.thoiGianKetThuc,
          now
        );
        const isOpening = testStatus.status === "OPENING";
        const isUpcoming = testStatus.status === "UPCOMING";

        // 2. Xác định nhãn nút dựa trên trạng thái
        const buttonLabel = isUpcoming
          ? "Chưa mở"
          : isOpening
            ? "Bắt đầu làm"
            : "Quá hạn";

        return (
          <div className="flex items-start gap-4 py-2">
            <div className="mt-1">
              <Icon name="documentDuplicate" />
            </div>
            <div>
              <h3 className="text-body-2 font-bold leading-tight text-text-primary">
                {item.tenDe}
              </h3>
              <p className="text-caption mt-1 text-text-secondary">
                Thời lượng: {item.thoiGianLamBai} phút
              </p>

              {/* Chỉ hiện nút khi chưa làm bài */}
              {!item.bai_lam && (
                <Button
                  className="mt-2"
                  size="medium"
                  color={isOpening ? "primary" : "standard"} // Đổi màu linh hoạt
                  variant="contained"
                  onClick={() => handleStartExam(item.id)}
                  disabled={!isOpening} // Chỉ cho bấm khi đang mở
                >
                  {buttonLabel}
                </Button>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Phần trăm",
      key: "bai_lam",
      className: "text-center",
      render: (_, item) => {
        if (!item.bai_lam) {
          return "---";
        }

        const percent = Math.round(((item.bai_lam.tongDiem || 0) / 10) * 100);

        return (
          <div className="flex items-center justify-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-action-hover">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(percent)}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="min-w-[40px] text-left font-medium text-text-primary">
              {percent}%
            </span>
          </div>
        );
      },
    },
    {
      title: "Điểm số",
      key: "bai_lam",
      className: "text-center",
      render: (_, item) => item.bai_lam?.tongDiem ?? "---",
    },
    {
      title: "Thời gian làm",
      key: "bai_lam",
      className: "text-center",
      render: (_val, item) => {
        if (!item.bai_lam) {
          return "---";
        }

        const duration = calculateDuration(
          item.bai_lam.thoiGianBatDau,
          item.bai_lam.thoiGianNopBai
        );

        const isSubmitted = item.bai_lam.status === "DA_NOP";

        return (
          <div className="flex items-center justify-between gap-4 pl-4">
            <span className="text-body-2 text-text-primary">{duration}</span>

            {isSubmitted && (
              <Button
                variant="contained"
                color="success"
                size="medium"
                onClick={() => {
                  if (item.bai_lam?.id) {
                    handleViewResult(item.bai_lam.id);
                  }
                }}
              >
                {t("common.result")}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // eslint-disable-next-line
  const combinedFeed = useMemo(() => {
    // Lưu ý: Mạnh có thể thay MOCK_THONG_BAOS bằng nhomHocPhan?.thong_baos khi API sẵn sàng
    const rawThongBaos = thongBaos || [];
    const rawDeThis = deThis || [];

    const merged = [
      ...rawThongBaos.map((item) => ({
        ...item,
        feedType: "ANNOUNCEMENT" as const,
      })),
      ...rawDeThis.map((item) => ({ ...item, feedType: "EXAM" as const })),
    ];

    return merged.sort((a, b) => {
      const timeA =
        a.feedType === "ANNOUNCEMENT" ? a.thoiGianGui : a.created_at;
      const timeB =
        b.feedType === "ANNOUNCEMENT" ? b.thoiGianGui : b.created_at;
      return (
        new Date(timeB as string).getTime() -
        new Date(timeA as string).getTime()
      );
    });
  }, [deThis, thongBaos]);

  const handleClose = () => setOpenResultModal(false);

  const [isOpenNotiForm, setIsOpenNotiForm] = useState(false);
  const { reviewExam } = useExamActions();
  const handleViewResult = async (baiLamId: number) => {
    startLoading();
    try {
      // Gọi action review bài thi (đã bao gồm logic setFinalResult vào Store)
      await reviewExam(baiLamId);

      // Sau khi dữ liệu đã vào Store thành công, mở Modal
      setOpenResultModal(true);
    } catch (error) {
      console.error("Lỗi khi tải kết quả:", error);
      // Bạn có thể thêm Toast thông báo lỗi ở đây
    } finally {
      stopLoading();
    }
  };
  const onCloseNotiForm = () => {
    setIsOpenNotiForm(false);
  };
  const { createThongBaoNhom } = useCreateThongBaoNhom();

  const handleSaveCreate = async (formData: ThongBaoCreate) => {
    formData.nhomHocPhanIds = [Number(id)]; // set nhom hiện tại
    startLoading();
    try {
      await createThongBaoNhom(formData);
      showToast(t("message.success.create"), "success");
      onCloseNotiForm();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response?.data?.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          showToast(firstError[0], "error");
        }
      } else {
        showToast(t("message.error.create"), "error");
      }
    } finally {
      stopLoading();
    }
  };

  const { deleteThongBaoNhomAsync } = useDeleteThongBaoNhom(Number(id!));
  const { openConfirm } = useConfirmStore();

  const handleDeleteNotifi = (a: ThongBao) => {
    openConfirm({
      title: t("notificationPage.confirmDeleteTitle"),
      message: t("notificationPage.confirmDeleteMessage"),
      type: "danger",
      onConfirm: async () => {
        startLoading();
        try {
          await deleteThongBaoNhomAsync(a.id);
          showToast(t("message.success.delete"), "success");
          if (typeof onCloseNotiForm === "function") onCloseNotiForm();
        } catch (error: unknown) {
          showToast(t("message.error.delete"), "error");
          throw error;
        } finally {
          stopLoading();
        }
      },
    });
  };

  // Sắp xếp danh sách bài tập cho tab Classwork
  const sortedClasswork = useMemo(() => {
    const rawData = dethis?.de_this || [];

    // Tạo bản sao để tránh mutate mảng gốc và sắp xếp
    return [...rawData].sort((a, b) => {
      const dateA = new Date(a.created_at || a.thoiGianBatDau).getTime();
      const dateB = new Date(b.created_at || b.thoiGianBatDau).getTime();

      return dateB - dateA; // Mới hơn (lớn hơn) đứng trước
    });
  }, [dethis]);

  return (
    <div className="flex h-fit min-h-screen flex-1 flex-col items-center bg-background-body-background">
      <div className="flex h-fit w-[1200px] flex-col pb-10">
        {/* Sticky Header Tabs */}
        <div className="sticky top-0 z-40 flex justify-between border-b border-other-outlined-border bg-background-body-background px-4">
          <Tabs
            value={selectedTab}
            onChange={setSelectedTab}
            tabs={[
              { value: "news", label: "Bảng tin" },
              { value: "classwork", label: "Bài tập trên lớp" },
              { value: "everybody", label: "Mọi người" },
            ]}
          />
          <div className="flex items-center gap-1">
            <Button size={"small"} isButtonIcon={true}>
              <Icon name="folder" />
            </Button>
            <Button size={"small"} isButtonIcon={true}>
              <Icon name="moreVertical" />
            </Button>
          </div>
        </div>

        {/* --- Content Area --- */}
        <main className="px-4">
          {/* TAB: NEWS */}
          {selectedTab === "news" && (
            <div className="mt-6 duration-300 animate-in fade-in">
              <div className="relative mb-6 flex h-[240px] w-full items-end overflow-hidden rounded-xl bg-background-section p-8 shadow-md">
                <div className="absolute inset-0 bg-[url('https://www.gstatic.com/classroom/themes/img_graduation.jpg')] bg-cover bg-center opacity-25"></div>
                <div className="absolute inset-0 to-transparent"></div>
                <h1 className="text-h4 relative z-10 tracking-tight text-primary-contrast">
                  {nhomHocPhan?.tenNhom}
                </h1>
              </div>

              <div className="flex gap-6">
                <aside className="w-1/5">
                  <div className="rounded-md border border-other-outlined-border bg-background-body-background p-4 shadow-sm">
                    <h2 className="text-body-2 mb-2 font-medium text-text-primary">
                      Sắp đến hạn
                    </h2>
                    <p className="text-caption mb-6 text-text-secondary">
                      Tuyệt vời, không có bài tập nào sắp đến hạn!
                    </p>
                    <div className="flex justify-end">
                      <Button color={"infor"} size={"medium"}>
                        Xem tất cả
                      </Button>
                    </div>
                  </div>
                </aside>

                <div className="w-4/5 space-y-4">
                  <div
                    onClick={() => setIsOpenNotiForm(!isOpenNotiForm)}
                    className="group flex cursor-pointer items-center gap-4 rounded-lg border border-other-outlined-border bg-background-body-background p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full group-hover:bg-info-background">
                      <Icon name="edit" className="text-alert-info-content" />
                    </div>
                    <span className="text-body-2 text-text-secondary">
                      Thông báo nội dung nào đó cho lớp học của bạn
                    </span>
                  </div>

                  {/* Render Feed */}
                  {combinedFeed.map((item) => (
                    <div key={`${item.feedType}-${item.id}`}>
                      {item.feedType === "ANNOUNCEMENT" ? (
                        <AnnouncementCard
                          data={item as ThongBao}
                          onDeleteNotifi={handleDeleteNotifi}
                          onCopyNotifi={() => console.log("ừ")}
                        />
                      ) : (
                        <ExamFeedItem data={item as DeThi} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {isOpenNotiForm && (
                <NotiThisCourseForm
                  onClose={() => setIsOpenNotiForm(!isOpenNotiForm)}
                  onSaveCreate={handleSaveCreate}
                  mode="create"
                />
              )}
            </div>
          )}

          {/* TAB: CLASSWORK */}
          {selectedTab === "classwork" && (
            <div className="mt-8 flex justify-center duration-300 animate-in slide-in-from-bottom-2">
              <div className="w-full overflow-hidden rounded-md border border-other-outlined-border bg-background-body-background shadow-sm">
                <DynamicTable
                  columns={classworkColumns}
                  data={sortedClasswork}
                  rowKey="id"
                />
              </div>
            </div>
          )}

          {/* TAB: EVERYBODY */}
          {selectedTab === "everybody" && (
            <div className="mt-10 flex justify-center duration-500 animate-in fade-in">
              <div className="w-full max-w-[800px] space-y-12">
                <section>
                  <div className="mb-6 flex items-center justify-between border-b border-other-outlined-border pb-4">
                    <h2 className="text-h5 font-medium text-text-primary">
                      Giáo viên
                    </h2>
                  </div>
                  <div className="flex cursor-pointer items-center gap-4 rounded-md px-4 py-2 transition-colors hover:bg-action-hover">
                    <img
                      src={getDefaultAvatar(giangVien?.hoTen || "Teacher")}
                      alt="Teacher"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-body-2 text-text-primary">
                      {giangVien?.hoTen}
                    </span>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center justify-between border-b border-other-outlined-border pb-4">
                    <h2 className="text-h5 font-medium text-text-primary">
                      Bạn học
                    </h2>
                    <span className="text-body-2 text-text-primary">
                      {sinhViens.length} sinh viên
                    </span>
                  </div>
                  <div className="divide-y divide-other-divider">
                    {sinhViens.map((sinhVien) => (
                      <div
                        key={sinhVien.id}
                        className="group flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-action-hover"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={getDefaultAvatar(sinhVien.hoTen || "Teacher")}
                            alt={sinhVien.hoTen}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-body-2 text-text-primary">
                            {sinhVien.hoTen}
                          </span>
                        </div>
                        <div className="opacity-0 transition-opacity group-hover:opacity-100">
                          <Button size="small" isButtonIcon={true}>
                            <Icon name="mail" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {openResultModal && (
            <Overlay onClose={handleClose}>
              {" "}
              <main className="mb-20 flex max-h-[90vh] w-fit flex-col items-center overflow-y-auto rounded-lg bg-background-body-background px-8 py-8">
                <ExamResultOverview onCancel={handleClose} />
              </main>
            </Overlay>
          )}
        </main>
      </div>
    </div>
  );
}

const AnnouncementCard = ({
  data,
  onDeleteNotifi,
  onCopyNotifi,
}: {
  data: ThongBao;
  onDeleteNotifi: (thongBao: ThongBao) => void;
  onCopyNotifi: (thongBao: ThongBao) => void;
}) => {
  const authorName = data.nguoi_gui?.hoTen || "Giảng viên";
  const firstLetter = authorName.trim().split(" ").pop()?.charAt(0) ?? "";
  const { user } = useAuthStore();

  return (
    <div className="overflow-hidden rounded-md border border-other-outlined-border bg-background-body-background shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-primary-contrast">
              {firstLetter}
            </div>
            <div>
              <h3 className="text-body-2 font-bold text-text-primary">
                {authorName}
              </h3>
              <p className="text-caption text-text-secondary">
                {new Date(data.thoiGianGui).toLocaleString("vi-VN", {
                  day: "numeric",
                  month: "short",
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </p>
            </div>
          </div>
          {/* <Button size="small" isButtonIcon>
            <Icon name="moreVertical" />
          </Button> */}

          <Dropdown
            align="right"
            trigger={
              <Button size="small" isButtonIcon>
                <Icon name="moreVertical" />
              </Button>
            }
          >
            {user?.id === data.nguoiGuiId && (
              <DropdownItem onClick={() => onDeleteNotifi(data)}>
                Xóa
              </DropdownItem>
            )}

            <DropdownItem onClick={() => onCopyNotifi(data)}>
              Sao chép đường liên kết
            </DropdownItem>
          </Dropdown>
        </div>
        <div className="text-body-2 mt-4 px-1 text-text-secondary">
          <p className="mb-1 font-bold text-text-primary">{data.tieuDe}</p>
          <p className="whitespace-pre-line">{data.noiDung}</p>
        </div>
      </div>
    </div>
  );
};

const ExamFeedItem = ({ data }: { data: DeThi }) => {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-md border border-other-outlined-border bg-background-body-background p-4 transition-all hover:border-info-background hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-text-secondary text-primary-contrast">
          <Icon name="clipboard" />
        </div>
        <div>
          <p className="text-body-2 text-text-primary">
            Hệ thống đã đăng một đề thi mới:{" "}
            <span className="font-bold">{data.tenDe}</span>
          </p>
          <p className="text-caption text-text-secondary">
            {new Date(data.created_at || "").toLocaleDateString("vi-VN")} •{" "}
            {data.thoiGianLamBai} phút
          </p>
        </div>
      </div>
      <Button size="small" isButtonIcon>
        <Icon name="moreVertical" />
      </Button>
    </div>
  );
};
