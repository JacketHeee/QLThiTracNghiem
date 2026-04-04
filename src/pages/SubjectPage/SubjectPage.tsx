import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import { SubjectForm } from "@/components/atomic/organisms/SubjectForm/SubjectForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import type { RoleDetailItem, Subject } from "@/types";
import { useSubject } from "@/hooks/useSubject";
import { useAuthStore } from "@/stores/auth.store";

export const SubjectPage = () => {
  const { t } = useTranslation("common");

  const pageName = "mon_hoc";

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
  const { subjects, isLoading, createSubject, updateSubject, deleteSubject } =
    useSubject();

  const columns: TableColumn<Subject>[] = [
    { title: t("subjectPage.table.code"), key: "maMonHoc" },
    {
      title: t("subjectPage.table.name"),
      key: "tenMonHoc",
    },
    {
      title: t("subjectPage.table.credits"),
      key: "soTinChi",
      className: "text-center",
    },
    {
      title: t("subjectPage.table.theoryPeriods"),
      key: "soTietLyThuyet",
      className: "text-center",
    },
    {
      title: t("subjectPage.table.practicePeriods"),
      key: "soTietThucHanh",
      className: "text-center",
    },
  ];

  // const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("tenMonHoc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Or any other number you prefer

  const filteredData = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return subjects.filter((item) => {
      if (filterCriteria === "tenMonHoc") {
        return item.tenMonHoc.toLowerCase().includes(lowercasedFilter);
      }
      if (filterCriteria === "maMonHoc") {
        return item.maMonHoc.toLowerCase().includes(lowercasedFilter);
      }
      return true;
    });
  }, [searchTerm, subjects, filterCriteria]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleOpenAdd = () => {
    setEditingSubject(null); // Reset về null để form hiểu là thêm mới
    setIsModalOpen(true);
  };

  const handleAction = (action: string, item: Subject) => {
    if (action === "edit" || action === "detail") {
      setEditingSubject(item); // Dữ liệu dòng này sẽ được truyền vào initialData của Form
      setIsModalOpen(true);
    } else if (action === "remove") {
      if (
        window.confirm(
          t("subjectPage.confirmDelete", { subjectName: item.tenMonHoc })
        )
      ) {
        deleteSubject(item.id); // Gọi API Delete thực tế
      }
    }
  };

  const handleSave = (data: Subject) => {
    if (editingSubject) {
      // Trường hợp Sửa
      updateSubject(data);
    } else {
      // Trường hợp Thêm mới (loại bỏ id: 0 để backend tự sinh nếu cần)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...payload } = data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createSubject(payload as any);
    }
    setIsModalOpen(false);
    setEditingSubject(null);
  };
  return (
    <MainContentLayout>
      {/* Toolbar */}
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex w-1/2 gap-2">
            <SelectField
              placeholder={t("subjectPage.filter.placeholder")}
              defaultIndex={0}
              options={[
                { label: t("subjectPage.filter.byName"), value: "tenMonHoc" },
                { label: t("subjectPage.filter.byCode"), value: "maMonHoc" },
              ]}
              onSelect={(value) => {
                if (value) {
                  setFilterCriteria(value as string);
                  setCurrentPage(1);
                }
              }}
              classname="min-w-max"
            />
            <Input
              hasBoder={true}
              placeholder={t("courseGroup.search")}
              icon={<Icon name="search" className="text-text-disabled" />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2">
            {actions.includes("create") && (
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={handleOpenAdd}
              >
                <Icon name="plus" size={20} />
                {t("subjectPage.addNew")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={currentData}
          rowKey="maMonHoc"
          hasColumnActions
          onAction={handleAction}
          isLoading={isLoading}
          checkActions={actions}
        />
        {isModalOpen && (
          <SubjectForm
            key={editingSubject?.id}
            initialData={editingSubject}
            onSave={handleSave}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingSubject(null);
            }}
          />
        )}
      </div>
    </MainContentLayout>
  );
};
