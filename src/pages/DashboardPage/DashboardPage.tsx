import { Icon } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { cn } from "@/utils/cn";

// --- Sub-component: Thẻ thống kê nhanh ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ title, value, icon, colorClass, trend }: any) => (
  <div className="flex flex-col justify-between gap-4 rounded-md border border-other-outlined-border bg-background-paper p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className={cn("rounded-lg p-2.5", colorClass)}>
        <Icon name={icon} className="text-primary-contrast" />
      </div>
      {trend && (
        <span
          className={`text-caption ${
            trend > 0
              ? "text-alert-success-content"
              : "text-alert-error-content"
          }`}
        >
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-chip text-text-secondary">{title}</p>
      <h3 className="text-h5 text-text-primary">{value}</h3>
    </div>
  </div>
);

export const DashboardPage = () => {
  return (
    <div className="flex h-fit flex-1 flex-col items-center justify-center bg-background-body-background">
      <div className="flex min-h-screen w-[1200px] flex-col gap-6 bg-background-body-background p-6">
        {/* Header Dashboard */}
        <div className="flex-bet-center">
          <div>
            <h1 className="text-h5 text-text-primary">Tổng quan hệ thống</h1>
            <p className="text-body-2 text-text-secondary">
              Chào mừng bạn quay trở lại, đây là dữ liệu mới nhất hôm nay.
            </p>
          </div>
          <div className="w-[200px]">
            <SelectField
              placeholder="Chọn học kỳ"
              options={[
                { label: "Học kỳ 1 - 2025", value: "1" },
                { label: "Học kỳ 2 - 2025", value: "2" },
              ]}
              onSelect={(val) => console.log(val)}
              defaultIndex={0}
            />
          </div>
        </div>

        {/* Grid Thống kê */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng số sinh viên"
            value="1,284"
            icon="user" // Giả định tên icon trong hệ thống của bạn
            colorClass="bg-alert-error-content"
            trend={12}
          />
          <StatCard
            title="Kỳ thi đang diễn ra"
            value="08"
            icon="calendar"
            colorClass="bg-alert-warning-content"
          />
          <StatCard
            title="Lượt thi hoàn thành"
            value="45,602"
            icon="checkCircle"
            colorClass="bg-alert-success-content"
            trend={5.4}
          />
          <StatCard
            title="Ngân hàng câu hỏi"
            value="12,500"
            icon="question"
            colorClass="bg-alert-info-content"
          />
        </div>

        {/* Nội dung chi tiết */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Biểu đồ hoạt động (Giả lập bằng Div) */}
          <div className="flex flex-col gap-4 rounded-md border border-other-outlined-border bg-background-body-background p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-body-1 font-bold text-text-primary">
                Lưu lượng truy cập hệ thống
              </h3>
              <span className="text-caption italic text-text-secondary">
                7 ngày gần nhất
              </span>
            </div>
            <div className="flex h-[300px] items-end justify-between gap-3 px-2 pt-10">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="group relative flex h-full w-full flex-col items-center justify-end"
                >
                  {/* Tooltip xịn hơn */}
                  <div className="absolute -top-10 z-20 scale-0 transition-all duration-300 group-hover:-top-12 group-hover:scale-100">
                    <div className="relative rounded-lg bg-grey-grey-900 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl">
                      {h * 12} lượt {/* Giả sử số lượt truy cập thực tế */}
                      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-grey-grey-900" />
                    </div>
                  </div>

                  {/* Thanh Bar với Gradient và Bo góc toàn phần */}
                  <div
                    style={{ height: `${h}%` }}
                    className={cn(
                      "relative w-full max-w-[28px] overflow-hidden rounded-t-full transition-all duration-500 ease-out",
                      "bg-gradient-to-t from-primary-main to-primary-light", // Hiệu ứng Gradient
                      "hover:shadow-primary-main/20 hover:from-primary-dark hover:to-primary-main hover:shadow-lg",
                      "cursor-pointer"
                    )}
                  >
                    {/* Hiệu ứng tia sáng chạy dọc thanh bar khi hover */}
                    <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-y-[-100%]" />
                  </div>

                  {/* Label ngày tháng - font mỏng hơn cho tinh tế */}
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-text-primary">
                      {i + 2 === 8 ? "CN" : `T${i + 2}`}
                    </span>
                    {/* Chấm tròn đánh dấu chân cột */}
                    <div className="h-1 w-1 rounded-full bg-other-outlined-border transition-colors group-hover:bg-primary-main" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh sách kỳ thi sắp tới */}
          <div className="flex flex-col gap-4 rounded-md border border-other-outlined-border bg-background-body-background p-6">
            <h3 className="text-body-1 font-bold text-text-primary">
              Kỳ thi sắp tới
            </h3>
            <div className="flex flex-col divide-y divide-other-divider">
              {[
                {
                  name: "Cấu trúc dữ liệu",
                  time: "08:00 - 15/05",
                  status: "Chờ duyệt",
                },
                {
                  name: "Lập trình hướng đối tượng",
                  time: "13:30 - 16/05",
                  status: "Sẵn sàng",
                },
                {
                  name: "Cơ sở dữ liệu",
                  time: "09:00 - 18/05",
                  status: "Sẵn sàng",
                },
                {
                  name: "Mạng máy tính",
                  time: "15:00 - 20/05",
                  status: "Chờ duyệt",
                },
              ].map((exam, i) => (
                <div key={i} className="flex flex-col gap-1 py-4">
                  <span className="text-body-2 font-semibold text-text-primary">
                    {exam.name}
                  </span>
                  <div className="text-caption flex items-center justify-between">
                    <span className="text-text-secondary">{exam.time}</span>
                    <span
                      className={cn(
                        "text-tooltip rounded-full px-2 py-1",
                        exam.status === "Sẵn sàng"
                          ? "bg-success-background text-alert-success-content"
                          : "bg-info-background text-alert-info-content"
                      )}
                    >
                      {exam.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
