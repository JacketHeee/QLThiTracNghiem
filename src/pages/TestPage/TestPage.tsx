import { useMemo, useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import TestItem from "@/components/atomic/organisms/TestItem/TestItem";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useDeThi } from "@/hooks/useDeThi";
import { useSubject } from "@/hooks/useSubject";
import { useAuthStore } from "@/stores/auth.store";
import type { RoleDetailItem } from "@/types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const TestPage = () => {
  const { t } = useTranslation();
  const { dethis } = useDeThi();

  const { subjects } = useSubject();
  const pageName = "de_thi";

  const { role, user } = useAuthStore();

  const roleDetails = !role ? [] : role.role_details;
  const actions = roleDetails
    .filter((item: RoleDetailItem) => item.tenChucNang === pageName)
    .flatMap((item) => {
      const result: string[] = [];

      if (item.canView) result.push("view");
      if (item.canCreate) result.push("create");
      if (item.canUpdate) result.push("update");
      if (item.canDelete) result.push("delete");

      return result;
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<number | string>(-1);
  const [statusFilter, setStatusFilter] = useState<number>(1); // 1: Tất cả
  const [isDesc, setIsDesc] = useState(true);

  console.log(user?.id);
  console.log(dethis);
  const myDeThis = (dethis || []).filter(
    (i) => i.nguoiTaoId === (user?.id || 3)
  );
  console.log(myDeThis);
  // LOGIC LỌC VÀ SẮP XẾP CHÍNH XÁC THEO INTERFACE
  const filteredTests = useMemo(() => {
    let result = myDeThis;

    // 1. Lọc theo từ khóa tìm kiếm (Tên đề, Tên môn, Mã môn)
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((item) => {
        const testName = item.tenDe?.toLowerCase() ?? "";
        // Truy cập qua relation mon_thi: Subject
        const subjectName = item.mon_thi?.tenMonHoc?.toLowerCase() ?? "";
        const subjectCode = item.mon_thi?.maMonHoc?.toLowerCase() ?? "";

        return (
          testName.includes(term) ||
          subjectName.includes(term) ||
          subjectCode.includes(term)
        );
      });
    }

    // 2. Lọc theo ID môn học (Sử dụng monThiId từ DeThi interface)
    if (selectedSubject !== -1) {
      result = result.filter(
        (item) => item.monThiId === Number(selectedSubject)
      );
    }

    // 3. Lọc theo trạng thái thi (Upcoming, Opening, Closed)
    if (statusFilter !== 1) {
      const now = new Date().getTime();
      result = result.filter((item) => {
        const start = new Date(item.thoiGianBatDau).getTime();
        const end = new Date(item.thoiGianKetThuc).getTime();

        if (statusFilter === 2) return now >= start && now <= end; // OPENING
        if (statusFilter === 3) return now > end; // CLOSED
        if (statusFilter === 4) return now < start; // UPCOMING
        return true;
      });
    }

    // 4. Sắp xếp theo created_at (Mới nhất lên đầu nếu isDesc = true)
    result.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return isDesc ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [myDeThis, searchTerm, selectedSubject, statusFilter, isDesc]);
  return (
    <MainContentLayout>
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}
        <div className="flex gap-2">
          <SelectField
            placeholder={t("testPage.filter.all")}
            options={[
              { label: t("testPage.filter.all"), value: 1 },
              { label: t("testPage.filter.opening"), value: 2 },
              { label: t("testPage.filter.closed"), value: 3 },
              {
                label: t("testPage.filter.notOpened"),
                value: 4,
              },
            ]}
            onSelect={(opt) => setStatusFilter(Number(opt))}
          />
          <Input
            hasBoder={true}
            placeholder={t("testPage.searchPlaceholder")}
            icon={<Icon name="search" className="text-text-disabled" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SelectField
            label={t("testPage.subject")}
            placeholder={t("testPage.selectSubjectPlaceholder")}
            options={[
              { label: "Tất cả", value: -1 },
              ...subjects.map((item) => ({
                label: item.tenMonHoc,
                value: item.id,
              })),
            ]}
            onSelect={(opt) => setSelectedSubject(opt)}
          />
        </div>

        {/* Right */}
        <div className="flex justify-center gap-2">
          <Button
            variant={!isDesc ? "outline" : "contained"}
            color={!isDesc ? "standard" : "primary"}
            onClick={() => setIsDesc(!isDesc)}
            tooltip="Mới nhất"
          >
            <Icon name="arrowUpDown" />
          </Button>

          {actions.includes("create") && (
            <Link to="/tests/add">
              <Button variant={"contained"} color={"primary"}>
                <Icon name="plus" size={20} />
                {t("testPage.addNew")}
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {filteredTests.map((item) => (
          <TestItem key={item.id} data={item} actions={actions} />
        ))}
      </div>
    </MainContentLayout>
  );
};
