import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/localization')({
    component: RouteComponent,
    beforeLoad: async ({ context }) => {
        const { menu } = context.authStore.getState();
        if (!menu.includes("translation")) {
            throw redirect({
                to: "/dashboard",
            });
        }
    },
})

function RouteComponent() {
    return <Outlet />
}
