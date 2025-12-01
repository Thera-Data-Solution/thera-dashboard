import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/tenant-user')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/admin/tenant-user"!</div>
}
