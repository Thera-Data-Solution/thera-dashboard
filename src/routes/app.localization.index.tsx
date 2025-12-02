import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/localization/')({
  component: RouteComponent,
  loader: () => {
    throw redirect({
      to: "/app/localization/translate",
    });
  }

})

function RouteComponent() {
  return <div>Loading....</div>
}
