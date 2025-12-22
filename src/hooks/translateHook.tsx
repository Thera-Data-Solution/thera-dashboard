import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getTranslate,
    getTranslateById,
    createTranslate,
    updateTranslate,
    deleteTranslate,
    type TranslateQueryParams,
} from '@/api/translate';
import { toast } from 'sonner';

// Query keys
export const translateKeys = {
    all: ['translations'] as const,
    lists: () => [...translateKeys.all, 'list'] as const,
    list: (filters: string) => [...translateKeys.lists(), { filters }] as const,
    details: () => [...translateKeys.all, 'detail'] as const,
    detail: (id: string) => [...translateKeys.details(), id] as const,
};

// Types
export interface TranslateData {
    locale: string;
    namespace: string;
    key: string;
    value: string;
}

export interface TranslateItem extends TranslateData {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}

export type TranslateFilters = TranslateQueryParams;

// Get all translations (with optional filters)
export function useTranslations(filters: TranslateFilters = {}) {
    const filterKey = JSON.stringify(filters ?? {});

    return useQuery({
        queryKey: translateKeys.list(filterKey),
        queryFn: () => getTranslate(filters),
    });
}

// Get translation by ID
export function useTranslationById(id: string) {
    return useQuery({
        queryKey: translateKeys.detail(id),
        queryFn: () => getTranslateById(id),
        enabled: !!id,
    });
}

// Create translation
export function useCreateTranslation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TranslateData) => createTranslate(data as unknown as FormData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: translateKeys.lists() });
            toast.success('Translation berhasil ditambahkan');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menambahkan translation');
        },
    });
}

// Update translation
export function useUpdateTranslation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TranslateData }) =>
            updateTranslate(id, data as unknown as FormData),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: translateKeys.lists() });
            await queryClient.invalidateQueries({ queryKey: translateKeys.detail(variables.id) });
            toast.success('Translation berhasil diupdate');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal mengupdate translation');
        },
    });
}

// Delete translation
export function useDeleteTranslation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTranslate(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: translateKeys.lists() });
            toast.success('Translation berhasil dihapus');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menghapus translation');
        },
    });
}