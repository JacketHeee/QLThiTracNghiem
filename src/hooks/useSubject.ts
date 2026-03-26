import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/services/api/subject.service";
import type { Subject } from "@/types";

export const useSubjects = () => {
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

  return {
    subjects: query.data || [],
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
