import { createFileRoute, redirect } from '@tanstack/react-router'
import FirstApp from '@/components/layout/desk'

export const Route = createFileRoute('/dashboard')({
  component: FirstApp,
  loader: ({ context }) => {
    const { isLoggedIn, user } = context.authStore.getState();
    if (!isLoggedIn || user?.role === 'USER') {
      throw redirect({
        to: "/",
      });
    }
  },
  head: () => ({
    meta: [
      {
        title: "List Apps"
      }
    ]
  })
})