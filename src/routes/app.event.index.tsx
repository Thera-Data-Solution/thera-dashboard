import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/event/"!</div>
}
