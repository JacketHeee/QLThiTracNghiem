/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Icon, Input } from "@/components/atomic/atoms";
import Divider from "@/components/atomic/atoms/Divider/Divider";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import type { TableColumn } from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import DynamicTable from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useEffect, useMemo, useState } from "react";
import StatSection from "@/components/atomic/organisms/StatSection/StatSection";
import { useLocation, useNavigate } from "react-router-dom";
import { useExamStore } from "@/stores/useExamStore";
import {
  getDefaultAvatar,
  getProgressColor,
  getTestsStatus,
  getVariantDeThiWithStatus,
} from "@/utils";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { StatusLabel } from "@/components/atomic/atoms/StatusLabel/StatusLabel";
import {
  useNhomHocPhanDetail,
  useNhomHocPhanSinhViens,
} from "@/hooks/useNhomHocPhan";
import { useExamActions } from "@/hooks/useExamActions";
import { useDoKho } from "@/hooks/useDoKho";
import type { BaiLam, StudentResult } from "@/types";
import { Overlay } from "@/components/atomic/molecules/Overlay/Overlay";
import ExamResultOverview from "@/components/atomic/organisms/ExamResultOverview/ExamResultOverview";
import { useLoadingStore } from "@/stores/useLoading.store";
import { useDeThiDetail } from "@/hooks/useDeThi";

type ViewMode = "user" | "question" | "difficulty";

export default function ResultPage() {
  const [selectedTab, setSelectedTab] = useState<"stat" | "classScore">(
    "classScore"
  );
  const [viewMode, setViewMode] = useState<ViewMode>("user");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const navigate = useNavigate();

  const { testData } = useDeThiStore();
  const { pathname } = useLocation();
  const parts = pathname.split("/");
  // parts sẽ là ["", "tests", "22", "result", "23"]

  console.log(pathname);
  useDeThiDetail(Number(parts[2]) || 0);
  const { nhomHocPhan } = useNhomHocPhanDetail(Number(parts[4]));
  const { sinhViens } = useNhomHocPhanSinhViens(Number(parts[4]));
  const [openResultModal, setOpenResultModal] = useState(false);
  const handleClose = () => setOpenResultModal(false);

  const { examResults } = useExamActions(nhomHocPhan?.id, testData?.id);

  const handleStartExam = () => {
    // Chuyển hướng thẳng vào trang làm bài (mặc định mode là STUDENT)
    useExamStore.getState().mode = "PREVIEW";
    navigate(`/tests/1/take`);
  };

  // --- 1. Cấu hình Cột (Columns) theo ViewMode ---
  const columns = useMemo(() => {
    const ProgressBar = ({
      percent,
      colorClass,
    }: {
      percent: number;
      colorClass: string;
    }) => {
      const [currentWidth, setCurrentWidth] = useState(0);

      useEffect(() => {
        // Kích hoạt animation sau khi component đã mount
        const timer = setTimeout(() => setCurrentWidth(percent), 50);
        return () => clearTimeout(timer);
      }, [percent]);

      return (
        <div className="h-2 w-32 overflow-hidden rounded-full bg-action-focus">
          <div
            className={`h-full transition-all duration-1000 ease-out ${colorClass}`}
            style={{
              width: `${currentWidth}%`,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      );
    };

    // Render chung cho cột phần trăm
    const renderPercent = (val: number) => {
      // Đảm bảo percent luôn hợp lệ
      const percent = Math.min(Math.max(val, 0), 100);
      const colorClass = getProgressColor(percent);

      return (
        <div className="flex items-center gap-2">
          <ProgressBar percent={percent} colorClass={colorClass} />
          <span className="text-body-2 min-w-[35px] font-semibold duration-1000 animate-in fade-in">
            {percent}%
          </span>
        </div>
      );
    };

    if (viewMode === "user") {
      return [
        {
          title: "MSSV",
          key: "username", // SỬA: từ 'mssv' thành 'ma' theo TaiKhoan interface
          render: (val: any, item: StudentResult) => (
            <span>{item.isAverage ? "" : val}</span>
          ),
        },
        {
          title: "Họ tên",
          key: "hoTen",
          render: (val: any, item: StudentResult) => (
            <div className="flex items-center gap-3">
              {!item.isAverage ? (
                <img
                  src={getDefaultAvatar(val)}
                  alt={""}
                  className="h-5 w-5 rounded-full"
                />
              ) : (
                <Icon name={"groupUser"} size={20} />
              )}
              <span
                className={item.isAverage ? "font-bold text-primary-main" : ""}
              >
                {val}
              </span>
            </div>
          ),
        },
        {
          title: "Phần trăm",
          key: "phanTram",
          render: (_val, item: StudentResult) =>
            renderPercent(((item.baiLam?.tongDiem || 0) / 10) * 100),
        },
        {
          title: "Điểm",
          key: "baiLam",
          className: "text-center",
          render: (_, item) => item?.baiLam?.tongDiem || "—",
        },
        {
          title: "Thời gian vào",
          key: "baiLam",
          render: (val: BaiLam) =>
            val?.thoiGianBatDau
              ? new Date(val.thoiGianBatDau).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—",
        },
        {
          title: "Số lần thoát",
          key: "baiLam",
          className: "text-center text-alert-error-main font-bold",
          render: (val: BaiLam) => val?.logBaiLam?.soLanChuyenTab ?? 0,
        },
      ] as TableColumn<StudentResult>[];
    }

    return [
      { title: "STT", key: "stt", className: "w-16" },
      {
        title: viewMode === "difficulty" ? "Mức độ độ khó" : "Nội dung câu hỏi",
        key: "noiDung",
      },
      {
        title: "Tỉ lệ đúng",
        key: "phanTram",
        render: (_, item) => renderPercent(item.phanTram),
      },
      { title: "Điểm trung bình", key: "diem", className: "text-center" },
    ] as TableColumn<any>[];
  }, [viewMode]);

  const { doKhos } = useDoKho();

  const tableData = useMemo(() => {
    const allCauHois = testData?.cau_hois || [];
    const currentBaiLams = examResults?.baiLams || [];
    const validBaiLams = currentBaiLams.filter(
      (bl) => bl.baiLam.status === "DA_NOP"
    );

    // --- 1. MODE: THEO NGƯỜI LÀM (USER) ---
    if (viewMode === "user") {
      let sumScoreExams = 0;

      const data_2 = sinhViens.map((item) => {
        const baiLamSinhVien = validBaiLams.find(
          (i) => i.baiLam.thiSinhId === item.id
        );
        sumScoreExams += Number(baiLamSinhVien?.baiLam.tongDiem) || 0;
        return {
          ...item,
          isAverage: false,
          nhomHocPhan: nhomHocPhan,
          baiLam: baiLamSinhVien?.baiLam,
        } as StudentResult;
      });

      if (sortOrder) {
        data_2.sort((a, b) => {
          const scoreA = Number(a.baiLam?.tongDiem) || 0;
          const scoreB = Number(b.baiLam?.tongDiem) || 0;
          return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
        });
      }

      const avgRow = {
        ...data_2[0],
        id: -1,
        username: "31235600",
        hoTen: "Trung bình lớp",
        isAverage: true,
        baiLam: {
          tongDiem: sumScoreExams / (sinhViens.length || 1),
        },
      } as StudentResult;

      console.log(data_2);

      const result = [avgRow, ...data_2];
      return result;
    }

    // --- 2. MODE: THEO CÂU HỎI (Thống kê tỉ lệ đúng/sai từng câu) ---
    if (viewMode === "question") {
      const questionsData = allCauHois.map((ch, index) => {
        const dapAnDung = ch.cau_tra_lois.find((item) => item.isCorrectAnswer);

        // 2. Đếm số lượng người trả lời đúng
        const correctCount = validBaiLams.filter((bl) => {
          const cauHoiTrongBaiLam = bl.cauHois.find(
            (item) => item.id === ch.id
          );
          return cauHoiTrongBaiLam?.dapAnDaChon === dapAnDung?.id;
        }).length;

        const percent =
          ((correctCount * 1.0) /
            (sinhViens.length !== 0 ? sinhViens.length : 1)) *
          100;

        return {
          id: ch.id,
          stt: index + 1,
          noiDung: ch.noiDungCauHoi,
          phanTram: percent,
          // Điểm TB câu hỏi = % đúng * điểm của câu đó
          diem: ((percent / 100) * Number(ch.diemMacDinh || 1)).toFixed(2),
        };
      });

      if (sortOrder) {
        questionsData.sort((a, b) => {
          return sortOrder === "asc"
            ? a.phanTram - b.phanTram
            : b.phanTram - a.phanTram;
        });
      }

      return questionsData;
    }
    // --- MODE: DIFFICULTY (FIXED HERE) ---
    if (viewMode === "difficulty") {
      const diffData = (doKhos || []).map((dk, index) => {
        const tongSoCau =
          (testData?.cau_hois?.filter((i) => i.doKhoId === dk.id).length || 0) *
          sinhViens.length;

        let tongSoCauDung = 0;

        validBaiLams.forEach((item) => {
          const soCauDungMoiBai = item.cauHois.filter((ch) => {
            const daAnId = ch.cau_tra_lois.find(
              (ctl) => ctl.isCorrectAnswer
            )?.id;
            return ch.doKhoId === dk.id && ch.dapAnDaChon === daAnId;
          }).length;

          tongSoCauDung += soCauDungMoiBai || 0;
        });

        const percent = (tongSoCauDung / (tongSoCau || 1)) * 100;
        return {
          id: `dk-${dk.id}`,
          stt: index + 1,
          noiDung: dk.tenDoKho,
          phanTram: percent,
          diem: (percent / 10).toFixed(2), // Điểm TB hệ 10 của mức độ này
        };
      });

      if (sortOrder) {
        diffData.sort((a, b) => {
          return sortOrder === "asc"
            ? a.phanTram - b.phanTram
            : b.phanTram - a.phanTram;
        });
      }

      return diffData;
    }

    return [];
  }, [
    testData?.cau_hois,
    examResults?.baiLams,
    viewMode,
    sinhViens,
    nhomHocPhan,
    doKhos,
    sortOrder,
  ]);

  const status = getTestsStatus(
    testData?.thoiGianBatDau,
    testData?.thoiGianKetThuc,
    new Date()
  );

  const { reviewExam } = useExamActions();

  const { startLoading, stopLoading } = useLoadingStore();
  const handleViewResult = async (baiLamId: number) => {
    try {
      startLoading();
      // Gọi action review bài thi (đã bao gồm logic setFinalResult vào Store)
      await reviewExam(baiLamId);

      // Sau khi dữ liệu đã vào Store thành công, mở Modal
      setOpenResultModal(true);
    } catch (error) {
      stopLoading();
      console.error("Lỗi khi tải kết quả:", error);
      // Bạn có thể thêm Toast thông báo lỗi ở đây
    } finally {
      stopLoading();
    }
  };

  return (
    <MainContentLayout hasFooter={false} classname="w-full">
      {" "}
      {/* Overview */}
      <div className="flex flex-col rounded-md bg-background-body-background p-8 pb-0">
        <div className="flex-bet-center">
          <div className="text-body-1 flex items-center gap-2 text-alert-info-content">
            <Icon name="testsOverview" />
            <span>Tổng quan</span>
          </div>

          <div className="flex-bet-center gap-3">
            <StatusLabel variant={getVariantDeThiWithStatus(status.status)}>
              {status.label}{" "}
            </StatusLabel>
            <Divider orientation="vertical" />
            <Button
              variant={"outline"}
              size={"small"}
              onClick={handleStartExam}
            >
              <Icon name="play" /> Xem trước
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-3 pb-8 pt-5">
            <div className="flex flex-col gap-2">
              <div className="text-h5 text-text-primary">{testData?.tenDe}</div>
              {/* infor */}
              <div className="flex flex-col gap-2 text-text-secondary">
                <div className="flex items-center gap-1">
                  <Icon name="groupUser" size={20} />
                  <span className="text-body-1">{nhomHocPhan?.tenNhom}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-md bg-background-body-background">
        {/*  */}
        <Tabs
          value={selectedTab}
          onChange={(value) => setSelectedTab(value as "stat" | "classScore")}
          tabs={[
            { value: "classScore", label: "Bảng điểm" },
            { value: "stat", label: "Thống kê" },
          ]}
          className="border-b border-other-outlined-border"
        />

        {/*  */}
        {selectedTab === "classScore" && (
          <div className="border-other-outlined-borde flex justify-between border-b bg-background-body-background px-4 py-3">
            {/* Left */}
            <div className="flex gap-2">
              <SelectField
                placeholder="Lọc theo vai trò"
                options={[
                  { label: "Tất cả", value: 0 },
                  { label: "Sinh viên", value: 3 },
                  { label: "Giảng viên", value: 2 },
                  { label: "Quản trị", value: 1 },
                ]}
                onSelect={(val) => console.log("Filter role:", val)}
                defaultIndex={0}
              />
              <Input
                hasBoder={true}
                placeholder="Tìm kiếm MSSV ..."
                icon={<Icon name="search" className="text-text-disabled" />}
              />
            </div>

            {/* Right */}
            <div className="flex gap-2">
              {/* Sắp xếp tăng dần */}
              <Button
                variant={sortOrder === "asc" ? "contained" : "outline"}
                color={sortOrder === "asc" ? "primary" : "standard"}
                size="small"
                onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
              >
                <Icon name="arrowUp" />
              </Button>

              {/* Sắp xếp giảm dần */}
              <Button
                variant={sortOrder === "desc" ? "contained" : "outline"}
                color={sortOrder === "desc" ? "primary" : "standard"}
                size={"small"}
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? null : "desc")
                }
              >
                <Icon name="up" /> {/* Đổi tên icon cho đúng nghĩa */}
              </Button>

              <Button
                variant={"contained"}
                color={"primary"}
                size={"small"}
                onClick={() => {}}
              >
                <Icon name="document" size={20} />
                Xuất bảng điểm
              </Button>
            </div>
          </div>
        )}

        {/*  */}
        {selectedTab === "classScore" && (
          <div className="flex gap-4 border-b border-other-outlined-border bg-background-body-background px-4 py-3">
            {[
              { id: "user", label: "Theo người làm" },
              { id: "question", label: "Theo câu hỏi" },
              { id: "difficulty", label: "Theo độ khó" },
            ].map((mode) => (
              <Button
                key={mode.id}
                size="medium"
                className={
                  viewMode === mode.id
                    ? "bg-action-selected font-bold text-primary-main"
                    : "text-text-secondary"
                }
                onClick={() => setViewMode(mode.id as ViewMode)}
              >
                {mode.label}
              </Button>
            ))}
          </div>
        )}

        {/* table */}
        {selectedTab === "classScore" && (
          <div
            className="p-4 duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-2"
            key={`${viewMode}-${sortOrder}`}
          >
            <DynamicTable
              columns={columns}
              data={tableData as any}
              key={viewMode}
              rowKey={"id"}
              hasColumnActions={viewMode === "user"}
              className="border border-other-outlined-border"
              getRowClassName={(item) =>
                item.isAverage ? "bg-warning-background" : ""
              }
              renderActions={(item: StudentResult) => {
                if (item.isAverage) return null;

                // 2. Kiểm tra trạng thái bài làm
                const status = item.baiLam?.status;

                if (status === "DA_NOP") {
                  return (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleViewResult(item.baiLam?.id || 0)}
                    >
                      <Icon name="eye" size={16} className="mr-1" />{" "}
                      {/* Thêm icon cho đẹp */}
                      Kết quả
                    </Button>
                  );
                }

                // 3. Nếu đang làm (DANG_LAM)
                if (status === "DANG_LAM") {
                  return (
                    <span className="text-caption rounded bg-warning-background px-2 py-1 font-medium text-warning-main">
                      Đang làm...
                    </span>
                  );
                }

                return (
                  <span className="text-caption font-medium italic text-text-disabled">
                    Chưa tham gia
                  </span>
                );
              }}
            />
          </div>
        )}

        {selectedTab === "stat" && <StatSection key="stat-section" />}
      </div>
      {openResultModal && (
        <Overlay onClose={handleClose}>
          {" "}
          <main className="mb-20 flex max-h-[90vh] w-fit flex-col items-center overflow-y-auto rounded-lg bg-background-body-background px-8 py-8">
            <ExamResultOverview onCancel={handleClose} />
          </main>
        </Overlay>
      )}
    </MainContentLayout>
  );
}
