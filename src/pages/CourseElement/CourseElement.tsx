import { Button, Icon } from "@/components/atomic/atoms";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import { useState } from "react";

// --- Interfaces ---
interface IStudent {
  id: string;
  name: string;
  avatar: string;
}

interface IClasswork {
  id: string;
  name: string;
  attempts: string;
  percentage?: number;
  score?: string;
  duration?: string;
  status: "completed" | "todo";
}

export default function CourseElement() {
  const [selectedTab, setSelectedTab] = useState("news");

  // --- Data Mockup ---
  const students: IStudent[] = [
    {
      id: "0220",
      name: "0220_Nguyễn Bạch Phú Lộc",
      avatar: "https://ui-avatars.com/api/?name=L&background=random",
    },
    {
      id: "0426",
      name: "0426_Nguyễn Văn Sơn",
      avatar: "https://ui-avatars.com/api/?name=S&background=random",
    },
    {
      id: "caokha",
      name: "Cao Khả",
      avatar: "https://ui-avatars.com/api/?name=K&background=random",
    },
    {
      id: "dann",
      name: "Dânn",
      avatar: "https://ui-avatars.com/api/?name=D&background=random",
    },
    {
      id: "minhquang",
      name: "Đường Hồ Minh Quang",
      avatar: "https://ui-avatars.com/api/?name=Q&background=random",
    },
    {
      id: "tanphat",
      name: "Hà Tấn Phát",
      avatar: "https://ui-avatars.com/api/?name=P&background=3b82f6&color=fff",
    },
  ];

  const classworkData: IClasswork[] = [
    {
      id: "1",
      name: "Kiểm tra kiến thức cơ bản HTML & CSS",
      attempts: "1",
      percentage: 100,
      score: "14 / 14",
      duration: "00:00:12",
      status: "completed",
    },
    { id: "2", name: "Test", attempts: "Unlimited", status: "todo" },
    { id: "3", name: "Test name", attempts: "Unlimited", status: "todo" },
  ];

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
                className="h-full bg-alert-info-content"
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
            <Button variant={"contained"} color={"infor"} size={"medium"}>
              Kết quả
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-fit min-h-screen flex-1 flex-col items-center bg-background-body-background">
      <div className="flex h-fit w-[1200px] flex-col pb-10">
        {/* Sticky Header Tabs */}
        <div className="sticky top-0 z-50 flex justify-between border-b border-other-outlined-border bg-background-body-background px-4">
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
            <div className="animate-in fade-in mt-6 duration-300">
              <div className="relative mb-6 flex h-[240px] w-full items-end overflow-hidden rounded-xl bg-background-section p-8 shadow-md">
                <div className="absolute inset-0 bg-[url('https://www.gstatic.com/classroom/themes/img_graduation.jpg')] bg-cover bg-center opacity-25"></div>
                <div className="absolute inset-0 to-transparent"></div>
                <h1 className="text-h4 relative z-10 tracking-tight text-primary-contrast">
                  LT Web và UDNC_T6/25-26_T1-5
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

                  {/* Mock Post */}
                  <div className="overflow-hidden rounded-md border border-other-outlined-border bg-background-body-background shadow-sm">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-primary-contrast">
                            B
                          </div>
                          <div>
                            <h3 className="text-body-2 font-bold text-text-primary">
                              Bằng Vũ Mai
                            </h3>
                            <p className="text-caption text-text-secondary">
                              Hôm qua
                            </p>
                          </div>
                        </div>
                        <Button size="small" isButtonIcon={true}>
                          <Icon name="moreVertical" />
                        </Button>
                      </div>
                      <div className="text-body-2 mt-4 px-1 text-text-secondary">
                        <p>
                          Những bạn chưa kiểm tra thì vào group này để thầy cho
                          kiểm tra lại
                        </p>
                        <a
                          href="#"
                          className="mt-2 block break-all text-alert-info-content hover:underline"
                        >
                          https://zalo.me/g/nsmvffpj8cmnxkdi9utf
                        </a>
                      </div>
                    </div>
                    <div className="border-t border-other-outlined-border p-2 px-4">
                      <Button size={"small"} className="text-text-secondary">
                        <Icon name="message" /> Thêm nhận xét lớp học
                      </Button>
                    </div>
                  </div>

                  {/* Assignment Item List */}

                  {[
                    {
                      title: "DANH SÁCH ĐIỂM DANH + DK ĐỒ ÁN",

                      date: "17 thg 1, 2024 (Đã chỉnh sửa 19 thg 3)",
                    },

                    {
                      title:
                        "Điểm quá trình + Nộp source + Ôn tập HK2 năm h...",

                      date: "22 thg 5, 2024 (Đã chỉnh sửa 23 thg 5, 2025)",
                    },

                    { title: "Phép tính cơ bản", date: "25 thg 2, 2025" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center justify-between rounded-md border border-other-outlined-border bg-background-body-background p-4 transition-all hover:border-info-background hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-text-secondary text-primary-contrast">
                          <Icon name="clipboard" />{" "}
                          {/* Thay bằng icon bài tập của bạn */}
                        </div>

                        <div>
                          <p className="text-body-2 text-text-primary transition-colors">
                            Nguyen Thanh Sang đã đăng một bài tập mới:{" "}
                            {item.title}
                          </p>

                          <p className="text-caption text-text-secondary">
                            {item.date}
                          </p>
                        </div>
                      </div>

                      <Button size={"small"} isButtonIcon={true}>
                        <Icon name="moreVertical" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLASSWORK */}
          {selectedTab === "classwork" && (
            <div className="animate-in slide-in-from-bottom-2 mt-8 flex justify-center duration-300">
              <div className="w-full overflow-hidden rounded-md border border-other-outlined-border bg-background-body-background shadow-sm">
                <DynamicTable
                  columns={classworkColumns}
                  data={classworkData}
                  rowKey="id"
                />
              </div>
            </div>
          )}

          {/* TAB: EVERYBODY */}
          {selectedTab === "everybody" && (
            <div className="animate-in fade-in mt-10 flex justify-center duration-500">
              <div className="w-full max-w-[800px] space-y-12">
                <section>
                  <div className="mb-6 flex items-center justify-between border-b border-other-outlined-border pb-4">
                    <h2 className="text-h5 font-medium text-text-primary">
                      Giáo viên
                    </h2>
                  </div>
                  <div className="flex cursor-pointer items-center gap-4 rounded-md px-4 py-2 transition-colors hover:bg-action-hover">
                    <img
                      src="https://ui-avatars.com/api/?name=Sang&background=0D9488&color=fff"
                      alt="Teacher"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-body-2 text-text-primary">
                      Nguyen Thanh Sang
                    </span>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center justify-between border-b border-other-outlined-border pb-4">
                    <h2 className="text-h5 font-medium text-text-primary">
                      Bạn học
                    </h2>
                    <span className="text-body-2 text-text-primary">
                      {students.length} sinh viên
                    </span>
                  </div>
                  <div className="divide-y divide-other-divider">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="group flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-action-hover"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-body-2 text-text-primary">
                            {student.name}
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
        </main>
      </div>
    </div>
  );
}
