import { Toggle } from "../../atoms/Toggle/Toggle";

export default function RighSidebar() {
  return (
    <div className="w-[300px] bg-background-body-background">
      <div className="text-h6 border-b border-other-outlined-border px-5 py-2 text-text-secondary">
        Cấu hình
      </div>
      <div className="flex flex-col gap-4 px-5 py-2">
        <Toggle label="Đảo câu hỏi" checked={true} />
        <Toggle label="Đảo đáp án" checked={false} />
        <Toggle label="Xem chi tiết kết quả" checked={true} />
        <Toggle label="Giới hạn chuyển tab" checked={true} />
        <Toggle label="Cho phép copy,print" checked={false} />
        <Toggle label="Tự động nộp bài" checked={true} />
        <Toggle label="Chế độ Full Screen" checked={true} />
      </div>
    </div>
  );
}
