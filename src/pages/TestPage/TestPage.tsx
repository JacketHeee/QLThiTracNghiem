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

  const { role } = useAuthStore();
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

  const filteredTests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return dethis;

    return dethis.filter((item) => {
      const testName = item.tenDe?.toLowerCase() ?? "";
      const subjectName = item.mon_thi?.tenMonHoc?.toLowerCase() ?? "";
      const subjectCode = item.mon_thi?.maMonHoc?.toLowerCase() ?? "";

      return (
        testName.includes(term) ||
        subjectName.includes(term) ||
        subjectCode.includes(term)
      );
    });
  }, [dethis, searchTerm]);

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
            onSelect={() => {}}
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
            options={subjects.map((item) => ({
              label: item.tenMonHoc,
              value: item.id,
            }))}
            onSelect={() => {}}
          />
        </div>

        {/* Right */}
        <div className="flex gap-2">
          <Button variant={"outline"}>
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
