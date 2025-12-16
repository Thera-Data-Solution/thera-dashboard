import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/categories/update/')({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({
      to: '/app/event/categories'
    })
  }
})

function RouteComponent() {
  return <div>Hello "/app/event/categories/update"!</div>
}
