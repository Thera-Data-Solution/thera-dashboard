import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/dashboard/')({
  loader: () => {
    throw redirect({ to: '/app/dashboard/overview' })
  },
  component: RouteComponent,
})


function RouteComponent() {
  return <div>Hello "/app/dashboard"!</div>
}