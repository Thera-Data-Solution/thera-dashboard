import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/content/article/')({
  loader: () => {
    throw redirect({
      to: '/app/content/articles', search: {
        page: 1,
        pageSize: 6
      }
    })
  }
})