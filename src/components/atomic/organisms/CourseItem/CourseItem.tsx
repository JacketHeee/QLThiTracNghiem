import { Button, Icon } from "../../atoms";

interface CourseItemProps {
  title?: string;
  teacher?: string;
  avatarUrl?: string;
  className?: string;
  onClick?: () => void;
}

export default function CourseItem({
  title = "LT Web và UDNC_T6/25...",
  teacher = "Nguyen Thanh Sang",
  avatarUrl = "https://i.pravatar.cc/150?u=123", // Ảnh placeholder mẫu
  className = "",
  onClick,
}: CourseItemProps) {
  return (
    <article
      onClick={onClick}
      className={`group relative flex w-[280px] max-w-[320px] flex-col overflow-hidden rounded-xl border border-other-outlined-border bg-background-body-background shadow-sm hover:shadow-lg ${className}`}
    >
      {/* Header Section: Dark Background */}
      <header className="relative h-[105px] cursor-pointer bg-other-tooltip p-4 pr-10 text-primary-contrast">
        <h2 className="text-h6 truncate leading-tight decoration-1 hover:underline">
          {title}
        </h2>
        <p className="text-body-2 mt-1 opacity-90 hover:underline">{teacher}</p>

        {/* Floating Avatar */}
        <div className="absolute -bottom-5 right-4 z-10">
          <div className="h-[74px] w-[74px] overflow-hidden rounded-full border border-other-outlined-border bg-action-active shadow-sm">
            <img
              src={avatarUrl}
              alt={teacher}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </header>

      {/* Body: Empty area for assignments/deadlines */}
      <div className="min-h-[135px] flex-grow cursor-pointer bg-background-body-background p-4">
        {/* Có thể thêm danh sách bài tập sắp tới ở đây */}
        <div className="flex flex-col">
          <span className="text-body-1 font-bold">
            Lập trình web và ứng dụng nâng cao
          </span>{" "}
          <span className="text-body-2 text-text-secondary">
            NĂM HỌC 2022 - HỌC KỲ 2
          </span>
        </div>
      </div>

      {/* Footer: Action Icons */}
      <footer className="flex items-center justify-end gap-0.5 border-t border-other-outlined-border px-2 py-2.5 text-text-secondary">
        <Button size={"small"} isButtonIcon={true}>
          <Icon name="folder" />
        </Button>
        <Button size={"small"} isButtonIcon={true}>
          <Icon name="moreVertical" />
        </Button>
      </footer>
    </article>
  );
}
