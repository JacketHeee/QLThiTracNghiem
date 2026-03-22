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

type ViewMode = "user" | "question" | "chapter" | "difficulty";

// 1. Interface cho dữ liệu bảng điểm
interface BaseData {
  id: string | number;
  phanTram: number;
  diem: string;
}

interface UserData extends BaseData {
  mssv: string;
  hoTen: string;
  thoiGianVao: string;
  thoiGianThi: string;
  soLanThoat: number;
  isAverage?: boolean;
}

interface GenericStats extends BaseData {
  stt: number;
  noiDung: string;
}

// mock data
const userModeData = [
  {
    id: "avg",
    mssv: "Average",
    hoTen: "Trung bình hệ thống",
    phanTram: 68,
    diem: "9.5/14",
    thoiGianVao: "-",
    thoiGianThi: "00:45:00",
    soLanThoat: 0.5,
    isAverage: true,
  },
  ...Array.from({ length: 20 }, (_, i) => {
    const percent = Math.floor(Math.random() * 101);
    const score = Math.round((percent / 100) * 14);
    return {
      id: `u${i + 1}`,
      mssv: `20110${400 + i}`,
      hoTen: `Sinh viên ${i + 1}`,
      phanTram: percent,
      diem: `${score}/14`,
      thoiGianVao: "Sat 10 Jan '26",
      thoiGianThi: `00:${10 + i}:${Math.floor(Math.random() * 60)}`,
      soLanThoat: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
    };
  }),
];

const questionModeData = Array.from({ length: 30 }, (_, i) => ({
  id: `q${i + 1}`,
  stt: i + 1,
  noiDung: `Câu hỏi số ${i + 1}: Nội dung kiến thức quan trọng về Frontend và Geospatial...`,
  phanTram: Math.floor(Math.random() * 100),
  diem: (Math.random() * 1).toFixed(1),
}));

const chapters = [
  "Tổng quan HTML5",
  "Cấu trúc CSS3",
  "Flexbox & Grid",
  "Javascript Basic",
  "ES6 & TypeScript",
  "React Component",
  "Hooks & State",
  "API Integration",
  "TerriaJS & Cesium",
  "H3 Index System",
  "Clean Code",
  "Deployment",
];

const chapterModeData = chapters.map((name, i) => ({
  id: `c${i + 1}`,
  stt: i + 1,
  noiDung: `Chương ${i + 1}: ${name}`,
  phanTram: Math.floor(Math.random() * (90 - 40 + 1)) + 40, // Random từ 40-90%
  diem: (Math.random() * (10 - 5) + 5).toFixed(1),
}));

const difficultyLevels = [
  "Nhận biết",
  "Thông hiểu",
  "Vận dụng",
  "Vận dụng cao",
];

const difficultyModeData = difficultyLevels.map((label, i) => {
  // Logic: Nhận biết thường % đúng cao, Vận dụng cao thường % đúng thấp
  const mockPercents = [92, 75, 45, 15];
  return {
    id: `d${i + 1}`,
    stt: i + 1,
    noiDung: label,
    phanTram: mockPercents[i],
    diem: (10 / (i + 1)).toFixed(1),
  };
});

export default function ResultPage() {
  const [selectedTab, setSelectedTab] = useState<"stat" | "classScore">(
    "classScore"
  );
  const [viewMode, setViewMode] = useState<ViewMode>("user");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

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
          key: "mssv",
          render: (val: any, item: UserData) => (
            <span>{item.isAverage ? "" : val}</span>
          ),
        },
        {
          title: "Họ tên",
          key: "hoTen",
          render: (val: any, item: any) => (
            <div className="flex items-center gap-3">
              <Icon name={item.isAverage ? "groupUser" : "user"} size={20} />
              <span className={item.isAverage ? "font-bold" : ""}>{val}</span>
            </div>
          ),
        },
        { title: "Phần trăm", key: "phanTram", render: renderPercent },
        { title: "Điểm", key: "diem", className: "text-center" },
        { title: "Thời gian vào thi", key: "thoiGianVao" },
        {
          title: "Thời gian thi",
          key: "thoiGianThi",
          className: "text-center",
        },
        {
          title: "Số lần thoát",
          key: "soLanThoat",
          className: "text-center text-alert-error-main font-bold",
        },
      ] as TableColumn<UserData>[];
    }

    // Cấu hình chung cho Question, Chapter, Difficulty
    return [
      { title: "STT", key: "stt", className: "w-16" },
      {
        title:
          viewMode === "chapter"
            ? "Nội dung chương"
            : viewMode === "difficulty"
              ? "Mức độ"
              : "Nội dung",
        key: "noiDung",
      },
      { title: "Phần trăm đúng", key: "phanTram", render: renderPercent },
      { title: "Điểm trung bình", key: "diem", className: "text-center" },
    ] as TableColumn<GenericStats | UserData>[];
  }, [viewMode]);

  // --- 2. Mock Data theo từng Mode ---
  const tableData = useMemo(() => {
    let data: any[] = [];

    // Lấy data thô theo mode
    switch (viewMode) {
      case "user":
        data = [...userModeData];
        break;
      case "question":
        data = [...questionModeData];
        break;
      case "chapter":
        data = [...chapterModeData];
        break;
      case "difficulty":
        data = [...difficultyModeData];
        break;
    }

    // Logic Sắp xếp
    if (sortOrder) {
      // Tách dòng Average ra để không bị đảo lộn
      const avgRow = data.find((item) => item.isAverage);
      const otherRows = data.filter((item) => !item.isAverage);

      otherRows.sort((a, b) => {
        // Vì phanTram tỉ lệ thuận với điểm hệ 10, ta sort theo phanTram cho chính xác
        return sortOrder === "asc"
          ? a.phanTram - b.phanTram
          : b.phanTram - a.phanTram;
      });

      return avgRow ? [avgRow, ...otherRows] : otherRows;
    }

    return data;
  }, [viewMode, sortOrder]);
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
            <Button
              variant={"outline"}
              color={"error"}
              size="small"
              className="cursor-default rounded-2xl hover:bg-background-body-background"
            >
              Đã đóng
            </Button>
            <Divider orientation="vertical" />
            <Button variant={"outline"} size={"small"}>
              <Icon name="play" /> Xem trước
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-3 pb-8 pt-5">
            <div className="flex flex-col gap-2">
              <div className="text-h5 text-text-primary">
                Kiểm tra kiến thức cơ bản HTML & CSS
              </div>
              {/* infor */}
              <div className="flex flex-col gap-2 text-text-secondary">
                <div className="flex items-center gap-1">
                  <Icon name="groupUser" size={20} />
                  <span className="text-body-1">DKP1232</span>
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
                onClick={() => {
                  // Logic tính điểm hệ 10 khi xuất file
                  const exportData = tableData.map((item) => ({
                    ...item,
                    diemHe10: (item.phanTram / 10).toFixed(1),
                  }));
                  console.log("Xuất dữ liệu hệ 10:", exportData);
                }}
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
              { id: "chapter", label: "Theo chương" },
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
              data={tableData}
              key={viewMode}
              rowKey={"id"}
              hasColumnActions={viewMode === "user"}
              className="border border-other-outlined-border"
              getRowClassName={(item) =>
                item.isAverage ? "bg-warning-background" : ""
              }
              renderActions={(item) => (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => console.log("Xem chi tiết:", item.mssv)}
                >
                  Kết quả
                </Button>
              )}
            />
          </div>
        )}

        {selectedTab === "stat" && <StatSection key="stat-section" />}
      </div>
    </MainContentLayout>
  );
}

const getProgressColor = (percent: number) => {
  if (percent >= 80) return "bg-alert-success-content"; // Xanh lá (Giỏi/Xuất sắc)
  if (percent >= 65) return "bg-alert-info-content"; // Xanh dương (Khá)
  if (percent >= 50) return "bg-alert-warning-content"; // Vàng/Cam (Trung bình)
  if (percent > 0) return "bg-alert-error-content"; // Đỏ (Yếu/Kém)
  return "bg-text-disabled"; // Xám (Chưa làm bài/0%)
};
