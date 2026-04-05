import { Button } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { CheckboxGroup } from "@/components/atomic/molecules/CheckboxGroup/CheckboxGroup";
import { DateTimePicker } from "@/components/atomic/molecules/DateTimePicker/DateTimePicker";
import GroupInput from "@/components/atomic/molecules/GroupInput/GroupInput";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import RighSidebar from "@/components/atomic/organisms/RightSidebar/RightSidebar";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useDeThiDetail } from "@/hooks/useDeThi";
import { useSubject } from "@/hooks/useSubject";
import { useAuthStore } from "@/stores/auth.store";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export default function TestFormPage() {
  const location = useLocation();
  const { pathname, state } = location;

  const isEditMode = pathname.includes("/edit");
  const isViewMode = pathname.includes("/view");
  const isAddMode = pathname.includes("/add");

  const navigate = useNavigate();

  const { subjects } = useSubject();
  const { id } = useParams();
  const urlId = id ? Number(id) : null;

  // Lấy dữ liệu và actions từ Store
  const testData = useDeThiStore((s) => s.testData);
  const initTestData = useDeThiStore((s) => s.initTestData);
  const setTestData = useDeThiStore((s) => s.setTestData);
  const updateTestData = useDeThiStore((s) => s.updateTestData);
  const updateCauHinh = useDeThiStore((s) => s.updateCauHinh);
  const resetStore = useDeThiStore((s) => s.resetStore);

  const { user } = useAuthStore();

  // 1. Fetch dữ liệu nếu không phải mode Add
  const { deThi, isLoading } = useDeThiDetail(urlId, {
    enabled: !!urlId && (isEditMode || isViewMode),
  });

  // 2. Logic khởi tạo và đồng bộ
  useEffect(() => {
    // Ưu tiên 1: Nếu quay lại từ trang Questions, tuyệt đối không ghi đè dữ liệu Store
    if (state?.fromQuestions) {
      return;
    }

    // Ưu tiên 2: Nếu là mode Add, reset và init (chỉ chạy khi vào mới)
    if (isAddMode) {
      resetStore();
      initTestData();
      updateTestData({ nguoiTaoId: user?.id || 1 });
      return;
    }

    // Ưu tiên 3: Mode Edit/View và có dữ liệu từ API
    if (deThi && (isEditMode || isViewMode)) {
      const isDifferentId = testData?.id !== urlId;
      const isStoreEmpty = !testData?.tenDe;

      if (isStoreEmpty || isDifferentId) {
        setTestData(deThi);
      }
    }
  }, [
    isEditMode,
    isViewMode,
    deThi,
    initTestData,
    resetStore,
    setTestData,
    isAddMode,
    state?.fromQuestions,
    urlId,
  ]);

  // 3. Logic lọc nhóm học phần (Dùng selector từ store)
  const groupOptions = useMemo(() => {
    const currentSubId = testData?.mon_thi?.id;
    if (!currentSubId) return [];

    const sub = subjects.find((s) => s.id === currentSubId);
    return (
      sub?.nhom_hoc_phans.map((item) => ({
        label: item.tenNhom,
        value: item.id,
      })) || []
    );
  }, [testData?.mon_thi?.id, subjects]);

  // Chặn render khi đang fetch dữ liệu cũ
  if (isLoading && (isEditMode || isViewMode)) return <div>Loading...</div>;

  return (
    <div className="flex flex-1">
      <div className="flex max-h-[90vh] flex-1 overflow-auto">
        <MainContentLayout hasFooter={false} classname="max-w-[800px]">
          <div className="text-h6 rounded-md bg-background-body-background px-5 py-2.5 text-text-secondary">
            {isEditMode
              ? "Chỉnh sửa đề thi"
              : isViewMode
                ? "Chi tiết đề thi"
                : "Tạo mới đề thi"}
          </div>
          <div className="flex flex-col gap-5 rounded-md bg-background-body-background p-5 text-text-secondary">
            {/*  */}
            <TextField
              type="text"
              label="Tên đề thi"
              placeholder="Nhập tên đề thi"
              value={testData?.tenDe || ""}
              onChange={(e) =>
                setTestData({ ...testData, tenDe: e.target.value })
              }
              disabled={isViewMode}
            />

            {/* Thời gian */}
            <div className="flex gap-2">
              <DateTimePicker
                disabled={isViewMode}
                selected={
                  testData?.thoiGianBatDau
                    ? new Date(testData.thoiGianBatDau)
                    : undefined
                }
                label="Thời gian bắt đầu"
                onSelect={(date) =>
                  setTestData({
                    ...testData,
                    thoiGianBatDau: date?.toISOString(),
                  })
                }
              />
              <DateTimePicker
                disabled={isViewMode}
                selected={
                  testData?.thoiGianKetThuc
                    ? new Date(testData.thoiGianKetThuc)
                    : undefined
                }
                label="Thời gian kết thúc"
                onSelect={(date) =>
                  setTestData({
                    ...testData,
                    thoiGianKetThuc: date?.toISOString(),
                  })
                }
              />
            </div>

            <GroupInput
              disabled={isViewMode}
              value={testData?.thoiGianLamBai || ""}
              labelLeft="Thời gian làm bài"
              labelRight="Phút"
              placeholder="00"
              onChange={(e) =>
                setTestData({
                  ...testData,
                  thoiGianLamBai: Number(e.target.value),
                })
              }
            />

            {/*  */}
            <div className="flex flex-col rounded-md border border-other-outlined-border">
              <div className="flex-bet-center gap-3 rounded-t-md bg-action-hover px-8 py-5 text-text-secondary">
                <span className="text-body-1-semibold text-nowrap">
                  Giao cho
                </span>
                <SelectField
                  classname="!flex-[unset] bg-background-body-background"
                  placeholder="Chọn môn học"
                  options={subjects.map((item) => ({
                    label: item.tenMonHoc,
                    value: item.id,
                  }))}
                  value={testData?.mon_thi?.id}
                  onSelect={(val) => {
                    const sub = subjects.find((s) => s.id === val);
                    // Khi đổi môn, reset luôn danh sách nhóm học phần đã chọn trong store
                    setTestData({
                      ...testData,
                      mon_thi: sub,
                      nhom_hoc_phans: [],
                    });
                  }}
                  disabled={isViewMode}
                />
              </div>

              <CheckboxGroup
                options={groupOptions}
                // Lấy mảng ID từ mảng object trong store
                value={testData?.nhom_hoc_phans?.map((item) => item.id) || []}
                disabled={isViewMode}
                onChange={(newIds) => {
                  // Tìm lại các object nhom_hoc_phan tương ứng với các ID đã chọn
                  const currentSub = subjects.find(
                    (s) => s.id === testData?.mon_thi?.id
                  );
                  const selectedGroups =
                    currentSub?.nhom_hoc_phans.filter((g) =>
                      newIds.includes(g.id)
                    ) || [];
                  setTestData({ ...testData, nhom_hoc_phans: selectedGroups });
                }}
              />
            </div>

            {/*  */}
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-other-outlined-border bg-background-body-background pt-4">
              <Button variant={"outline"} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
              <Link to="questions">
                <Button variant={"contained"} color={"primary"}>
                  {isViewMode
                    ? "Xem danh sách câu hỏi"
                    : "Tiếp tục thêm câu hỏi"}
                </Button>
              </Link>
            </div>
          </div>
        </MainContentLayout>
      </div>
      <RighSidebar
        data={testData?.cau_hinh_thi}
        readOnly={isViewMode}
        onChange={(newData) => updateCauHinh(newData)}
      />
    </div>
  );
}
