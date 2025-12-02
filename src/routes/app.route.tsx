import Layout from '@/components/layout/default'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  loader: ({ context }) => {
    if (!context.authStore.getState().isLoggedIn) {
      throw redirect({
        to: "/",
      });
    }
  },
})

function RouteComponent() {
  return <Layout />
}
