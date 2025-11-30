import { getTenant } from '@/api/tenant'
import { useTenants } from '@/hooks/tenantHook'
import TenantScreen from '@/screen/admin/tenant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/tenant')({
    component: RouteComponent,
    // loaderDeps: ({ search: { page } }) => ({ page }),
    loader: ({ context }) => {
        context.queryClient.prefetchQuery({
            queryKey: ["tenants"],
            queryFn: () => getTenant(),
        })
    },
})

function RouteComponent() {
    const { data: tenant } = useTenants();
    return <TenantScreen data={tenant || []} />
}
