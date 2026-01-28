import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () =>
        set((state) => {
          const newMode = !state.isDarkMode;
          if (typeof window !== "undefined") {
            document.documentElement.classList.toggle("dark", newMode);
          }
          return { isDarkMode: newMode };
        }),
      setTheme: (isDark) => {
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", isDark);
        }
        set({ isDarkMode: isDark });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);
