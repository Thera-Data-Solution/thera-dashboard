
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getGallery,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGalley
} from '@/api/gallery';
import { toast } from 'sonner';

// Query keys
export const galleryKeys = {
    all: ['gallery'] as const,
    lists: () => [...galleryKeys.all, 'list'] as const,
    list: (filters: string) => [...galleryKeys.lists(), { filters }] as const,
    details: () => [...galleryKeys.all, 'detail'] as const,
    detail: (id: string) => [...galleryKeys.details(), id] as const,
};

// Get all gallery
export function useGallery() {
    return useQuery({
        queryKey: galleryKeys.lists(),
        queryFn: getGallery,
    });
}

// Get gallery by ID
export function useGalleryById(id: string) {
    return useQuery({
        queryKey: galleryKeys.detail(id),
        queryFn: () => getGalleryById(id),
        enabled: !!id,
    });
}

// Create gallery
export function useCreateGallery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createGallery(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
            toast.success('Gallery berhasil ditambahkan');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menambahkan gallery');
        },
    });
}

// Update gallery
export function useUpdateGallery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            updateGallery(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: galleryKeys.detail(variables.id) });
            toast.success('Gallery berhasil diupdate');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal mengupdate gallery');
        },
    });
}

// Delete gallery
export function useDeleteGallery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteGalley(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
            toast.success('Gallery berhasil dihapus');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menghapus gallery');
        },
    });
}