import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { PRIMARY_COLORS, useThemeStore } from "@/stores/theme.store";
import {
  CourseGroupForm,
  type CourseGroupFormData,
} from "@/components/atomic/organisms/CourseGroupForm/CourseGroupForm";
import {
  useNhomHocPhan,
  useCreateNhomHocPhan,
  useUpdateNhomHocPhan,
  useDeleteNhomHocPhan,
  useNhomHocPhanOGvien,
} from "@/hooks/useNhomHocPhan";
import { useTranslation } from "react-i18next";
import type {
  ErrorResponse,
  NhomHocPhan,
  NhomHocPhanCreate,
  NhomHocPhanUpdate,
  RoleDetailItem,
  Subject,
} from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/useToast.store";
import type { AxiosError } from "axios";
import { subjectService } from "@/services/api/subject.service";

type CourseStatus = "active" | "hidden";

type GroupDisplay = NhomHocPhan & { status: CourseStatus };
type GroupSection = {
  key: string;
  title: string;
  groups: GroupDisplay[];
};

const withAlpha = (hex: string, alphaHex: string) => {
  if (!hex.startsWith("#") || hex.length !== 7) return hex;
  return `${hex}${alphaHex}`;
};

export function CourseGroupPage() {
  const pageName = "hoc_phan";
  const { user, role } = useAuthStore();
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

  const { nhomHocPhans, isLoading } = useNhomHocPhan();
  const { nhomHocPhanGvien, isLoadingHpGv } = useNhomHocPhanOGvien(user?.id);
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects", "title-resolve"],
    queryFn: async () => {
      const res = await subjectService.getAll();
      return res.data;
    },
  });

  const nhomHocPhanDisplay = useMemo<NhomHocPhan[]>(() => {
    if (!user || !role) return [];

    if (role.tenNhomQuyen === "teacher") {
      return nhomHocPhanGvien;
    } else {
      return nhomHocPhans;
    }
  }, [user, role, nhomHocPhans, nhomHocPhanGvien]);

  const createMutation = useCreateNhomHocPhan();
  const updateMutation = useUpdateNhomHocPhan();
  const deleteMutation = useDeleteNhomHocPhan();
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CourseStatus>("active");
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editFormData, setEditFormData] = useState<null | {
    data: Partial<CourseGroupFormData>;
    groupId?: number;
  }>(null);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const primaryHex =
    PRIMARY_COLORS.find((item) => item.key === primaryColor)?.hex ?? "#fb3311";
  const primaryTint = withAlpha(primaryHex, "20");
  const primaryTintSub = withAlpha(primaryHex, "08");
  const { t } = useTranslation();

  const STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
    { value: "active", label: t("courseGroup.status.active") },
    { value: "hidden", label: t("courseGroup.status.hidden") },
  ];

  const computedGroups = useMemo(() => {
    return nhomHocPhanDisplay.map((group) => ({
      ...group,
      status: group.isHide ? "hidden" : ("active" as CourseStatus),
    }));
  }, [nhomHocPhanDisplay]);

  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, []);

  const filteredGroups = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return computedGroups.filter((group) => {
      if (group.status !== statusFilter) return false;
      if (!keyword) return true;
      const matchName = group.tenNhom.toLowerCase().includes(keyword);
      const matchSubject = group.mon_hoc?.tenMonHoc
        .toLowerCase()
        .includes(keyword);
      return matchName || matchSubject;
    });
  }, [computedGroups, searchValue, statusFilter]);

  const subjectMap = useMemo(
    () =>
      new Map(
        subjects.map((subject) => [
          subject.id,
          { maMonHoc: subject.maMonHoc, tenMonHoc: subject.tenMonHoc },
        ])
      ),
    [subjects]
  );

  const groupedSections = useMemo<GroupSection[]>(() => {
    const sectionsMap = new Map<string, GroupSection>();

    filteredGroups.forEach((group) => {
      const subjectInfo = subjectMap.get(group.monHocId);
      const maMon = subjectInfo?.maMonHoc || group.mon_hoc?.maMonHoc || "---";
      const tenMon =
        subjectInfo?.tenMonHoc || group.mon_hoc?.tenMonHoc || "---";
      const sectionKey = `${group.monHocId}-${group.namHoc}-${group.hocKy}`;

      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          key: sectionKey,
          title: `${maMon} - ${tenMon} - Năm học ${group.namHoc} - Học Kỳ ${group.hocKy}`,
          groups: [],
        });
      }

      sectionsMap.get(sectionKey)?.groups.push(group);
    });

    return Array.from(sectionsMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [filteredGroups, subjectMap]);

  const handleToggleMenu = (groupId: number) => {
    setOpenMenu((prev) => (prev === groupId ? null : groupId));
  };

  const handleToggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleHideGroup = async (groupId: number) => {
    try {
      await updateMutation.mutateAsync({ id: groupId, data: { isHide: true } });
      setOpenMenu(null);
    } catch (error) {
      console.error("Failed to hide group:", error);
    }
  };

  const handleShowGroup = async (groupId: number) => {
    try {
      await updateMutation.mutateAsync({
        id: groupId,
        data: { isHide: false },
      });
      setOpenMenu(null);
    } catch (error) {
      console.error("Failed to show group:", error);
    }
  };

  const handleRemoveGroup = async (groupId: number) => {
    if (!confirm(t("courseGroup.confirmDeleteGroup"))) return;
    try {
      await deleteMutation.mutateAsync(groupId);
      setOpenMenu(null);
    } catch (error) {
      showToast(`Failed to delete group: ${error}`, "error");
    }
  };

  const showToast = useToastStore((s) => s.showToast);

  const handleSave = async (data: CourseGroupFormData) => {
    if (editFormData?.groupId) {
      // Update
      const nhomHocPhanUpdate: NhomHocPhanUpdate = {
        monHocId: data.monHocId,
        tenNhom: data.groupName,
        notes: data.note,
        hocKy: data.semester,
        namHoc: data.academicYear,
        giangVienId: user?.id,
      };

      try {
        await updateMutation.mutateAsync({
          id: editFormData.groupId,
          data: nhomHocPhanUpdate,
        });
        setIsFormOpen(false);
        setEditFormData(null);
        showToast(t("message.success.update"), "success");
      } catch (error: unknown) {
        const err = error as AxiosError<ErrorResponse>;
        if (err.response?.status === 422) {
          //lỗi validate backend
          const errors = err.response?.data?.errors;

          const firstError = Object.values(errors)?.[0];

          if (Array.isArray(firstError)) {
            showToast(t(firstError[0]), "error");
          }
        } else {
          showToast(t("message.error.update"), "error");
        }
      }
    } else {
      const createData: NhomHocPhanCreate = {
        monHocId: data.monHocId,
        tenNhom: data.groupName,
        notes: data.note,
        hocKy: data.semester,
        namHoc: data.academicYear,
        giangVienId: user ? user.id : null,
        isHide: false,
        isDeleted: false,
      };

      try {
        await createMutation.mutateAsync(createData);
        showToast(t("message.success.create"), "success");
        setIsFormOpen(false);
        setEditFormData(null);
      } catch (error: unknown) {
        const err = error as AxiosError<ErrorResponse>;
        if (err.response?.status === 422) {
          //lỗi validate backend
          const errors = err.response?.data?.errors;

          const firstError = Object.values(errors)?.[0];

          if (Array.isArray(firstError)) {
            showToast(t(firstError[0]), "error");
          }
        } else {
          showToast(t("message.error.create"), "error");
        }
      }
    }
  };

  const handleEditGroup = (group: GroupDisplay) => {
    setEditFormData({
      data: {
        monHocId: group.monHocId,
        groupName: group.tenNhom,
        note: group.notes || "",
        subject: group.monHocId.toString(),
        academicYear: group.namHoc,
        semester: group.hocKy,
        giangVienId: group.giangVienId,
        maMoi: group.maMoi || "",
        siSo: group.siSo,
      },
      groupId: group.id,
    });
    setIsFormOpen(true);
  };

  const isProcessing =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const isPageLoading =
    role?.tenNhomQuyen === "teacher" ? isLoadingHpGv : isLoading;

  return (
    <MainContentLayout classname="w-full" hasFooter={false}>
      {isPageLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-text-secondary">
            {t("courseGroup.loadingGroups")}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 px-10 py-2">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-background-body-background px-3 py-2">
              <div className="flex w-full flex-1 items-center gap-2 md:w-auto">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="medium"
                    className="h-10 min-w-[160px] justify-between"
                    onClick={() => setStatusOpen((prev) => !prev)}
                  >
                    {STATUS_OPTIONS.find((item) => item.value === statusFilter)
                      ?.label ?? t("courseGroup.status.label")}
                    <Icon name="arrowDown" className="text-text-disabled" />
                  </Button>

                  {statusOpen && (
                    <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-md border border-other-outlined-border bg-background-body-background p-1 shadow-md">
                      {STATUS_OPTIONS.map((item) => (
                        <Button
                          key={item.value}
                          type="button"
                          variant="text"
                          color="standard"
                          size="small"
                          className={`w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-action-hover ${
                            item.value === statusFilter
                              ? "bg-action-hover text-text-primary"
                              : ""
                          }`}
                          onClick={() => {
                            setStatusFilter(item.value);
                            setStatusOpen(false);
                          }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  hasBoder={true}
                  placeholder={t("courseGroup.search")}
                  icon={<Icon name="search" className="text-text-disabled" />}
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="h-10 w-full flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                {actions.includes("create") && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isProcessing}
                    onClick={() => {
                      setEditFormData(null);
                      setIsFormOpen(true);
                    }}
                  >
                    <Icon name="plus" size={18} />
                    {t("courseGroup.addGroup")}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="space-y-4 rounded-md bg-background-paper p-4">
                {groupedSections.map((section) => {
                  const isCollapsed = collapsedSections[section.key] ?? false;

                  return (
                    <section
                      key={section.key}
                      className="rounded-md border border-other-outlined-border bg-background-body-background"
                    >
                      <div
                        className="flex items-center justify-between gap-2 rounded-t-md px-3 py-2"
                        style={{ backgroundColor: primaryTint }}
                      >
                        <h3 className="text-body-2 font-semibold text-text-primary">
                          {section.title}
                        </h3>
                        <Button
                          variant="outline"
                          color="standard"
                          size="small"
                          isButtonIcon
                          tooltip={
                            isCollapsed
                              ? t("courseGroup.showGroup")
                              : t("courseGroup.hideGroup")
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            handleToggleSection(section.key);
                          }}
                        >
                          <Icon name={isCollapsed ? "eyeOff" : "eye"} />
                        </Button>
                      </div>

                      {!isCollapsed && (
                        <div className="grid gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
                          {section.groups.map((group) => (
                            <div
                              key={group.id}
                              className="rounded-md border border-other-outlined-border shadow-sm"
                              style={{ backgroundColor: primaryTintSub }}
                            >
                              <div className="flex items-center justify-between rounded-t-md bg-background-body-background px-3 py-2">
                                <div className="text-body-2 font-semibold text-text-primary">
                                  {group.tenNhom}
                                </div>

                                <div className="relative">
                                  <Button
                                    variant="outline"
                                    size="small"
                                    isButtonIcon
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleToggleMenu(group.id);
                                    }}
                                  >
                                    <Icon name="settings" />
                                  </Button>

                                  {openMenu === group.id && (
                                    <div
                                      className="absolute right-0 top-full z-10 mt-2 w-56 rounded-md border border-other-outlined-border bg-background-body-background p-1 shadow-md"
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                    >
                                      <Link
                                        to={`/course-group/${group.monHocId}/groups/${group.id}/students`}
                                        className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-action-hover"
                                        onClick={() => setOpenMenu(null)}
                                      >
                                        {t("courseGroup.studentList")}
                                      </Link>

                                      {actions.includes("update") && (
                                        <Button
                                          type="button"
                                          variant="text"
                                          color="standard"
                                          size="small"
                                          className="w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-action-hover"
                                          disabled={isProcessing}
                                          onClick={() => {
                                            setOpenMenu(null);
                                            handleEditGroup(group);
                                          }}
                                        >
                                          {t("courseGroup.editInfo")}
                                        </Button>
                                      )}

                                      <Button
                                        type="button"
                                        variant="text"
                                        color="standard"
                                        size="small"
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-action-hover"
                                        disabled={isProcessing}
                                        onClick={() =>
                                          group.status === "hidden"
                                            ? handleShowGroup(group.id)
                                            : handleHideGroup(group.id)
                                        }
                                      >
                                        {group.status === "hidden"
                                          ? t("courseGroup.showGroup")
                                          : t("courseGroup.hideGroup")}
                                      </Button>

                                      {actions.includes("delete") && (
                                        <Button
                                          type="button"
                                          variant="text"
                                          color="standard"
                                          size="small"
                                          className="w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-action-hover"
                                          disabled={isProcessing}
                                          onClick={() =>
                                            handleRemoveGroup(group.id)
                                          }
                                        >
                                          {t("courseGroup.deleteGroup")}
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 px-3 py-3 text-text-secondary">
                                <div className="text-caption">
                                  {group.notes}
                                </div>
                                <div className="text-caption">
                                  {t("courseGroup.classSizeLabel")} {group.siSo}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              {groupedSections.length === 0 && (
                <div className="rounded-md border border-dashed border-other-outlined-border bg-background-body-background px-4 py-8 text-center text-text-secondary">
                  {t("courseGroup.noGroupsFound")}
                </div>
              )}
            </div>
          </div>

          {isFormOpen && (
            <CourseGroupForm
              initialData={editFormData?.data}
              isSubmitting={isProcessing}
              onCancel={() => {
                setIsFormOpen(false);
                setEditFormData(null);
              }}
              onSave={handleSave}
            />
          )}
        </>
      )}
    </MainContentLayout>
  );
}
