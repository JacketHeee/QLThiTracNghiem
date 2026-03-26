import type { TaiKhoan } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token: string | null;
  user: TaiKhoan | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user: TaiKhoan) => void;
  updateUser: (user: Partial<TaiKhoan>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Đăng nhập thành công: Lưu cả token và user
      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      // Cập nhật thông tin cá nhân (ví dụ: đổi avatar, đổi tên)
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Đăng xuất: Xóa sạch dấu vết
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        // Có thể bổ sung điều hướng về trang Login ở đây nếu không dùng router
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage", // Tên key trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
