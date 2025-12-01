import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/schedules')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/admin/schedules"!</div>
}
