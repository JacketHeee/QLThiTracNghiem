import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import {
  UserCheck,
  UserPlus,
  UserX,
  BarChart3,
  TrendingDown,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Info,
} from "lucide-react";

// Sử dụng interface rõ ràng cho dữ liệu
interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  textColor: string;
  iconBgColor: string;
}

const statsSummary: StatItem[] = [
  {
    label: "Thí sinh đã nộp",
    value: 7,
    icon: <UserCheck size={20} />,
    textColor: "text-primary-main",
    iconBgColor: "bg-primary-background",
  },
  {
    label: "Thí sinh chưa nộp",
    value: 6,
    icon: <UserPlus size={20} />,
    textColor: "text-warning-main",
    iconBgColor: "bg-warning-background",
  },
  {
    label: "Thí sinh không thi",
    value: 40,
    icon: <UserX size={20} />,
    textColor: "text-error-main",
    iconBgColor: "bg-error-background",
  },
  {
    label: "Điểm trung bình",
    value: 3.81,
    icon: <BarChart3 size={20} />,
    textColor: "text-info-main",
    iconBgColor: "bg-info-background",
  },
  {
    label: "Điểm <= 1",
    value: 0,
    icon: <TrendingDown size={20} />,
    textColor: "text-error-dark",
    iconBgColor: "bg-error-background",
  },
  {
    label: "Điểm <= 5",
    value: 5,
    icon: <ThumbsDown size={20} />,
    textColor: "text-warning-dark",
    iconBgColor: "bg-warning-background",
  },
  {
    label: "Điểm >= 5",
    value: 2,
    icon: <ThumbsUp size={20} />,
    textColor: "text-success-main",
    iconBgColor: "bg-success-background",
  },
  {
    label: "Điểm cao nhất",
    value: 7.33,
    icon: <Trophy size={20} />,
    textColor: "text-primary-dark",
    iconBgColor: "bg-primary-background",
  },
];

const chartData = [
  { name: "<= 1", students: 0 },
  { name: "<= 2", students: 3 },
  { name: "<= 3", students: 0 },
  { name: "<= 4", students: 0 },
  { name: "<= 5", students: 2 },
  { name: "<= 6", students: 1 },
  { name: "<= 7", students: 0 },
  { name: "<= 8", students: 1 },
  { name: "<= 9", students: 0 },
  { name: "<= 10", students: 0 },
];

export default function StatSection() {
  return (
    <div className="flex flex-col gap-6 bg-background-body-background p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsSummary.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between rounded-xl border border-other-outlined-border bg-background-paper p-5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-h5 leading-none text-text-primary">
                {item.value}
              </span>
              <span className="text-overline text-text-secondary">
                {item.label}
              </span>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 ${item.iconBgColor} ${item.textColor}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div className="rounded-2xl border border-other-outlined-border bg-background-paper p-8 shadow-sm">
        <div className="mb-10">
          <h3 className="text-h6 mb-1 flex items-center gap-2 text-text-primary">
            Thống kê điểm thi <Info size={16} className="text-text-disabled" />
          </h3>
          <p className="text-caption text-text-secondary">
            Phân phối số lượng sinh viên theo thang điểm hệ 10
          </p>
        </div>

        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-other-divider)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-caption fill-text-secondary"
                dy={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-caption fill-text-secondary"
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
              />
              <Tooltip
                cursor={{ fill: "var(--color-action-hover)", radius: 4 }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--color-other-tooltip)",
                  color: "white",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="flex flex-col gap-1 rounded-lg bg-other-tooltip p-4">
                        <p className="text-tooltip text-common-white">
                          Thang điểm: {label}
                        </p>
                        <p className="text-body-2-semibold text-common-white">
                          Số sinh viên:{" "}
                          <span className="text-primary-main">
                            {payload[0].value}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="students" barSize={52} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    className={`p-2 ${
                      entry.students > 0
                        ? "fill-primary-main"
                        : "fill-grey-grey-200"
                    }`}
                  />
                ))}
                <LabelList
                  dataKey="students"
                  position="top"
                  offset={12}
                  className="text-subtitle-2 fill-text-primary font-bold"
                  formatter={(val: unknown) => {
                    const value = Number(val);
                    return value > 0 ? value : "";
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-other-outlined-border bg-grey-grey-50 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-primary-main"></div>
            <span className="text-badge-label text-text-secondary">
              Số lượng sinh viên
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
