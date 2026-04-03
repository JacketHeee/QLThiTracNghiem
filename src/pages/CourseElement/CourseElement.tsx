import { Button, Icon } from "@/components/atomic/atoms";
import { Overlay } from "@/components/atomic/molecules/Overlay/Overlay";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import ExamResultOverview from "@/components/atomic/organisms/ExamResultOverview/ExamResultOverview";
import { useDeThiSvienNhp } from "@/hooks/useDeThi";
import { useGetNhomWithThongBao } from "@/hooks/useNhomHocPhan";
import { useAuthStore } from "@/stores/auth.store";
import { useExamStore } from "@/stores/useExamStore";
import type { DeThi, ThongBao } from "@/types";
import { getDefaultAvatar, getProgressColor } from "@/utils";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// --- Interfaces ---
// interface IStudent {
//   id: string;
//   name: string;
//   avatar: string;
// }

interface IClasswork {
  id: string;
  name: string;
  attempts: string;
  percentage?: number;
  score?: string;
  duration?: string;
  status: "completed" | "todo";
}

const MOCK_QUESTIONS = [
  {
    id: "q1",
    text: "Những thuộc tính nào sau đây thuộc về mô hình hộp (Box Model) trong CSS? (Chọn nhiều đáp án)",
    options: ["color", "margin", "padding", "display"],
    correctAnswer: ["margin", "padding"],
    type: "multiple",
  },
  {
    id: "q2",
    text: "Thẻ nào được sử dụng để tạo một liên kết (hyperlink) trong HTML?",
    options: ["<link>", "<a>", "<html>", "<href>"],
    correctAnswer: "<a>",
    type: "single",
  },
];

// Mock mảng Thông báo (ThongBao[])
// Mock mảng Thông báo (ThongBao[]) với nội dung chi tiết
// const MOCK_THONG_BAOS: ThongBao[] = [
//   {
//     id: 101,
//     tieuDe: "📢 Nhắc nhở: Nộp báo cáo tiến độ đồ án & Cập nhật link GitHub",
//     noiDung:
//       "Chào các nhóm, thầy nhắc lại hạn chót cập nhật file báo cáo tiến độ và link repository GitHub trên Google Drive là 23h59 tối nay. \n\nNội dung báo cáo cần bao gồm: \n1. Các tính năng đã hoàn thiện (Frontend/Backend). \n2. Danh sách các bug còn tồn đồn. \n3. Kế hoạch chi tiết cho tuần tiếp theo. \n\nSau thời gian này hệ thống sẽ tự động khóa quyền chỉnh sửa để thầy bắt đầu chấm điểm thành phần. Các nhóm gặp khó khăn về kỹ thuật vui lòng nhắn tin trực tiếp cho thầy trước 17h chiều nay.",
//     thoiGianGui: "2026-04-03T08:00:00.000Z",
//     uuTien: 1,
//     status: true,
//     nguoiGuiId: 1,
//     nguoi_gui: {
//       hoTen: "Nguyen Thanh Sang",
//       urlAvatar: null,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } as any,
//   },
//   {
//     id: 102,
//     tieuDe:
//       "📚 Tài liệu chuyên sâu: Next.js 15, Server Components & App Router Patterns",
//     noiDung:
//       "Thầy vừa cập nhật bộ tài liệu tham khảo cho Chương 4: Xây dựng kiến trúc Web hiện đại. \n\nTài liệu bao gồm: \n- Ebook 'Mastering Next.js 15' (Bản tóm tắt tiếng Việt). \n- Video hướng dẫn cấu hình Middleware và Authentication với NextAuth. \n- Source code mẫu áp dụng Clean Architecture và Atomic Design cho dự án thực tế. \n\nCác bạn lưu ý đọc kỹ phần 'Streaming & Suspense' vì đây sẽ là nội dung chính trong buổi thực hành Lab 05 vào thứ 5 tới. Ngoài ra, hãy chuẩn bị sẵn môi trường Node.js phiên bản 20 trở lên để tránh lỗi khi cài đặt các package mới.",
//     thoiGianGui: "2026-04-01T14:30:00.000Z",
//     uuTien: 2,
//     status: true,
//     nguoiGuiId: 1,
//     nguoi_gui: {
//       hoTen: "Nguyen Thanh Sang",
//       urlAvatar: null,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } as any,
//   },
//   {
//     id: 103,
//     tieuDe: "🛠️ Thông báo: Bảo trì hệ thống Lab Online",
//     noiDung:
//       "Hệ thống máy chủ thực hành (Lab Online) sẽ tạm dừng hoạt động để bảo trì và nâng cấp cấu hình từ 02h00 đến 05h00 sáng ngày 05/04/2026. \n\nTrong thời gian này, các bạn sẽ không thể truy cập vào cơ sở dữ liệu dùng chung và các API test. Sau khi nâng cấp, hệ thống sẽ hỗ trợ thêm Docker Compose giúp các bạn triển khai microservices dễ dàng hơn. Rất xin lỗi vì sự bất tiện này.",
//     thoiGianGui: "2026-03-28T22:00:00.000Z",
//     uuTien: 3,
//     status: true,
//     nguoiGuiId: 1,
//     nguoi_gui: {
//       hoTen: "Hệ thống Quản lý",
//       urlAvatar: null,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } as any,
//   },
// ];

// Mock mảng Đề thi (DeThi[])
// const MOCK_DE_THIS: DeThi[] = [
//   {
//     id: 501,
//     tenDe: "Kiểm tra 15p: React Hooks & State",
//     thoiGianLamBai: 15,
//     created_at: "2026-04-02T09:00:00.000Z", // Nằm giữa 2 thông báo trên
//     monThiId: 1,
//     nguoiTaoId: 1,
//     thoiGianBatDau: "2026-04-02T09:00:00.000Z",
//     thoiGianKetThuc: "2026-04-02T10:00:00.000Z",
//     isDeleted: false,
//     updated_at: "2026-04-02T09:00:00.000Z",
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mon_thi: { tenMonHoc: "Lập trình Web nâng cao" } as any,
//     cau_hois: [],
//     nhom_hoc_phans: [],
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     cau_hinh_thi: {} as any,
//   },
//   {
//     id: 502,
//     tenDe: "Bài tập về nhà: Tailwind CSS Layout",
//     thoiGianLamBai: 45,
//     created_at: "2026-03-30T10:00:00.000Z", // Cũ nhất
//     monThiId: 1,
//     nguoiTaoId: 1,
//     thoiGianBatDau: "2026-03-30T10:00:00.000Z",
//     thoiGianKetThuc: "2026-03-31T10:00:00.000Z",
//     isDeleted: false,
//     updated_at: "2026-03-30T10:00:00.000Z",
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mon_thi: { tenMonHoc: "Lập trình Web nâng cao" } as any,
//     cau_hois: [],
//     nhom_hoc_phans: [],
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     cau_hinh_thi: {} as any,
//   },
// ];

export default function CourseElement() {
  const [selectedTab, setSelectedTab] = useState("news");
  const navigate = useNavigate();

  const { answers, violationCount, resetExam } = useExamStore();

  const { id } = useParams();
  const { nhomHocPhan } = useGetNhomWithThongBao(Number(id));
  const thongBaos = nhomHocPhan ? nhomHocPhan.thong_baos : [];
  const deThis = nhomHocPhan ? nhomHocPhan.de_this : [];
  const sinhViens = nhomHocPhan ? nhomHocPhan.sinh_viens : [];
  const giangVien = nhomHocPhan ? nhomHocPhan.giang_vien : null;

  const { user } = useAuthStore();

  const { dethis } = useDeThiSvienNhp(nhomHocPhan?.id, user?.id);
  const deThiOfUser = dethis ? dethis.de_this : [];

  const deThiDisplay: IClasswork[] = deThiOfUser.map((item) => {
    const baiLam = item.bai_lam;

    return {
      id: String(item.id),
      name: item.tenDe,

      // nếu có bài làm thì show, không thì 0 lần làm
      attempts: baiLam ? "1 lần" : "Chưa làm",

      // điểm %
      percentage:
        baiLam?.tongDiem !== null && baiLam?.tongDiem !== undefined
          ? (baiLam.tongDiem / 10) * 100
          : undefined,

      // điểm hiển thị dạng string
      score:
        baiLam?.tongDiem !== null && baiLam?.tongDiem !== undefined
          ? `${baiLam.tongDiem}`
          : undefined,

      // thời gian làm bài (phút)
      duration: item.thoiGianLamBai ? `${item.thoiGianLamBai} phút` : undefined,

      status: baiLam ? "completed" : "todo",
    };
  });

  console.log("id", id);
  console.log("nhomHocPhan", nhomHocPhan);
  console.log("dethis", dethis);

  // Các dữ liệu này sau này Mạnh fetch từ API dựa trên attemptId
  const resultData = {
    score: 1,
    totalPoints: 15,
    percentage: 85,
    duration: "00:00:12",
    dateStarted: "Mon 23 Mar '26 05:51",
    dateFinished: "Mon 23 Mar '26 05:51",
  };

  const handleStartExam = () => {
    // Chuyển hướng thẳng vào trang làm bài (mặc định mode là STUDENT)
    useExamStore.getState().mode = "STUDENT";
    navigate(`/tests/1/take`);
  };

  const [openResultModal, setOpenResultModal] = useState(false);

  // --- Data Mockup ---
  // const students: IStudent[] = [
  //   {
  //     id: "0220",
  //     name: "0220_Nguyễn Bạch Phú Lộc",
  //     avatar: "https://ui-avatars.com/api/?name=L&background=random",
  //   },
  //   {
  //     id: "0426",
  //     name: "0426_Nguyễn Văn Sơn",
  //     avatar: "https://ui-avatars.com/api/?name=S&background=random",
  //   },
  //   {
  //     id: "caokha",
  //     name: "Cao Khả",
  //     avatar: "https://ui-avatars.com/api/?name=K&background=random",
  //   },
  //   {
  //     id: "dann",
  //     name: "Dânn",
  //     avatar: "https://ui-avatars.com/api/?name=D&background=random",
  //   },
  //   {
  //     id: "minhquang",
  //     name: "Đường Hồ Minh Quang",
  //     avatar: "https://ui-avatars.com/api/?name=Q&background=random",
  //   },
  //   {
  //     id: "tanphat",
  //     name: "Hà Tấn Phát",
  //     avatar: "https://ui-avatars.com/api/?name=P&background=3b82f6&color=fff",
  //   },
  // ];

  // const classworkData: IClasswork[] = [
  //   {
  //     id: "1",
  //     name: "Kiểm tra kiến thức cơ bản HTML & CSS",
  //     attempts: "1",
  //     percentage: 100,
  //     score: "14 / 14",
  //     duration: "00:00:12",
  //     status: "completed",
  //   },
  //   { id: "2", name: "Test", attempts: "Unlimited", status: "todo" },
  //   { id: "3", name: "Test name", attempts: "Unlimited", status: "todo" },
  // ];

  // --- Table Configurations ---
  const classworkColumns: TableColumn<IClasswork>[] = [
    {
      title: "Tên bài kiểm tra",
      key: "name",
      className: "w-[45%]",
      render: (_, item) => (
        <div className="flex items-start gap-4 py-2">
          <div className="mt-1">
            <Icon name="documentDuplicate" />
          </div>
          <div>
            <h3 className="text-body-2 font-bold leading-tight text-text-primary">
              {item.name}
            </h3>
            <p className="text-caption mt-1 text-text-secondary">
              Số lần làm: {item.attempts}
            </p>
            {item.status === "todo" && (
              <Button
                className="mt-2"
                size={"medium"}
                color={"success"}
                variant={"contained"}
                onClick={handleStartExam}
              >
                Bắt đầu
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Phần trăm",
      key: "percentage",
      className: "text-center",
      render: (val) =>
        val !== undefined ? (
          <div className="flex items-center justify-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-action-hover">
              <div
                className={`h-full ${getProgressColor(val)}`}
                style={{ width: `${val}%` }}
              ></div>
            </div>
            <span className="text-text-primary">{val}%</span>
          </div>
        ) : null,
    },
    {
      title: "Điểm số",
      key: "score",
    },
    {
      title: "Thời gian làm",
      key: "duration",
      render: (val, item) => (
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-2">{val || ""}</span>
          {item.status === "completed" && (
            <Button
              variant={"contained"}
              color={"success"}
              size={"medium"}
              onClick={() => setOpenResultModal(!openResultModal)}
            >
              Kết quả
            </Button>
          )}
        </div>
      ),
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
  }, [nhomHocPhan]);

  const handleClose = () => setOpenResultModal(false);
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
                  <div className="group flex cursor-pointer items-center gap-4 rounded-lg border border-other-outlined-border bg-background-body-background p-4 shadow-sm transition-all hover:shadow-md">
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
                        <AnnouncementCard data={item as ThongBao} />
                      ) : (
                        <ExamFeedItem data={item as DeThi} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLASSWORK */}
          {selectedTab === "classwork" && (
            <div className="mt-8 flex justify-center duration-300 animate-in slide-in-from-bottom-2">
              <div className="w-full overflow-hidden rounded-md border border-other-outlined-border bg-background-body-background shadow-sm">
                <DynamicTable
                  columns={classworkColumns}
                  data={deThiDisplay}
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
                <ExamResultOverview
                  {...resultData}
                  examTitle="Kiểm tra kiến thức cơ bản HTML & CSS"
                  userName="Nguyễn Hùng Mạnh"
                  attemptId={attemptId}
                  violationCount={violationCount}
                  questions={MOCK_QUESTIONS}
                  userAnswers={answers}
                  textMainAction="Quay lại"
                  onBackToDashboard={() => {
                    resetExam();
                    handleClose();
                  }}
                />
              </main>
            </Overlay>
          )}
        </main>
      </div>
    </div>
  );
}

const AnnouncementCard = ({ data }: { data: ThongBao }) => {
  const authorName = data.nguoi_gui?.hoTen || "Giảng viên";
  const firstLetter = authorName.trim().split(" ").pop()?.charAt(0) ?? "";

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
          <Button size="small" isButtonIcon>
            <Icon name="moreVertical" />
          </Button>
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
