import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/setting/collab')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/setting/collab"!</div>
}
