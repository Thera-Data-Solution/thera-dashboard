import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/dashboard/user')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/dashboard/user"!</div>
}
