import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { user } = context.authStore.getState();
    if (user?.role !== "SU") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
