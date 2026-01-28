import searchIcon from "@/assets/icons/search-icon.svg";
import avtIcon from "@/assets/icons/avt-icon.svg";
import ThemeToggle from "../../molecules/ToggleTheme/ToggleTheme";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">
      <div className="flex w-96 items-center gap-3">
        <img src={searchIcon} alt="search" className="h-10 w-10 opacity-50" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full text-sm text-gray-600 placeholder-gray-400 outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 p-0.5">
          <img
            src={avtIcon}
            alt="User Avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
