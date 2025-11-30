
import { createTenant, deleteTenant, getTenant, updateTenant } from '@/api/tenant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Query keys
export const TenantsKey = {
    all: ['tenants'] as const,
    lists: () => [...TenantsKey.all, 'list'] as const,
    list: (filters: string) => [...TenantsKey.lists(), { filters }] as const
};

// Get all tenant
export function useTenants() {
    return useQuery({
        queryKey: TenantsKey.lists(),
        queryFn: getTenant,
    });
}

export function useCreateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createTenant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TenantsKey.lists() });
            toast.success('Tenant berhasil ditambahkan');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menambahkan tenant');
        },
    });
}

// Update tenant
export function useUpdateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            updateTenant(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TenantsKey.lists() });
            toast.success('Tenant berhasil diupdate');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal mengupdate tenant');
        },
    });
}

// Delete tenant
export function useDeleteTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTenant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TenantsKey.lists() });
            toast.success('Tenant berhasil dihapus');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menghapus tenant');
        },
    });
}