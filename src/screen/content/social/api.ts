import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLink,
  deleteLink,
  orderUp,
  orderDown,
  createLinks,
} from "@/api/link";

export function useCreateLink() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return createLinks(data); // atau API createLink jika ada
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useUpdateLink() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateLink(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLink(id),

    // ⭐ Optimistic update
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["links"] });
      const prev = qc.getQueryData(["links"]);

      qc.setQueryData(["links"], (old: any[]) =>
        old.filter((item) => item.id !== id)
      );

      return { prev };
    },
    onError: (_e, _id, ctx) => {
      qc.setQueryData(["links"], ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useOrderUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderUp(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useOrderDown() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderDown(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
  });
}
