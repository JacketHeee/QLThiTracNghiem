import searchIcon from "@/assets/icons/search-icon.svg";

export const DashboardPage = () => {
  return (
    <div className="animate-fade-in flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-2xl bg-[#EEF2FF] p-8 text-center">
      <h1 className="mb-3 text-2xl font-bold leading-tight text-[#5B4DFB] md:text-3xl">
        Xin chào, <br />
        chúng tôi có thể giúp gì cho bạn?
      </h1>
      <p className="mb-8 max-w-md text-sm text-gray-500">
        Hoặc chọn một danh mục để tìm kiếm nhanh nội dung cần thiết.
      </p>

      <div className="group relative w-full max-w-xl">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 transition-opacity group-focus-within:opacity-100">
          <img src={searchIcon} className="h-5 w-5" alt="Search" />
        </div>
        <input
          type="text"
          placeholder="Nhập câu hỏi hoặc từ khóa tìm kiếm..."
          className="h-12 w-full rounded-xl border border-transparent bg-white pl-12 pr-4 text-sm placeholder-gray-400 shadow-sm transition-all focus:border-[#5B4DFB] focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30"
        />
      </div>
    </div>
  );
};
