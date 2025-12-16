import { createFileRoute } from '@tanstack/react-router'
import FirstApp from '@/components/layout/desk'

export const Route = createFileRoute('/dashboard')({
  component: FirstApp,
  head: () => ({
    meta: [
      {
        title: "List Apps"
      }
    ]
  })
})