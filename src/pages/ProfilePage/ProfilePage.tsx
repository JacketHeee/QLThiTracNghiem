import { useState } from "react";
import { Mail, Phone, Camera, MapPin, Globe, CheckCircle2 } from "lucide-react";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import { Button } from "@/components/atomic/atoms";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";

// --- Interfaces ---
export interface TaiKhoan {
  id: number;
  ma: string;
  username: string;
  hoTen: string;
  email: string;
  nhomQuyenId: number;
  sdt: string;
  ngaySinh: string;
  laGioiTinhNu: boolean;
  ggid: string | null;
  urlAvatar: string | null;
  isStudent: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  lastLogin: string;
  created_at: string;
  updated_at: string;
}

// --- Main Component ---
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // Mock data mapping đúng interface TaiKhoan
  const user: TaiKhoan = {
    id: 1,
    ma: "NDT15_HMANH",
    username: "manh.nguyenhung",
    hoTen: "Nguyễn Hùng Mạnh",
    email: "manh.nguyen@ndt15.vn",
    nhomQuyenId: 1,
    sdt: "0987 654 321",
    ngaySinh: "17/04/2000",
    laGioiTinhNu: false,
    ggid: null,
    urlAvatar: null,
    isStudent: true,
    isLocked: false,
    isDeleted: false,
    lastLogin: "2026-04-03",
    created_at: "2025-12-01",
    updated_at: "2026-04-01",
  };

  return (
    <div className="min-h-screen w-full bg-background-body">
      {/* HEADER SECTION */}
      <div className="w-full bg-background-body-background shadow-sm">
        <div className="mx-auto w-full max-w-5xl">
          {/* Profile Bar */}
          <div className="flex flex-col items-center px-6 md:flex-row md:gap-6">
            <div className="relative py-4">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background-paper bg-grey-grey-200 shadow-md">
                <img
                  src={
                    user.urlAvatar ||
                    `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`
                  }
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <Button className="absolute bottom-2 right-2 rounded-full border border-other-outlined-border p-2 shadow hover:bg-action-hover">
                <Camera size={18} className="text-text-primary" />
              </Button>
            </div>
            <div className="mt-4 flex-1 text-center md:mb-4 md:text-left">
              <h1 className="text-h6 font-bold uppercase text-text-primary">
                {user.hoTen}
              </h1>
              <p className="text-body-2 text-text-secondary">
                @{user.username}
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onChange={(item) => setActiveTab(item as "info" | "password")}
            tabs={[
              { value: "info", label: " Thông tin tài khoản" },
              { value: "password", label: "Đổi mật khẩu" },
            ]}
          />
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-start gap-6 px-6 pb-20 md:flex-row">
        {/* Sidebar trái - Giới thiệu */}
        <div className="w-full shrink-0 md:w-[320px]">
          <div className="rounded-xl border border-other-outlined-border bg-background-paper p-6 shadow-sm">
            <h3 className="text-h6 mb-5 font-bold text-text-primary">
              Giới thiệu
            </h3>
            <div className="space-y-4">
              <div className="text-body-2 flex items-center gap-3 text-text-secondary">
                <Mail size={18} className="text-text-disabled" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="text-body-2 flex items-center gap-3 text-text-secondary">
                <Phone size={18} className="text-text-disabled" />
                <span>{user.sdt}</span>
              </div>
              <div className="text-body-2 flex items-center gap-3 text-text-secondary">
                <MapPin size={18} className="text-text-disabled" />
                <span>TP. Hồ Chí Minh</span>
              </div>
              <div className="text-body-2 flex items-center gap-3 text-text-secondary">
                <Globe size={18} className="text-text-disabled" />
                <a
                  href="https://facebook.com/manh"
                  className="text-alert-info-content hover:underline"
                >
                  facebook.com/manh
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content phải - Chi tiết */}
        <div className="w-full flex-1">
          <div className="rounded-xl border border-other-outlined-border bg-background-body-background p-8 shadow-sm">
            {activeTab === "info" ? (
              <div className="min-w-[600px] space-y-4 duration-500 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-other-divider pb-5">
                  <h2 className="text-h6 font-bold text-text-primary">
                    Chi tiết tài khoản
                  </h2>
                  <CheckCircle2
                    className="text-alert-success-content"
                    size={24}
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  <TextField label="Họ và tên" value={user.hoTen} readOnly />
                  <TextField label="Mã định danh" value={user.ma} readOnly />
                  <TextField
                    label="Email liên hệ"
                    value={user.email}
                    readOnly
                  />
                  <TextField label="Số điện thoại" value={user.sdt} readOnly />
                  <TextField label="Ngày sinh" value={user.ngaySinh} readOnly />

                  <div className="flex flex-col gap-1">
                    <label className="text-body-2-semibold text-text-secondary">
                      Giới tính
                    </label>
                    <div className="text-body-2 py-2 font-medium text-text-primary">
                      {user.laGioiTinhNu ? "Nữ" : "Nam"}
                    </div>
                  </div>

                  <div className="mt-2 rounded-lg border border-success-background bg-success-background p-3 md:col-span-2">
                    <p className="text-caption font-bold uppercase tracking-widest text-alert-success-content">
                      TRẠNG THÁI HỆ THỐNG
                    </p>
                    <p className="text-body-2 mt-1.5 leading-relaxed text-text-primary">
                      Tài khoản của bạn đang hoạt động bình thường trên hệ thống{" "}
                      <strong>NDT15</strong>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Phần đổi mật khẩu giữ nguyên logic của bạn */
              <div className="min-w-[600px] space-y-4 duration-500 animate-in slide-in-from-right-4">
                <div className="border-b border-other-divider pb-4">
                  <h2 className="text-h6 font-bold text-text-primary">
                    Bảo mật & Mật khẩu
                  </h2>
                  <p className="text-helper-text mt-1 text-text-secondary">
                    Vui lòng không chia sẻ mật khẩu cho bất kỳ ai.
                  </p>
                </div>
                <form
                  className="space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <TextField
                    type="password"
                    label="Mật khẩu hiện tại"
                    placeholder="••••••••"
                  />
                  <div className="h-px w-full bg-other-divider"></div>
                  <TextField
                    type="password"
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <TextField
                    type="password"
                    label="Xác nhận mật khẩu mới"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      className="font-bold"
                    >
                      Cập nhật mật khẩu
                    </Button>
                    <Button
                      variant="outline"
                      color="standard"
                      size="large"
                      className="font-bold"
                    >
                      Hủy bỏ
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
