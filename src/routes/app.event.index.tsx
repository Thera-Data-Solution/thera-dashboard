import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/')({
  beforeLoad: () => {
    throw redirect({ to: '/app/event/categories' })
  }
})