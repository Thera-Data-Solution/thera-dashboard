import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/content')({
    component: RouteComponent,
    beforeLoad: async ({ context }) => {
        const { menu } = context.authStore.getState();
        if (!menu.includes("content")) {
            throw redirect({
                to: "/dashboard",
            });
        }
    },
})

function RouteComponent() {
    return <Outlet />
}
