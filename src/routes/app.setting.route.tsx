import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/setting')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { menu } = context.authStore.getState();
    // You can add any logic here that needs to run before loading the route
    if (!menu.includes("website")) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
