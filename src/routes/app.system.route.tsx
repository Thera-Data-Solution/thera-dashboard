import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/system')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
        const { menu } = context.authStore.getState();
        if (!menu.includes("system")) {
            throw redirect({
                to: "/dashboard",
            });
        }
    },
})

function RouteComponent() {
    return <Outlet />
}
