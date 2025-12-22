import Layout from '@/components/layout/default'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { isLoggedIn, user } = context.authStore.getState();
    if (!isLoggedIn || user?.role === 'USER') {
      throw redirect({
        to: "/",
      });
    }
  },
})

function RouteComponent() {
  return <Layout />
}
