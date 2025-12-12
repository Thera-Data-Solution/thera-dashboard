import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/content/')({
  component: RouteComponent,
   loader: () => {
      throw redirect({
        to: "/app/content/articles",
        search: {
          page: 1,
          pageSize: 6
        }
      });
    }
})

function RouteComponent() {
  return <div>Loading....</div>
}
