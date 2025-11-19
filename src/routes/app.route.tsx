import Layout from '@/components/layout/default'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: Layout,
  loader: ({ context }) => {
    if (!context.authStore.getState().isLoggedIn) {
      throw redirect({
        to: "/",
      });
    }
  },
})