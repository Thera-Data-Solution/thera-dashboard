import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/admin/categories"!</div>
}
