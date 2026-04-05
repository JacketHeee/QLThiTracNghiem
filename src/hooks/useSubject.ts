import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/services/api/subject.service";
import type { Subject } from "@/types";

export const useSubject = () => {
  const queryClient = useQueryClient();

  // Lấy danh sách
  const query = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectService.getAll,
    select: (res) => res.data,
  });

  // Thêm mới
  const createMutation = useMutation({
    mutationFn: subjectService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subjects"] }),
  });

  // Cập nhật
  const updateMutation = useMutation({
    mutationFn: (data: Subject) => subjectService.update(data.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subjects"] }),
  });

  // Xóa
  const deleteMutation = useMutation({
    mutationFn: subjectService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subjects"] }),
  });

  //Lấy với nhóm học phần
  const queryWithGroup = useQuery({
    queryKey: ["subjects", "group"],
    queryFn: subjectService.getAllWithGroup,
    select: (res) => res.data,
  });

  const queryWithChuong = useQuery({
    queryKey: ["subjects", "chuong"],
    queryFn: subjectService.getAllWithChuong,
    select: (res) => res.data,
  });

  return {
    subjects: query.data || [],
    subjectsWithGroup: queryWithGroup.data || [],
    subjectsWithChuong: queryWithChuong.data || [],
    isLoading: query.isLoading,
    createSubject: createMutation.mutate,
    updateSubject: updateMutation.mutate,
    deleteSubject: deleteMutation.mutate,
    isProcessing:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

export const useMonHocOGvien = (id?: number) => {
  const query = useQuery({
    queryKey: ["subjects", "gvien", id],
    queryFn: () => subjectService.getOGvien(id!),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    monHocGvien: query.data || [],
    isLoadingMhGv: query.isLoading,
    isErrorMhGv: query.isError,
    refetch: query.refetch,
  };
};
