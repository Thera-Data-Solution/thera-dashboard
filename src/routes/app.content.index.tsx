import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/content/')({
  component: RouteComponent,
   loader: () => {
      throw redirect({
        to: "/app/content/articles",
      });
    }
})

function RouteComponent() {
  return <div>Loading....</div>
}
